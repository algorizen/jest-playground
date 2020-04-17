# jest-playground

Leaning jest.

project use yarn 2.

## Jest Basic

**目录**

- [匹配器 matchers](#匹配器-matchers)
- [异步代码](#异步代码)
- [钩子函数](#钩子函数)
- [mock](#mock)
- [timer](#timer)
- [snapshot](#snapshot)
- [dom](#dom)

### 匹配器 matchers

文档五分钟

使用 `expect` 及 `matcher` 来**断言**

### 异步代码

```
// fetchData.js
export const fetchData = () => {
  return axios.get('https://api.xxxx')
}
```

#### done()


```
// fetchData.test.js
import { fetchData } from '../src/fetchData'

test('test async code', (done) => {
  fetchData((data) => {
    expect(data).toEqual({
      success: true
    })
  })
  done()
})
```

#### .then() 和 .catch()


```
// fetchData.test.js
import { fetchData } from '../src/fetchData'

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
```

#### .resolves 和  .rejects

```
// fetchData.test.js
import { fetchData } from '../src/fetchData'

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
```

#### async / await

```
// fetchData.test.js
import { fetchData } from '../src/fetchData'

test('test async code', async () => {
  await fetchData().resolves.toMatchObject({
    data: {
      success: true
    }
  })
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
```

### 钩子函数

```
beforeAll(() => console.log('1 - beforeAll'))
afterAll(() => console.log('1 - afterAll'))
beforeEach(() => console.log('1 - beforeEach'))
afterEach(() => console.log('1 - afterEach'))
test('', () => console.log('1 - test'))
describe('Scoped / Nested block', () => {
  console.log('2 - not scope')
  beforeAll(() => console.log('2 - beforeAll'))
  afterAll(() => console.log('2 - afterAll'))
  beforeEach(() => console.log('2 - beforeEach'))
  afterEach(() => console.log('2 - afterEach'))
  test('', () => console.log('2 - test'))
})

/**
 * 2 - not scope (代码得放到钩子函数里，不然会全局提升先执行)
 * 1 - beforeAll
 * 1 - beforeEach
 * 1 - test
 * 1 - afterEach
 * 2 - beforeAll
 * 1 - beforeEach
 * 2 - beforeEach
 * 2 - test (test 虽然在 describe 里，但在执行前会先执行全局的 beforeEach 再执行 scope 里面的 beforeEach )
 * 2 - afterEach
 * 1 - afterEach
 * 2 - afterAll
 * 1 - afterAll
 */
```

### mock

```
// mock.js
import axios from 'axios'

export const runCallback = (func) => {
  func()
}

export const createObject = (classItem) => {
  new classItem()
}

export const fetchData = () => {
  return axios.get('https://api.xxxx').then((res) => res.data)
}
```

```
// mock.test.js
import Axios from 'axios'
import { runCallback, createObject, fetchData } from '../src/mock'

jest.mock('axios')

test('test runCallback', () => {
  const func = jest.fn()

  func.mockReturnValueOnce('return value').mockReturnValueOnce('X')
  // 等同于 func.mockReturnThis()
  func.mockImplementation(() => this)

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
```


mock 函数的作用：

1. 捕获函数的调用和返回结果，以及 this 和调用顺序
2. 它可以让我们自由的设置返回结果
3. 改变内部函数内部的实现

#### mock高级操作

目录树

```
$ tree
.
├── jest.config.js
├── Node_modules
├── package.json
├── src
│   ├── __mocks__
│   │   └── mock.js
│   └── mock.js
├── test
│   └── mock.test.js
└── yarn.lock
```

**`__mocks__` 需要和测试的文件同一级**

```
// ./src/__mocks__/mock.js

export const fetchData = () => {
  return new Promise((resolve, reject) => {
    resolve(`;(() => {return '123'})()`)
  })
}
```

```
// ./src/mock.js

export const fetchData = () => {
  return axios.get('https://api.xxxx').then((res) => res.data)
}
```

```
// ./test/mock.test.js

/**
 * jest.config.js 里面配置 automock: true 
 * 可省略 jest.mock('xxx')
 * 
 * 自动会去 __mocks__ 下找 mock.js
 */
jest.mock('../src/mock')

import { fetchData } from '../src/mock'

const { getNumber } = jest.requireActual('../src/mock')

test('test fetchData', async () => {
  await fetchData().then((data) => {
    expect(eval(data)).toEqual('123')
  })
})

test('test getNumber', () => {
  expect(getNumber()).toBe(123)
})
```

#### 类的mock

**单元测试**（只对我自己的一些功能点做测试）

```
// utils.js
export default class Utils {
  a(a, b) {
    // ... 异常复杂
    return a + b
  }

  b(a, b) {
    // ... 异常复杂
    return a - b
  }
}
```

```
// utils.test.js
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
```

**集成测试**（我功能点下所有的模块、所有依赖一起测试）

```
// mock.js
import Utils from './utils'

export const initUtils = (a, b) => {
  const utils = new Utils()
  return utils.a(a, b) + utils.b(b, a)
}

// mock.test.js
jest.mock('../src/utils')
import { initUtils } from '../src/mock'
import Utils from '../src/utils'

test.only('test initUtils extends utils', () => {
  initUtils()
  expect(Utils).toHaveBeenCalled()
  console.log(Utils.mock.instances)

  expect(Utils.mock.instances[0].a).toHaveBeenCalled()
  expect(Utils.mock.instances[0].b).toHaveBeenCalled()
})
```

### timer

`jest.useFakeTimers()`

- `jest.runAllTimers()` - 让所有计时器立即执行完成
- `jest.runOnlyPendingTimers()` - 立即执行队列中的timer，没有加入的不运行
- `jest.advanceTimersByTime(msToRun)` - 所有计时器都会提前 `msToRun` 毫秒

```
// timer.js
export const timerOne = (cb) => {
  setTimeout(() => {
    cb()
  }, 3000)
}

export const timerTwo = (cb) => {
  setTimeout(() => {
    cb()
    setTimeout(() => {
      cb()
    }, 3000)
  }, 3000)
}
```

```
// timer.test.js

import timer from '../src/timer'

jest.useFakeTimers()

test('test timer', () => {
  const fn = jest.fn()
  timer(fn)
  // 让所有计时器立即执行完成
  jest.runAllTimers()
  expect(fn).toHaveBeenCalledTimes(1)
})

test('test timerTwo', () => {
  const fn = jest.fn()
  timerTwo(fn)
  // 立即执行队列中的timer，没有加入的不运行
  jest.runOnlyPendingTimers()
  expect(fn).toHaveBeenCalledTimes(1)
})

test('test timerTwo', () => {
  const fn = jest.fn()
  timerTwo(fn)
  // 立即执行队列中的timer，没有加入的不运行
  // jest.runOnlyPendingTimers()
  jest.advanceTimersByTime(3000)
  expect(fn).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(3000)
  expect(fn).toHaveBeenCalledTimes(2)
})
```

### snapshot

```
// snap.js
export const generateConfig = () => {
  return {
    server: 'https://localhost',
    port: 8080,
    time: new Date()
  }
}
```

```
// snap.test.js
import { generateConfig } from '../src/snap'

test('test generateConfig', () => {
  expect(generateConfig()).toMatchSnapshot({
    time: expect.any(Date)
  })
})
```

使用 `toMatchInlineSnapshot` 需要安装 Prettier(`yarn add prettier --dev --exact`)。

```
// snap.test.js
import { generateConfig } from '../src/snap'

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
```

### dom

```
// dom.js
import $ from 'jquery'

export const addDivToBody = () => {
  $('body').append('<div></div>')
}
```

```
// dom.test.js
import $ from 'jquery'
import { addDivToBody } from '../src/dom'

test('test addDivToBody', () => {
  addDivToBody()
  addDivToBody()
  expect($('body').find('div').length).toBe(2)
})
```

Jest 跑在 Node.js 环境不具备 DOM。
Jest 在 Node.js 环境下自己模拟实现了一套 DOM 的 API —— JSDOM。









