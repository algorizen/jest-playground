import { timerOne, timerTwo } from '../src/timer'

jest.useFakeTimers()

test('test timerOne', () => {
  const fn = jest.fn()
  timerOne(fn)
  // 让所有计时器立即执行完成
  jest.runAllTimers()
  expect(fn).toHaveBeenCalledTimes(1)
})

test.only('test timerTwo', () => {
  const fn = jest.fn()
  timerTwo(fn)
  // 立即执行队列中的timer，没有加入的不运行
  // jest.runOnlyPendingTimers()
  jest.advanceTimersByTime(3000)
  expect(fn).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(3000)
  expect(fn).toHaveBeenCalledTimes(2)
})