import { create } from './create'

export const addLog = (log: HTMLDListElement) => (message: string) => {
  const time = new Date().toLocaleTimeString()
  log.append(
    create('dt', { innerText: time }),
    create('dd', { innerText: message })
  )
}
