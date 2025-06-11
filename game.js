// game.js
import { loadStages, startStage } from './stage.js';
import { loadGachaRates, doGacha } from './gacha.js';
import { loadCharacters, loadEnemies } from './status.js';

let stages = [];
let gachaRates = [];
let characters = [];
let enemies = [];

let ticketCount = 0;
let cost = 100;

const SAVE_KEY = 'nyankoGameSave';

function updateUI() {
  document.getElementById('ticket').textContent = ticketCount;
  document.getElementById('cost').textContent = cost;
}

function saveGame() {
  const saveData = {
    ticketCount,
    cost,
    stages,
    // 将来的に所持キャラや進行状況も追加可能
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  console.log('ゲームセーブ完了');
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return false;
  try {
    const data = JSON.parse(saved);
    ticketCount = data.ticketCount ?? 0;
    cost = data.cost ?? 100;
    stages = data.stages ?? [];
    console.log('ゲームロード完了');
    return true;
  } catch (e) {
    console.warn('セーブデータの読み込みに失敗:', e);
    return false;
  }
}

async function init() {
  stages = await loadStages();
  gachaRates = await loadGachaRates();
  characters = await loadCharacters();
  enemies = await loadEnemies();

  if (!loadGame()) {
    ticketCount = 0;
    cost = 100;
  }

  updateUI();
}

document.getElementById('startStageBtn').addEventListener('click', () => {
  if (stages.length === 0) {
    alert('もうステージはありません！');
    return;
  }
  const stage = stages.shift();
  startStage(stage);
  ticketCount += stage.ticketReward;
  updateUI();
  saveGame();
});

document.getElementById('gachaBtn').addEventListener('click', () => {
  if (ticketCount <= 0) {
    alert('チケットが足りません！');
    return;
  }
  const reward = doGacha(gachaRates);
  alert(`ガチャ結果: ${reward.name}をゲット！`);
  ticketCount--;
  updateUI();
  saveGame();
});

init();