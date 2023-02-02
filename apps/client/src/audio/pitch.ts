import { Voice } from './voice'

export const pitch = (stream: MediaStream) => {
  const audioContext = new AudioContext()
  const mediaStreamSource = audioContext.createMediaStreamSource(stream)
  const delay = audioContext.createDelay()
  delay.delayTime.value = 0
  mediaStreamSource.connect(delay)

  const voice = new Voice(audioContext)
  voice.setPitchOffset(1.6)

  delay.connect(voice.input)
  voice.output.connect(audioContext.destination)

  const input = document.createElement('input')
  input.type = 'range'
  input.min = `-2`
  input.max = `2`
  input.oninput = () => {
    voice.setPitchOffset(input.valueAsNumber)
  }

  return input
}
