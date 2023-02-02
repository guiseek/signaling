import { Signaling } from '../ports/signaling'

export class ChannelSignaling<E extends WebRTCMap> extends Signaling<E> {
  provider= new BroadcastChannel('signaling')
  
  onOpen(fn: <E>(e: E) => void): void {
    fn()
  }

  constructor() {
    super()
    this.provider.onmessage = ({ data }: MessageEvent<Payload<E[keyof E]>>) => {
      if (data.name !== this.name) {
        Signaling.incSeq()
        const event = this.map.get(data.type)
        this._events.next(new event(data.payload))
      }
    }
  }

  emit<K extends keyof E>(type: K, value: IEvent<E[K]>) {
    Signaling.incSeq()
    this.provider.postMessage({
      sequence: Signaling.SEQ,
      payload: value.toJSON(),
      name: this.name,
      type,
    })
  }
}
