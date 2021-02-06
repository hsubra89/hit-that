export function dropWhile<T>(input: T[], condition:(x: T) => boolean): T[] {

  const arr = input

  while(arr.length) {
    if(!condition(arr[0])) {
      return arr
    }

    arr.shift()
  }

  return []
}

export function getDistanceAndResult<T>(input: T[], condition: (x: T) => boolean): { count: number, arr: T[] } {

  const arr = input
  let count = 0

  while(arr.length) {

    if(!condition(arr[0])) {
      return { count, arr }
    }

    arr.shift()
    count++
  }

  return { count, arr: [] }
}
