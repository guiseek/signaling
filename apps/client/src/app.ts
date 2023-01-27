import { combineLatest, distinctUntilChanged, filter, map } from 'rxjs'
import { Signaling } from './ports/signaling'
import { Offer, Answer, useState, Candidate, useProvider } from './core'
import {
  ofType,
  canAnswer,
  createOffer,
  createAnswer,
  createAudio,
} from './utilities'
import './style.scss'
import { dom } from './dom'

const signaling = useProvider(Signaling)

/**
 * Types of negotiations
 */
signaling.on('offer', Offer)
signaling.on('answer', Answer)
signaling.on('candidate', Candidate)

const peer = new RTCPeerConnection()
const stream = new MediaStream()
const remote = createAudio()
const local = createAudio()

/**
 * Initial state
 */
const state = useState<RTCState>({
  negotiationAttempts: 0,
  signaling: 'closed',
  connection: 'new',
  iceConnection: 'closed',
  iceGathering: 'new',
  candidate: null,
})

dom.progress.show()
dom.snackBar.show('Aguardando peer...')

/**
 * Keeps states up to date
 */
peer.onicecandidate = (ev) => {
  state.update('candidate', ev.candidate)
}
peer.onsignalingstatechange = () => {
  state.update('signaling', peer.signalingState)
}
peer.oniceconnectionstatechange = () => {
  state.update('iceConnection', peer.iceConnectionState)
}
peer.onconnectionstatechange = () => {
  state.update('connection', peer.connectionState)
}
peer.onicegatheringstatechange = () => {
  state.update('iceGathering', peer.iceGatheringState)
}
peer.onnegotiationneeded = async () => {
  const { negotiationAttempts } = state.value()
  const value = negotiationAttempts + 1
  state.update('negotiationAttempts', value)
}

state.value$.subscribe(console.log)

/**
 * Negotiation handlers
 */
signaling.events$
  .pipe(
    ofType(Offer),
    map(async (offer) => {
      signaling.log('Recebi uma oferta')
      await peer.setRemoteDescription(offer)
      signaling.log('Configurei uma descrição remota')
      return offer
    })
  )
  .subscribe(async (offer) => {
    await offer
    if (canAnswer(peer.signalingState)) {
      signaling.log('Aceitei uma oferta')
      const answer = await createAnswer(peer)
      signaling.log('Configurei uma descrição local')
      signaling.emit('answer', new Answer(answer))
      signaling.log('Enviei uma resposta')
    }
  })

signaling.events$.pipe(ofType(Answer)).subscribe(async (response) => {
  signaling.log('Recebi uma resposta')
  peer.setRemoteDescription(response)
  signaling.log('Configurei uma descrição remota')
})

signaling.events$.pipe(ofType(Candidate)).subscribe(async (candidate) => {
  if (peer.remoteDescription) {
    await peer.addIceCandidate(candidate)
  }
})

/**
 * Base of triggers
 */
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

peer.ontrack = ({ track }) => {
  if (track) {
    stream.addTrack(track)
    remote.srcObject = stream
    remote.autoplay = true
  }
}

navigator.mediaDevices.getUserMedia({ audio: true }).then(async (stream) => {
  const [audioTrack] = stream.getAudioTracks()
  local.srcObject = stream
  local.muted = true
  peer.addTrack(audioTrack)
  document.body.appendChild(local)
})
