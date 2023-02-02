export const createAudio = () => {
  const audio = document.createElement('audio')
  audio.controls = false
  audio.autoplay = true
  return audio
}
