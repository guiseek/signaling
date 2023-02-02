import { randomBetween } from '../utilities'
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
  // voice.output.connect(audioContext.destination)
  const destination = audioContext.createMediaStreamDestination()
  voice.output.connect(destination)

  const input = document.createElement('input')
  input.type = 'range'
  input.min = `-3`
  input.max = `3`
  input.value = String(randomBetween(-3, 3))
  input.oninput = () => {
    voice.setPitchOffset(input.valueAsNumber)
  }

  return { input, destination }
}
