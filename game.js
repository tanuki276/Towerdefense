// game.js
import { loadStages, startStage } from './stage.js';
import { loadGachaRates, doGacha } from './gacha.js';

let stages = [];
let gachaRates = [];
let ticketCount = 0;
let cost = 100;

function updateUI() {
  document.getElementById('ticket').textContent = ticketCount;
  document.getElementById('cost').textContent = cost;
}

async function init() {
  stages = await loadStages();
  gachaRates = await loadGachaRates();
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
});

init();