export type Grouper<TInp> = (t: TInp) => string | undefined;
export type Aggregator<TStat> = (numbers: number[]) => TStat;

export function groupBy<T>(
  objs: readonly T[],
  grouper: Grouper<T>,
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    const val = grouper(obj);
    if (val !== undefined) {
      (grouped[val] || (grouped[val] = [])).push(obj);
    }
  }
  return grouped;
}

export function mapObject<TS, TD>(
  obj: Record<string, TS>,
  func: (val: TS) => TD,
): Record<string, TD> {
  const out: Record<string, TD> = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      out[key] = func(obj[key]);
    }
  }
  return out;
}

function groupNumbers<T extends object>(
  objs: readonly T[],
): Record<string, number[]> {
  const vals: Record<string, number[]> = {};
  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    for (let prop in obj) {
      const val = obj[prop];
      if (typeof val === "number") {
        (vals[prop] || (vals[prop] = [])).push(val);
      }
    }
  }
  return vals;
}

export function aggregate<TInp extends object, TStat>(
  data: readonly TInp[],
  grouper: Grouper<TInp>,
  aggregator: Aggregator<TStat>,
): Record<string, Record<string, TStat>> {
  return mapObject(groupBy(data, grouper), (objs) =>
    mapObject(groupNumbers(objs), aggregator),
  );
}

export function multiAggregate<TInp extends object, TStat>(
  data: readonly TInp[],
  groupers: Record<string, Grouper<TInp>>,
  aggregator: Aggregator<TStat>,
): Record<string, Record<string, Record<string, TStat>>> {
  return mapObject(groupers, (grouper) => aggregate(data, grouper, aggregator));
}
