type Tag<Key extends string> = Key extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[Key]
  : HTMLElement
