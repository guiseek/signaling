import { combineLatest, distinctUntilChanged, filter, map } from 'rxjs'
import { SocketSignaling } from './adapter'
import { Signaling } from './ports/signaling'
import {
  Offer,
  Answer,
  useState,
  Candidate,
  setProvider,
  useProvider,
} from './core'
import {
  ofType,
  canAnswer,
  createOffer,
  createAnswer,
  createAudio,
} from './utilities'

// setProvider(Signaling<WebRTCMap>, ChannelSignaling<WebRTCMap>)

// Execute "npm run dev:server" antes de usar o SocketSignaling
setProvider(Signaling<WebRTCMap>, SocketSignaling<WebRTCMap>)

const signaling = useProvider(Signaling)
signaling.on('offer', Offer)
signaling.on('answer', Answer)
signaling.on('candidate', Candidate)

const stream = new MediaStream()
const remote = createAudio()
const local = createAudio()

const peer = new RTCPeerConnection()

peer.onicecandidate = (ev) => {
  if (ev.candidate) {
    const candidate = new Candidate(ev.candidate)
    signaling.emit('candidate', candidate)
    signaling.log('Enviei meus candidatos')
  }
}

const state = useState<RTCState>({
  signaling: 'closed',
  connection: 'new',
  iceConnection: 'closed',
  iceGathering: 'new',
})

// state.value$.subscribe(console.log)

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
  .subscribe(async (response) => {
    await response
    if (canAnswer(peer.signalingState)) {
      signaling.log('Aceitei uma oferta')
      const sdp = await createAnswer(peer)
      signaling.log('Configurei uma descrição local')
      signaling.emit('answer', new Answer(sdp))
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

peer.onnegotiationneeded = async () => {
  signaling.log('Vamos negociar')

  const offer = await createOffer(peer)
  signaling.emit('offer', new Offer(offer))

  signaling.log('Enviei uma oferta')
}

const connection$ = state.select((state) => state.connection)

const connected$ = connection$.pipe(filter((state) => state === 'connected'))
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
const disconnected$ = connection$.pipe(
  filter((state) => state === 'disconnected')
)

connected$.subscribe(() => {
  document.body.appendChild(remote)
})

disconnected$.subscribe(() => {
  remote.remove()
})

combineLatest([
  retryAfterDisconnected$,
  retryAfterConnecting$
]).subscribe(async () => {
  const offer = await createOffer(peer)
  signaling.emit('offer', new Offer(offer))
  signaling.log('Fomos desconectados, enviei uma nova oferta')
})

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
