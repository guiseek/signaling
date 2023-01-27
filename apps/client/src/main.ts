import { distinctUntilChanged, filter, map } from 'rxjs'
import { ChannelSignaling, SocketSignaling } from './adapter'
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

setProvider(Signaling<WebRTCMap>, ChannelSignaling<WebRTCMap>)

// Execute "npm run dev:server" antes de usar o SocketSignaling
// setProvider(Signaling<WebRTCMap>, SocketSignaling<WebRTCMap>)

const signaling = useProvider(Signaling)
signaling.on('offer', Offer)
signaling.on('answer', Answer)
signaling.on('candidate', Candidate)

const remoteStream = new MediaStream()
const remote = createAudio()
const local = createAudio()

const peer = new RTCPeerConnection()

peer.onicecandidate = (ev) => {
  if (ev.candidate) {
    const candidate = new Candidate(ev.candidate)
    signaling.emit('candidate', candidate)
    console.log(signaling.name, 'Enviei meus candidatos')
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
  state.patch({ signaling: peer.signalingState })
}
peer.oniceconnectionstatechange = () => {
  state.patch({ iceConnection: peer.iceConnectionState })
}
peer.onconnectionstatechange = () => {
  state.patch({ connection: peer.connectionState })
}
peer.onicegatheringstatechange = () => {
  state.patch({ iceGathering: peer.iceGatheringState })
}

signaling.events$
  .pipe(
    ofType(Offer),
    map(async (offer) => {
      console.log(signaling.name, 'Recebi uma oferta')
      await peer.setRemoteDescription(offer)
      console.log(signaling.name, 'Configurei uma descrição remota')
      return offer
    })
  )
  .subscribe(async (response) => {
    await response
    if (canAnswer(peer.signalingState)) {
      console.log(signaling.name, 'Aceitei uma oferta')
      const sdp = await createAnswer(peer)
      console.log(signaling.name, 'Configurei uma descrição local')
      signaling.emit('answer', new Answer(sdp))
      console.log(signaling.name, 'Enviei uma resposta')
    }
  })
  
  signaling.events$.pipe(ofType(Answer)).subscribe(async (response) => {
  console.log(signaling.name, 'Recebi uma resposta')
  peer.setRemoteDescription(response)
  console.log(signaling.name, 'Configurei uma descrição remota')
})

signaling.events$.pipe(ofType(Candidate)).subscribe(async (candidate) => {
  if (peer.remoteDescription) {
    await peer.addIceCandidate(candidate)
  }
})

peer.onnegotiationneeded = async () => {
  console.log(signaling.name, 'Vamos negociar')

  const offer = await createOffer(peer)
  signaling.emit('offer', new Offer(offer))

  console.log(signaling.name, 'Enviei uma oferta')
}

const connection$ = state.select((state) => state.connection)

const connected$ = connection$.pipe(filter((state) => state === 'connected'))
const retry$ = connection$.pipe(
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

retry$.subscribe(async () => {
  const offer = await createOffer(peer)
  signaling.emit('offer', new Offer(offer))
  console.log(signaling.name, 'Fomos desconectados, enviei uma nova oferta')
})

peer.ontrack = ({ track }) => {
  if (track) {
    remoteStream.addTrack(track)
    remote.srcObject = remoteStream
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
