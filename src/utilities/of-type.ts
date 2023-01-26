import { Observable, filter } from 'rxjs'

export function ofType<TInput extends IEvent<any>, TOutput extends IEvent<any>>(
  ...types: Type<TOutput>[]
) {
  const isInstanceOf = (event: IEvent<TInput>): event is TOutput =>
    !!types.find((classType) => event instanceof classType)
  return (source: Observable<TInput>) =>
    source.pipe(filter<TInput>(isInstanceOf))
}
