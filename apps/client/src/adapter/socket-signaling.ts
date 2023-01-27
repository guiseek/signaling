import { Signaling } from '../ports/signaling'

export class SocketSignaling<E extends WebRTCMap> extends Signaling<E> {
  provider = new WebSocket('ws://localhost:3000')

  constructor() {
    super()
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
    this.provider.send(JSON.stringify(value))
  }
}
