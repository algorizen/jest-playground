import axios from 'axios'
import Utils from './utils'

export const runCallback = (func) => {
  func()
}

export const createObject = (classItem) => {
  new classItem()
}

export const fetchData = () => {
  return axios.get('https://api.xxxx').then((res) => res.data)
}

export const getNumber = () => {
  return 123  
}

export const initUtils = (a, b) => {
  const utils = new Utils()
  return utils.a(a, b) + utils.b(b, a)
}

