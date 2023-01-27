import { select } from "../utilities"

export const snackBar = () => {
  const element = select('dialog#snack-bar')
	const paragraph = element.querySelector('p')
  return {
    element,
    toggle<Attr extends keyof typeof element>(attr: Attr) {
      paragraph.innerText = ''
      element.toggleAttribute(attr)
    },
    show(message: string) {
      paragraph.innerText = message
      element.open = true
    },
    hidden() {
      paragraph.innerText = ''
      element.open = false
    },
  }
}
