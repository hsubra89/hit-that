// Mostly an implementation of "dropUntil" except that
// it also returns the distance until it evaluates to a valid condition.
// DOES NOT MUTATE
export function getDistanceAndResult<T>(input: T[], condition: (x: T) => boolean): { index: number, result: T[] } {

  let index = 0

  while (index < input.length && !condition(input[index])) {
    index++
  }

  return { index, result: input.slice(index) }
}

// This is a logical scoring of distance between the char ordering
// We could use algorithms like levenshtein distance, but they don't
// seem like they would solve the problem.
export function scoreBetweenCharArrays(target: string[], charOrder: string[]) {

  // If either array is empty,
  // return `0`
  if (!charOrder.length) {
    return 0
  }

  if (!target.length) {
    return Infinity
  }

  // We don't care about scoring before we encounter the "first" character.
  // We also want to start scoring after the character.
  const [char, ...restChars] = charOrder
  const [, ...filtered] = getDistanceAndResult(target, x => x === char).result

  let score = 0
  let arr = filtered

  for (const char of restChars) {
    // Get "count" and "filtered" array up to the next subsequent character.
    // We also want to not score this character any more, so we need to skip
    // this character from the arr on the next iteration.
    const { index, result } = getDistanceAndResult(arr, x => x === char)
    const [, ...filteredArr] = result
    score += index
    arr = filteredArr
  }

  return score
}

export function partition<T>(elems: T[], predicate: (x: T) => boolean): [T[], T[]] {

  const truthy: T[] = []
  const falsy: T[] = []
  const arr = elems.slice()

  let elem: T | undefined

  while (elem = arr.shift()) {
    if (predicate(elem)) {
      truthy.push(elem)
    } else {
      falsy.push(elem)
    }
  }

  return [truthy, falsy]
}
