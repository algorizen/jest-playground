import { generateConfig } from '../src/snap'

// test('test generateConfig', () => {
//   expect(generateConfig()).toMatchSnapshot({
//     time: expect.any(Date)
//   })
// })

test('test generateConfig', () => {
  expect(generateConfig()).toMatchInlineSnapshot(
    {
      time: expect.any(Date),
    },
    `
    Object {
      "port": 8080,
      "server": "https://localhost",
      "time": Any<Date>,
    }
  `
  )
})
