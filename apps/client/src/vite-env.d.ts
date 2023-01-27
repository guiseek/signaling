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
  stream: MediaStream
  negotiationAttempts: number
  signaling: RTCSignalingState
  connection: RTCPeerConnectionState
  iceConnection: RTCIceConnectionState
  iceGathering: RTCIceGatheringState
  candidate: RTCIceCandidate | null
}

interface Provider {
  onmessage: ((ev: MessageEvent<any>) => any) | null
}

interface State<T> {
  value$: Observable<T>
  select: <K>(mapFn: (state: T) => K) => Observable<K>
  value: () => T
  patch: (newState: Partial<T>) => void
  update: <K extends keyof T>(key: K, val: T[K]) => void
  set: (newState: T) => void
}
