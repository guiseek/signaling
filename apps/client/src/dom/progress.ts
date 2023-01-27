import { select } from '../utilities'

export const progress = () => {
  const element = select('progress')
  return {
    element,
    toggle<Attr extends keyof typeof element>(attr: Attr) {
      element.toggleAttribute(attr)
    },
    show() {
      element.style.visibility = 'visible'
    },
    hidden() {
      element.style.visibility = 'hidden'
    },
  }
}
