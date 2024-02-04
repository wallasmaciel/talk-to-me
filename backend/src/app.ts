import express, { Application } from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'

class App {
  private app: Application
  private http: http.Server
  private io: Server
  constructor() {
    this.app = express()
    this.http = http.createServer(this.app)
    this.io = new Server(this.http, {
      cors: {
        origin: '*',
      },
    })
  }

  public listen(port: number) {
    this.http.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

  public listenSocket() {
    this.io.of('/streams').on('connection', this.socketEvents)
  }

  private socketEvents(socket: Socket) {
    console.log('Socket connected: ' + socket.id)
    socket.on('subscribe', data => {
      console.log('usuario inserido na sala: ' + data.roomId)
      socket.join(data.roomId)

      socket.on('chat', data => {
        console.log('App ~ socket.on ~ data:', data, data.roomId)
        socket.broadcast.to(data.roomId).emit('chat', {
          message: data.message,
          username: data.username,
          time: data.time,
        })
      })
    })
  }
}

export { App }