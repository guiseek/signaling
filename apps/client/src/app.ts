import { combineLatest, distinctUntilChanged, filter } from 'rxjs'
import { connectionHandler } from './connection-handler'
import { createOffer, createAudio } from './utilities'
import { stateUpdater } from './state-updater'
import { Offer, Candidate } from './core'
import { signaling } from './signaling'
import { state } from './state'
import { dom } from './dom'
import './style.scss'

const peer = new RTCPeerConnection()
// const stream = new MediaStream()
const remote = createAudio()
const local = createAudio()

dom.progress.show()
dom.snackBar.show('Aguardando peer...')

stateUpdater(peer)
connectionHandler(peer)

state.value$.subscribe(console.log)

/**
 * Base of triggers
 */
const stream$ = state.select((state) => state.stream)
const candidate$ = state.select((state) => state.candidate)
const connection$ = state.select((state) => state.connection)
const negotiationAttempts$ = state.select((state) => state.negotiationAttempts)

/**
 * Prepare types of triggers
 */
const connected$ = connection$.pipe(filter((state) => state === 'connected'))
const connecting$ = connection$.pipe(filter((state) => state === 'connecting'))
const disconnected$ = connection$.pipe(
  filter((state) => state === 'disconnected')
)
const retryAfterConnecting$ = connection$.pipe(
  filter((state) => state === 'disconnected'),
  distinctUntilChanged((prev, curr) => {
    return prev !== 'disconnected' && curr === 'connecting'
  })
)
const retryAfterDisconnected$ = connection$.pipe(
  filter((state) => state === 'disconnected'),
  distinctUntilChanged((prev, curr) => {
    return prev !== 'disconnected' && curr === 'disconnected'
  })
)

candidate$.subscribe((candidate) => {
  if (candidate) {
    signaling.emit('candidate', new Candidate(candidate))
    signaling.log('Enviei meus candidatos')
  }
})

negotiationAttempts$.subscribe(async () => {
  signaling.log('Vamos negociar')

  const offer = await createOffer(peer)
  signaling.emit('offer', new Offer(offer))

  signaling.log('Enviei uma oferta')
})

connected$.subscribe(() => {
  document.body.appendChild(remote)
  dom.progress.hidden()
  dom.snackBar.show('Conectado')

  setTimeout(() => {
    dom.snackBar.hidden()
  }, 2000)
})

disconnected$.subscribe(() => {
  dom.snackBar.show('Desconectado')
  remote.remove()
})

connecting$.subscribe(() => {
  dom.snackBar.show('Conectando...')
})

combineLatest([retryAfterDisconnected$, retryAfterConnecting$]).subscribe(
  async () => {
    const offer = await createOffer(peer)
    signaling.emit('offer', new Offer(offer))
    signaling.log('Fomos desconectados, enviei uma nova oferta')
  }
)

stream$.subscribe(stream => {
  remote.srcObject = stream
  remote.autoplay = true
})

navigator.mediaDevices.getUserMedia({ audio: true }).then(async (stream) => {
  const [audioTrack] = stream.getAudioTracks()
  local.srcObject = stream
  local.muted = true
  peer.addTrack(audioTrack)
  document.body.appendChild(local)
})
