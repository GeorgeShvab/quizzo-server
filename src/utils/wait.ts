function wait(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(null), ms)
  })
}

export default wait
