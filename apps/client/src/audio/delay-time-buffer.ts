export function delayTimeBuffer(
  context: AudioContext,
  activeTime: number,
  fadeTime: number,
  shiftUp: boolean
) {
  const lengthA = activeTime * context.sampleRate
  const lengthB = (activeTime - 2 * fadeTime) * context.sampleRate
  const length = lengthA + lengthB
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const p = buffer.getChannelData(0)

  for (let i = 0; i < lengthA; ++i) {
    if (shiftUp) p[i] = (lengthA - i) / length
    else p[i] = i / lengthA
  }

  for (let i = lengthA; i < length; ++i) p[i] = 0

  return buffer
}
