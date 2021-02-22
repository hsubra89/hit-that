
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

test('scoreBetweenCharArrays - large multiline', () => {

  const source = `city cave
inbox
city cave paddington, qld appointment confirmed: mon september 28th at 6pm in infrared sauna 2
 -
dear harish, this confirms your reservation for your couples infrared sauna on mon september 28th at 6pm. please arrive at least fifteen minutes before your couples infrared sauna. we can't wait to

9/27/20`.split('')

  const target = "cave".split('')

  const score = scoreBetweenCharArrays(source, target)
  expect(score).toEqual(5)
})

