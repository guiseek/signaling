const answerStates: RTCSignalingState[] = [
  'have-remote-offer',
  'have-local-pranswer',
]
export const canAnswer = (state: RTCSignalingState) => {
  return answerStates.includes(state)
}
