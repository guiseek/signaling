import { distinctUntilChanged, filter, map } from 'rxjs'
import { Signaling } from './ports/signaling'
import { SocketSignaling } from './adapter'
import { pitch } from './audio/pitch'
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
  takeStream,
  createAnalyser,
} from './utilities'
import './style.scss'

// setProvider(Signaling<WebRTCMap>, ChannelSignaling<WebRTCMap>)

// Execute "npm run dev:server" antes de usar o SocketSignaling
setProvider(Signaling<WebRTCMap>, SocketSignaling<WebRTCMap>)

const signaling = useProvider(Signaling)
signaling.on('offer', Offer)
signaling.on('answer', Answer)
signaling.on('candidate', Candidate)

const d = document
const stream = new MediaStream()
const remote = createAudio()
const local = createAudio()

const output = d.createElement('output')
document.body.appendChild(output)

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
  output.innerText = peer.connectionState
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

  signaling.onOpen(async () => {
    const offer = await createOffer(peer)
    signaling.emit('offer', new Offer(offer))
    signaling.log('Enviei uma oferta')
  })
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
  if (remote.paused) {
    remote.play()
  }
})

disconnected$.subscribe(() => {
  remote.remove()
})

retryAfterConnecting$.subscribe(async () => {
  const offer = await createOffer(peer)
  signaling.emit('offer', new Offer(offer))
  signaling.log('Fomos desconectados, enviei uma nova oferta')
})

retryAfterDisconnected$.subscribe(async () => {
  const offer = await createOffer(peer)
  signaling.emit('offer', new Offer(offer))
  signaling.log('Fomos desconectados, enviei uma nova oferta')
})

peer.ontrack = ({ track }) => {
  if (track) {
    stream.addTrack(track)
    remote.srcObject = stream
    remote.autoplay = true
    const { canvas, renderLoop } = createAnalyser(stream)
    document.body.appendChild(canvas)
    renderLoop()
  }
}

takeStream().then((stream) => {
  local.srcObject = stream
  local.muted = true
  document.body.appendChild(local)

  const { input, destination } = pitch(stream)
  const [audioTrack] = destination.stream.getAudioTracks()
  peer.addTrack(audioTrack)

  const monster = document.createElement('h2')
  monster.innerText = `🧌`
  monster.ariaLabel = 'Monstro'
  monster.title = 'Monstro'

  const poodle = document.createElement('h2')
  poodle.innerText = `🐩`
  poodle.ariaLabel = 'Poodle'
  poodle.title = 'Poodle'

  const section = document.createElement('section')
  section.appendChild(monster)
  section.appendChild(input)
  section.appendChild(poodle)

  document.body.appendChild(section)

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'

  checkbox.onchange = (ev) => {
    console.log(ev)
    if (checkbox.checked) {
      const [audioTrack] = stream.getAudioTracks()
      replaceTrack(audioTrack)
    } else {
      const [audioTrack] = destination.stream.getAudioTracks()
      replaceTrack(audioTrack)
    }
  }

  document.body.appendChild(checkbox)
})

const replaceTrack = (audioTrack: MediaStreamTrack) => {
  const track = peer
    .getSenders()
    .find(({ track }) => track && track.kind === 'audio')
  track?.replaceTrack(audioTrack)
}
