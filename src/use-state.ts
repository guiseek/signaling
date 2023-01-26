import {BehaviorSubject, distinctUntilChanged, map} from 'rxjs'

export const useState = <T>(initial: T) => {
  const _state = new BehaviorSubject(initial)
  const value = () => _state.getValue()
  const $ = _state.asObservable()

  const select = <K>(mapFn: (state: T) => K) => {
    return _state.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    )
  }

  const setState = (newState: Partial<T>) => {
    _state.next({
      ...value(),
      ...newState,
    })
  }

  return {$, select, value, setState}
}
