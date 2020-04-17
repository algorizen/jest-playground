import { fetchData } from '../src/fetchData'

test.only('test async code', (done) => {
  fetchData((data) => {
    expect(data).toEqual({
      success: true
    })
  })
  done()
})

test('test async code', () => {
  return fetchData().then((res) => {
    expect(res.data).toEqual({
      success: true
    })
  })
})

test('test async code', () => {
  // 至少执行一次 expect
  expect.assertions(1)
  return fetchData().catch((e) => {
    expect(e.toString().includes('404')).toBe(true)
  })
})

test('test async code', () => {
  return fetchData().resolves.toMatchObject({
    data: {
      success: true
    }
  })
})

test('test async code', () => {
  return fetchData().rejects.toThrow()
})

test('test async code', async () => {
  try {
    const res = await fetchData()
    expect(res.data).toEqual({
      success: true
    })
  } catch (e) {
    expect(e.toString().toThrow())
  }
})

