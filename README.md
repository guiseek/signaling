# WebRTC Simple WebSocket Signaling Server

## LAN

### Como funciona

- Para localhost entre diferentes abas do navegador
- Usa BroadcastChannel como provider de comunicação

### Como executa

1. Execute no terminal `sh npm run dev:client`
1. Abra http://localhost:5173 em duas abas

### Como usa

```ts
setProvider(Signaling<WebRTCMap>, ChannelSignaling<WebRTCMap>)
```

## WAN

### Como funciona

- Para internet entre diferentes pontos do mundo
- Usa WebSocket no processo de sinalização e p2p

### Como executa

1. Execute no terminal `sh npm run dev:client`
1. Execute no terminal `sh npm run dev:server`
1. Abra http://localhost:5173 em duas abas

### Como usa

```ts
setProvider(Signaling<WebRTCMap>, SocketSignaling<WebRTCMap>)
```
