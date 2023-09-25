export function create<K extends keyof HTMLElementTagNameMap>(
  name: K,
  attrs: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: Element[]
): HTMLElementTagNameMap[K] {
  const el = Object.assign(document.createElement(name), attrs)
  el.append(...children)
  return el
}
