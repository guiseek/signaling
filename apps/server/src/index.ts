import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 3000 })

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data.toString())
      }
    })
  })
})

wss.on('listening', () => {
  console.log(`⚡️ running on port 3000`);
})