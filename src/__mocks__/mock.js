export const fetchData = () => {
  return new Promise((resolve, reject) => {
    resolve(`;(() => {return '123'})()`)
  })
}