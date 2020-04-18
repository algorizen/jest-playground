import $ from 'jquery'
import { addDivToBody } from '../src/dom'

test('test addDivToBody', () => {
  addDivToBody()
  addDivToBody()
  expect($('body').find('div').length).toBe(2)
})