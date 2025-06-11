// status.js
export async function loadCharacters() {
  const res = await fetch('/data/status.json');
  const data = await res.json();
  return data.characters;
}

export async function loadEnemies() {
  const res = await fetch('/data/status2.json');
  const data = await res.json();
  return data.enemies;
}