export function pickNRandom(arr, n) {
  // When `n` is more than or equal to the number of elements in `arr`, early return.
  if (n >= arr.length) {
    return arr;
  }

  // Create 2 arrays, 1 for result, 1 for the "source pool".
  const result = [];
  const source = [...arr];

  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * source.length);
    // By splicing here, we also ensure that elements in `result` will be unique,
    // since elements that are spliced won't be picked anymore.
    const [spliced] = source.splice(idx, 1);
    result.push(spliced);
  }

  return result;
}

export function pickOneRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getMinMax(arr) {
  let min = arr[0];
  let max = arr[0];
  let i = arr.length;

  while (i--) {
    min = arr[i] < min ? arr[i] : min;
    max = arr[i] > max ? arr[i] : max;
  }
  return { min, max };
}
