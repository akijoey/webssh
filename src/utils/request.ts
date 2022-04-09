const baseURL = 'http://localhost:8022'

const fetchMotd = async (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fetch(`${baseURL}/motd`)
      .then(res => {
        if (res.status === 200) {
          res.text().then(text => {
            setTimeout(() => {
              resolve(text)
            }, 50)
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export { baseURL, fetchMotd }
