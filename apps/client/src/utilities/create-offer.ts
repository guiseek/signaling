export const createOffer = async (peer: RTCPeerConnection) => {
  const sdp = await peer.createOffer()
  await peer.setLocalDescription(sdp)
  return sdp
}
