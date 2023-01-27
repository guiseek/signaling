import { state } from './state'

export const stateUpdater = (peer: RTCPeerConnection) => {
  /**
   * Keeps states up to date
   */
  peer.onicecandidate = (ev) => {
    state.update('candidate', ev.candidate)
  }
  peer.onsignalingstatechange = () => {
    state.update('signaling', peer.signalingState)
  }
  peer.oniceconnectionstatechange = () => {
    state.update('iceConnection', peer.iceConnectionState)
  }
  peer.onconnectionstatechange = () => {
    state.update('connection', peer.connectionState)
  }
  peer.onicegatheringstatechange = () => {
    state.update('iceGathering', peer.iceGatheringState)
  }
  peer.onnegotiationneeded = async () => {
    const { negotiationAttempts } = state.value()
    const value = negotiationAttempts + 1
    state.update('negotiationAttempts', value)
  }
  peer.ontrack = ({ track }) => {
    if (track) {
      const { stream } = state.value()
      stream.addTrack(track)
      state.update('stream', stream)
    }
  }
}
