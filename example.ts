/// <reference lib="dom" />
import { multiAggregate } from "./src";

function computeStats(vals: readonly number[]): {
  count: number;
  sum: number;
  mean: number;
} {
  const sum = vals.reduce((s, a) => s + a);
  return {
    count: vals.length,
    sum,
    mean: sum / vals.length,
  };
}
const data = [
  { date: new Date(2020, 11, 8), steps: 803 },
  { date: new Date(2021, 1, 8), steps: 140 },
  { date: new Date(2021, 1, 9), steps: 2240 },
  {
    date: new Date(2021, 1, 17),
    steps: 640,
    calories: 42,
    flavor: "hernekeitto",
  },
];
const multiAgged = multiAggregate(
  data,
  {
    weekday: (t) => String(t.date.getDay()),
    year: (t) => String(t.date.getFullYear()),
  },
  computeStats,
);

console.log(
  [data, multiAgged].map((d) => JSON.stringify(d, null, 2)).join("\n"),
);
