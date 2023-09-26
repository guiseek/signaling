import { Signaling } from '../ports/signaling'

export class SocketSignaling<E extends WebRTCMap> extends Signaling<E> {
  // provider = new WebSocket('ws://localhost:3000')
  provider = new WebSocket('wss://gateway.p2p.works')

  onOpen(fn: <E>(e: E) => void): void {
    this.provider.onopen = fn
  }

  constructor() {
    super()
    console.log(this.provider)
    this.provider.onopen = (ev) => console.log(ev)
    this.provider.onmessage = ({ data }: MessageEvent<string>) => {
      if (data) {
        const { type, name, payload } = JSON.parse(data) ?? {}
        if (type && name !== this.name) {
          const event = this.map.get(type)
          if (event) this._events.next(new event(payload))
        }
      }
    }
  }

  emit<K extends keyof E>(type: K, payload: IEvent<E[K]>) {
    const value = { payload, name: this.name, type }
    if (this.provider.readyState === this.provider.OPEN) {
      this.provider.send(JSON.stringify(value))
    }
  }
}
