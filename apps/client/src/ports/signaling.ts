import { Subject } from 'rxjs'

export abstract class Signaling<E extends WebRTCMap = WebRTCMap> {
  abstract provider: Provider

  protected map = new Map()

  protected _events = new Subject<E[keyof E]>()
  readonly events$ = this._events.asObservable()

  name = crypto.randomUUID()

  on<K extends keyof E>(type: K, clazz: Type<E[K]>) {
    this.map.set(type, clazz)
  }

  abstract emit<K extends keyof E>(type: K, value: IEvent<E[K]>): void
}
