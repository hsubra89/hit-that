
import { getDistanceAndResult, scoreBetweenCharArrays } from '../src/utils'

test('getDistanceAndResult', () => {
  const source = 'hello'.split('')
  expect(getDistanceAndResult(source, x => x === 'h').result).toEqual(source)
  expect(getDistanceAndResult(source, x => x === 'e').result).toEqual(['e', 'l', 'l', 'o'])
  expect(getDistanceAndResult(source, x => x === 'o').result).toEqual(['o'])
  expect(getDistanceAndResult(source, x => x === 'w').result).toEqual([])
})

test('scoreBetweenCharArrays', () => {

  const source = "photoshopbattles".split('')
  const target = "psbattle".split('')

  const score = scoreBetweenCharArrays(source, target)
  expect(score).toEqual(7)
})

test('scoreBetweenCharArrays', () => {

  const source = "science".split('')
  const target = "since".split('')

  const score = scoreBetweenCharArrays(source, target)
  expect(score).toEqual(2)
})
