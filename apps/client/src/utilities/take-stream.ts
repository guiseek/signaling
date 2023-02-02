export const takeStream = (constraints?: MediaStreamConstraints) => {
  return navigator.mediaDevices.getUserMedia(
    constraints ? constraints : { audio: true }
  )
}
