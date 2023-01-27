export const createOffer = async (peer: RTCPeerConnection, options?: RTCOfferOptions) => {
  const sdp = await peer.createOffer(options)
  await peer.setLocalDescription(sdp)
  return sdp
}
