import { distinctUntilChanged, filter, interval, map } from 'rxjs'
import { Offer, Answer, useState, Candidate, useProvider } from './core'
import { Signaling } from './ports/signaling'
import { states } from './constantes'
import { pitch } from './audio/pitch'
import {
  ofType,
  create,
  addLog,
  select,
  canAnswer,
  takeStream,
  createOffer,
  createAnswer,
  createAnalyser,
} from './utilities'
import './style.css'
import './provider'

export const signaling = useProvider(Signaling)

signaling.on('offer', Offer)
signaling.on('answer', Answer)
signaling.on('candidate', Candidate)

const stream = new MediaStream()
const log = create('dl', { id: 'log' })
const tick = addLog(log)
document.body.append(log)

const peer = new RTCPeerConnection()

const audioProps = { autoplay: true }
const local = create('audio', audioProps)
const remote = create('audio', audioProps)

const output = create('output', {
  innerText: 'guentae, rapidão',
})
document.body.appendChild(output)

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

let lastLog = ''

interval(1000 * 20)
  .pipe(map(() => peer.iceConnectionState))
  .subscribe(async (state) => {
    if (state) {
      const toLog = states.ice[state]

      if (lastLog !== toLog) {
        tick(toLog)
        lastLog = toLog
      }

      select('dd:last-child').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }

    switch (state) {
      case 'new': {
        const offer = await createOffer(peer)
        signaling.emit('offer', new Offer(offer))
        signaling.log('Enviei uma nova oferta')
        break
      }
      case 'failed': {
        const otps = { iceRestart: true }
        const offer = await createOffer(peer, otps)
        signaling.emit('offer', new Offer(offer))
        signaling.log('Enviei uma oferta')
        break
      }
    }
  })

peer.ontrack = ({ track }) => {
  if (track) {
    stream.addTrack(track)
    remote.srcObject = stream
    remote.autoplay = true
    const analyser = createAnalyser(stream)
    document.body.appendChild(analyser.canvas)
    analyser.renderLoop()
  }
}

takeStream().then((stream) => {
  local.srcObject = stream
  local.muted = true
  document.body.appendChild(local)

  const { input, destination } = pitch(stream)
  const [audioTrack] = destination.stream.getAudioTracks()
  peer.addTrack(audioTrack)

  const monster = create('h2', {
    innerText: `🧌`,
    ariaLabel: 'Monstro',
    title: 'Monstro',
  })
  const poodle = create('h2', {
    innerText: `🐩`,
    ariaLabel: 'Poodle',
    title: 'Poodle',
  })

  const section = create('section')
  section.append(monster, input, poodle)

  document.body.appendChild(section)

  const checkbox = create('input', { type: 'checkbox', id: 'pitch' })

  checkbox.onchange = () => {
    if (checkbox.checked) {
      const [audioTrack] = stream.getAudioTracks()
      replaceTrack(audioTrack)
    } else {
      const [audioTrack] = destination.stream.getAudioTracks()
      replaceTrack(audioTrack)
    }
  }

  queueMicrotask(() => checkbox.click())

  const label = create(
    'label',
    { htmlFor: 'pitch', innerText: 'Pitch', title: 'Pitch' },
    checkbox
  )
  document.body.append(label)
})

const replaceTrack = (audioTrack: MediaStreamTrack) => {
  const track = peer
    .getSenders()
    .find(({ track }) => track && track.kind === 'audio')
  track?.replaceTrack(audioTrack)
}

url.innerText = location.href
url.title = 'Clique para copiar'
url.style.cursor = 'pointer'
url.onclick = (e) => {
  e.preventDefault()
  navigator.clipboard.writeText(location.href)
  const copied = create('small', { innerText: 'Copiado...' })
  url.after(copied)
  setTimeout(() => copied.remove(), 1000)
}
