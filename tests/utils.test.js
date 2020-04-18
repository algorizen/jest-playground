import Utils from '../src/utils'

let utils = null

beforeAll(() => {
  utils = new Utils()
})

test('test class utils a', () => {
  expect(utils.a(1, 2)).toBe(3)
})

test('test class utils b', () => {
  expect(utils.b(2, 1)).toBe(1)
})
