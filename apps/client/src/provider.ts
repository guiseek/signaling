import { Signaling } from './ports/signaling'
// import { ChannelSignaling } from './adapter'
import { SocketSignaling } from './adapter'
import { setProvider } from './core'

/**
 * @tutorial LAN network
 * @description
 * Para localhost entre diferentes abas do navegador
 * Usa BroadcastChannel como provider de comunicação
 *
 * @tutorial 1º terminal, execute:
 * @example `sh npm run dev:client
 *
 * @tutorial 2º abra duas abas
 * @see http://localhost:5173
 *
 * @tutorial 3º set ChannelSignaling
 * @example
 * ```ts
 * setProvider(
 *   Signaling<WebRTCMap>,
 *   ChannelSignaling<WebRTCMap>
 * )
 * ```
 */

// setProvider(Signaling<WebRTCMap>, ChannelSignaling<WebRTCMap>)

/* ---  ---  ---  ---  ---  ---  ---  --- --- */

/**
 * @tutorial WAN network
 * @description
 * Para internet entre diferentes pontos do mundo
 * Usa WebSocket no processo de sinalização e p2p
 *
 * @tutorial 1º terminal, execute:
 * @example `sh npm run dev:server
 *
 * @tutorial 2º terminal, execute:
 * @example `sh npm run dev:client
 *
 * @tutorial 3º set SocketSignaling
 * @example
 * ```ts
 * setProvider(
 *   Signaling<WebRTCMap>,
 *   SocketSignaling<WebRTCMap>
 * )
 * ```
 */

setProvider(Signaling<WebRTCMap>, SocketSignaling<WebRTCMap>)
