import { Subject } from 'rxjs'

export abstract class Signaling<E extends WebRTCMap = WebRTCMap> {
  private static _SEQ = 0
  static incSeq() {
    this._SEQ++
  }
  static get SEQ() {
    return this._SEQ
  }

  abstract onOpen(fn: <E>(e: E) => void): void

  abstract provider: Provider

  protected map = new Map()

  protected _events = new Subject<E[keyof E]>()
  readonly events$ = this._events.asObservable()

  name = crypto.randomUUID()

  on<K extends keyof E>(type: K, clazz: Type<E[K]>) {
    this.map.set(type, clazz)
  }

  abstract emit<K extends keyof E>(type: K, value: IEvent<E[K]>): void

  log(...message: string[]) {
    Signaling.incSeq()
    // console.log(`${Signaling.SEQ}.`, ...message)
  }
}
