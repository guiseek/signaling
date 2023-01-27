import { ChannelSignaling, SocketSignaling } from './adapter'
import { Signaling } from './ports/signaling'
import { setProvider } from './core'

setProvider(Signaling<WebRTCMap>, ChannelSignaling<WebRTCMap>)

// Execute "npm run dev:server" antes de usar o SocketSignaling
// setProvider(Signaling<WebRTCMap>, SocketSignaling<WebRTCMap>)
