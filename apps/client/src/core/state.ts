import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs'

export const useState = <T>(initial: T) => {
  const _state = new BehaviorSubject(initial)
  const value = () => _state.getValue()
  const value$ = _state.asObservable()

  const select = <K>(mapFn: (state: T) => K) => {
    return _state.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    )
  }

  const patch = (newState: Partial<T>) => {
    _state.next({ ...value(), ...newState })
  }

  const update = <K extends keyof T>(key: K, val: T[K]) => {
    _state.next({ ...value(), ...{ [key]: val } })
  }

  const set = (newState: T) => _state.next(newState)

  return { value$, select, value, patch, update, set }
}
