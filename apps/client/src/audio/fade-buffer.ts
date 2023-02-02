export function fadeBuffer(
  context: AudioContext,
  activeTime: number,
  fadeTime: number
) {
  const lengthA = activeTime * context.sampleRate
  const lengthB = (activeTime - 2 * fadeTime) * context.sampleRate
  const length = lengthA + lengthB
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const p = buffer.getChannelData(0)

  const fadeLength = fadeTime * context.sampleRate

  const fadeIndexA = fadeLength
  const fadeIndexB = lengthA - fadeLength

  for (let i = 0; i < lengthA; ++i) {
    let value: number

    if (i < fadeIndexA) {
      value = Math.sqrt(i / fadeLength)
    } else if (i >= fadeIndexB) {
      value = Math.sqrt(1 - (i - fadeIndexB) / fadeLength)
    } else {
      value = 1
    }

    p[i] = value
  }

  // 2nd part
  for (let i = lengthA; i < length; ++i) {
    p[i] = 0
  }

  return buffer
}
