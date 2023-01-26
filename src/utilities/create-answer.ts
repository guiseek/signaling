export const createAnswer = async (
  peer: RTCPeerConnection,
  offer: RTCSessionDescription
) => {
  await peer.setRemoteDescription(offer)
  const sdp = await peer.createAnswer()
  await peer.setLocalDescription(sdp)
  return sdp
}
