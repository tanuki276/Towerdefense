// stage.js

let enemiesOnField = [];
let enemyProductionTimer = null;
let enemySpawnCount = 0;

export async function loadStages() {
  const res = await fetch('/data/Stage.json');
  const data = await res.json();
  return data.stages;
}

export function startStage(stage, enemyData, onEnemySpawn) {
  alert(`ステージ開始: ${stage.name}\n${stage.description}`);

  enemiesOnField = [];
  enemySpawnCount = 0;

  if (stage.enemyProduction.type === 'fixedInterval') {
    enemyProductionTimer = setInterval(() => {
      if (stage.enemyProduction.limit !== -1 && enemySpawnCount >= stage.enemyProduction.limit) {
        clearInterval(enemyProductionTimer);
        return;
      }
      spawnEnemy(stage.enemyProduction.enemyId, enemyData, onEnemySpawn);
      enemySpawnCount++;
    }, stage.enemyProduction.interval);
  } else if (stage.enemyProduction.type === 'mixedInterval') {
    let index = 0;
    enemyProductionTimer = setInterval(() => {
      if (stage.enemyProduction.limit !== -1 && enemySpawnCount >= stage.enemyProduction.limit) {
        clearInterval(enemyProductionTimer);
        return;
      }
      const enemyConfig = stage.enemyProduction.enemies[index];
      spawnEnemy(enemyConfig.enemyId, enemyData, onEnemySpawn);
      enemySpawnCount++;
      index = (index + 1) % stage.enemyProduction.enemies.length;
    }, 1000);
  }

}

function spawnEnemy(enemyId, enemyData, onEnemySpawn) {
  const enemyInfo = enemyData.find(e => e.id === enemyId);
  if (!enemyInfo) {
    console.error(`敵データが見つかりません: ${enemyId}`);
    return;
  }
  const enemy = {
    id: enemyInfo.id,
    name: enemyInfo.name,
    hp: enemyInfo.stats.hp,
    attack: enemyInfo.stats.attack,
    speed: enemyInfo.stats.speed,
    description: enemyInfo.description,
  };
  enemiesOnField.push(enemy);

  if (typeof onEnemySpawn === 'function') {
    onEnemySpawn(enemy);
  }
}

export function stopStage() {
  if (enemyProductionTimer) {
    clearInterval(enemyProductionTimer);
    enemyProductionTimer = null;
  }
  enemiesOnField = [];
}