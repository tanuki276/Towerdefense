// gacha.js
export async function loadGachaRates() {
  const res = await fetch('/data/gacha.json');
  const data = await res.json();
  return data.gachaRates;
}

export function doGacha(gachaRates) {
  const total = gachaRates.reduce((sum, c) => sum + c.rate, 0);
  const rand = Math.random() * total;
  let accum = 0;
  for (const char of gachaRates) {
    accum += char.rate;
    if (rand < accum) return char;
  }
}