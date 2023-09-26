import { hexToRgba } from './hex-to-rgba'

interface AnalyserOptions {
  color: string
  opacity?: number
}
export const createAnalyser = (
  stream: MediaStream,
  { color, opacity }: AnalyserOptions = { color: '#ffffff', opacity: 0.16 }
) => {
  const canvas = document.createElement('canvas')
  const audioCtx = new AudioContext()
  const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D
  canvasCtx.fillStyle = hexToRgba(color, opacity)
  const microphoneNode = audioCtx.createMediaStreamSource(stream)
  const analyserNode = audioCtx.createAnalyser()
  microphoneNode.connect(analyserNode)

  const bufferLength = analyserNode.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  let bars: number
  let barX: number
  let barWidth: number
  let barHeight: number
  const { width, height } = canvas

  const render = () => {
    if (canvasCtx && stream) {
      canvasCtx.clearRect(0, 0, width, height)

      bars = width

      for (let i = 0; i < bars; i++) {
        barWidth = width / bars
        barX = i * (barWidth + 2)
        barHeight = -dataArray[i] / 1.6
        canvasCtx.fillRect(barX, height, barWidth, barHeight)
      }
    }
  }

  let animationFrame = -1
  const renderLoop = () => {
    animationFrame = requestAnimationFrame(renderLoop)
    analyserNode.getByteFrequencyData(dataArray)
    render()
  }

  const disable = () => {
    stream.getTracks().forEach((track) => (track.enabled = false))
    cancelAnimationFrame(animationFrame)
    audioCtx.suspend()
  }

  return { canvas, renderLoop, animationFrame, disable }
}
