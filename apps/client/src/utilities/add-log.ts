import { create } from './create'

export function addLog(message: string) {
  const time = new Date().toLocaleTimeString()
  log.append(
    create('dt', { innerText: time }),
    create('dd', { innerText: message })
  )
}
