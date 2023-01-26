import { Subject } from 'rxjs'

export class Signaling<T extends EventMap> {
  private channel: BroadcastChannel

  private map = new Map()

  private _events = new Subject<T[keyof T]>()
  readonly events$ = this._events.asObservable()

  protected name = crypto.randomUUID()

  constructor() {
    this.channel = new BroadcastChannel('signaling')
    this.channel.onmessage = ({ data }: MessageEvent<Payload<T[keyof T]>>) => {
      if (data.name !== this.name) {
        const event = this.map.get(data.type)
        this._events.next(new event(data.payload))
      }
    }
  }

  on<K extends keyof T>(type: K, clazz: Type<T[K]>) {
    this.map.set(type, clazz)
  }

  emit<K extends keyof T>(type: K, value: IEvent<T[K]>) {
    this.channel.postMessage({
      name: this.name,
      type,
      payload: value.toJSON(),
    })
  }
}
