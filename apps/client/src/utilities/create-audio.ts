export const createAudio = () => {
  const audio = document.createElement('audio')
  audio.controls = true
  audio.autoplay = true
  return audio
}
