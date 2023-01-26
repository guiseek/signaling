export const log = (
  peer: RTCPeerConnection,
  state: 'connection' | 'signaling' | 'iceConnection' | 'iceGathering'
) => {
  console.log(
    `${state}: %c${peer[`${state}State`].toUpperCase()}`,
    'color:lime'
  )
}
