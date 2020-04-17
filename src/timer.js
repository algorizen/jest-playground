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