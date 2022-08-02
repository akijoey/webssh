import { io } from 'socket.io-client'

const baseURL = '/'

const socket = io(baseURL)

const motd = async (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fetch(`${baseURL}motd`)
      .then(res => {
        if (res.status === 200) {
          res.text().then(text => {
            resolve(text)
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
