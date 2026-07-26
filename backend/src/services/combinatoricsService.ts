export function factorial(number: number): number {
  let result = 1;

  for (let value = 2; value <= number; value++) {
    result *= value;
  }

  return result;
}

export function calculateCombinationCount(n: number, r: number): number {
  if (r < 0 || r > n) {
    return 0;
  }

  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function generateCombinations<T>(elements: T[], size: number): T[][] {
  const results: T[][] = [];

  function combine(startIndex: number, currentCombination: T[]) {
    if (currentCombination.length === size) {
      results.push([...currentCombination]);
      return;
    }

    for (let index = startIndex; index < elements.length; index++) {
      currentCombination.push(elements[index] as T);
      combine(index + 1, currentCombination);
      currentCombination.pop();
    }
  }

  combine(0, []);

  return results;
}