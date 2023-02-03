import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 3000 })

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      console.log(client.readyState);
      if (client.readyState === 1) {
        console.log(client.readyState);
        console.log(data.toString());
        
        client.send(data.toString())
      }
    })
  })
})

wss.on('listening', () => {
  console.log(`running on port 3000`);
  
})