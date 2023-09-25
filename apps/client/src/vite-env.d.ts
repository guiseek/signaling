/// <reference types="vite/client" />

type Callback<T> = (value: T) => void

interface Message {
  type: 'hello' | 'offer' | 'answer' | 'candidate' | 'ready'
  message?: any
}

interface Payload<T, K = string> {
  name: string
  type: K
  sequence: number
  payload: T
}
interface Window {
  peer: RTCPeerConnection
}

interface Type<T = any> extends Function {
  new (...args: any[]): T
}

interface IEvent<R> {
  toJSON(): R
}

type EventMap<T = object> = {
  [K in keyof T]: Type<T[K]>
}

interface WebRTCMap {
  offer: Offer
  answer: Answer
  candidate: RTCIceCandidateInit
}

interface RTCState {
  signaling: RTCSignalingState
  connection: RTCPeerConnectionState
  iceConnection: RTCIceConnectionState
  iceGathering: RTCIceGatheringState
}

interface Provider {
  onmessage: ((ev: MessageEvent<any>) => any) | null
}

declare const url: HTMLAnchorElement
