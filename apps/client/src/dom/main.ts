import { select } from '../utilities'

export const main = () => {
  const element = select('main')
  return {
    element,
    append<E extends Element>(element: E) {
      element.appendChild(element)
    },
  }
}
