import { io } from 'socket.io-client'

const baseURL = 'http://localhost:8022'

const socket = io(baseURL)

const motd = async (): Promise<string> => {
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

export { socket, motd }
