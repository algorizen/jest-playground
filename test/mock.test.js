// jest.mock('../src/mock')
jest.mock('../src/utils')

import Axios from 'axios'
import { runCallback, createObject, fetchData, initUtils } from '../src/mock'
import Utils from '../src/utils'

const { getNumber } = jest.requireActual('../src/mock')

// jest.mock('axios')

test.only('test initUtils extends utils', () => {
  initUtils()
  expect(Utils).toHaveBeenCalled()
  console.log(Utils.mock.instances)

  expect(Utils.mock.instances[0].a).toHaveBeenCalled()
  expect(Utils.mock.instances[0].b).toHaveBeenCalled()
})


test('test fetchData', async () => {
  await fetchData().then((data) => {
    expect(eval(data)).toEqual('123')
  })
})

test('test getNumber', () => {
  expect(getNumber()).toBe(123)
})


test('test runCallback', () => {
  const func = jest.fn()

  func.mockReturnValueOnce('return value').mockReturnValueOnce('X')
  // 等同于 func.mockReturnThis()
  // func.mockImplementation(() => this)
  func.mockReturnThis()
  runCallback(func)
  runCallback(func)
  runCallback(func)
  expect(func).toBeCalled()
  expect(func.mock.calls.length).toBe(3)
  expect(func.mock.results[0].value).toBe('return value')
  expect(func.mock.results[1].value).toBe('X')
  expect(func.mock.results[2].value).toBeUndefined()
  // toBeCalledWith 每次调用都时候都是 abc
  // expect(func).toBeCalledWith('abc')
  console.log(func.mock)
})

/**
 * func.mock
 *
 * {
 *   calls: [ [], [], [] ],
 *   instances: [ undefined, undefined, undefined ],
 *   invocationCallOrder: [ 1, 2, 3 ],
 *   results: [
 *     { type: 'return', value: 'return value' },
 *     { type: 'return', value: 'X' },
 *     { type: 'return', value: undefined }
 *   ]
 * }
 *
 */

test('test createObject', () => {
  const func = jest.fn()
  createObject(func)
  console.log(func.mock)
})

/**
 * func.mock
 *
 * {
 *   calls: [ [] ],
 *   instances: [ mockConstructor {} ],
 *   invocationCallOrder: [ 1 ],
 *   results: [ { type: 'return', value: undefined } ]
 * }
 *
 */

test('test fetchData', async () => {
  Axios.get.mockResolvedValue({
    data: `;(() => {return '123'})()`,
  })
  await fetchData().then((data) => {
    expect(eval(data)).toEqual('123')
  })
})