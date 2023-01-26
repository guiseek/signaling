import { Signaling } from '../ports/signaling'

export class ChannelSignaling<E extends WebRTCMap> extends Signaling<E> {
  provider: BroadcastChannel

  constructor() {
    super()
    this.provider = new BroadcastChannel('signaling')
    this.provider.onmessage = ({ data }: MessageEvent<Payload<E[keyof E]>>) => {
      if (data.name !== this.name) {
        const event = this.map.get(data.type)
        this._events.next(new event(data.payload))
      }
    }
  }

  emit<K extends keyof E>(type: K, value: IEvent<E[K]>) {
    this.provider.postMessage({
      name: this.name,
      type,
      payload: value.toJSON(),
    })
  }
}
