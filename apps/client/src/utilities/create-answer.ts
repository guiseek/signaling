export const createAnswer = async (
  peer: RTCPeerConnection,
  options?: RTCAnswerOptions
) => {
  const sdp = await peer.createAnswer(options)
  await peer.setLocalDescription(sdp)
  return sdp
}
