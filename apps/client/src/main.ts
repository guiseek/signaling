import { Candidate, Answer, Offer, setDependency, useDependency } from './core'
import { map } from 'rxjs'
import {
  log,
  ofType,
  canAnswer,
  createOffer,
  createAnswer,
  createAudio,
} from './utilities'
import { Signaling } from './ports/signaling'
import { ChannelSignaling } from './adapter'

setDependency(Signaling<WebRTCMap>, ChannelSignaling<WebRTCMap>)

const signaling = useDependency(Signaling)
// const signaling = new SocketSignaling<WebRTCMap>(ID)
signaling.on('offer', Offer)
signaling.on('answer', Answer)
signaling.on('candidate', Candidate)

let remoteStream: MediaStream
const remote = createAudio()
const local = createAudio()

const peer = new RTCPeerConnection()

peer.onicecandidate = (ev) => {
  if (ev.candidate) {
    const candidate = new Candidate(ev.candidate)
    signaling.emit('candidate', candidate)
  }
}

signaling.events$
  .pipe(
    ofType(Offer),
    map(async (offer, i) => {
      console.log(offer)

      if (!i) await peer.setRemoteDescription(offer)
      return offer
    })
  )
  .subscribe(async (response) => {
    console.log(await response)
    if (canAnswer(peer.signalingState)) {
      const sdp = await createAnswer(peer, await response)
      signaling.emit('answer', new Answer(sdp))
    }
  })

signaling.events$.pipe(ofType(Answer)).subscribe(async (response) => {
  peer.setRemoteDescription(response)
  console.log(response)
})

signaling.events$.pipe(ofType(Candidate)).subscribe(async (candidate) => {
  console.log(candidate)

  if (peer.remoteDescription) {
    await peer.addIceCandidate(candidate)
  }
})

peer.onnegotiationneeded = async (ev) => {
  console.log(ev)
  console.log(peer.connectionState)
  const sdp = await createOffer(peer)
  signaling.emit('offer', new Offer(sdp))
  if (peer.connectionState !== 'connected') {
  }
}

peer.ondatachannel = ({ channel }) => {
  channel.onopen = console.log
}

peer.onconnectionstatechange = (ev) => {
  console.log(ev)

  log(peer, 'connection')

  if (peer.connectionState === 'connected') {
    const channel = peer.createDataChannel('data')
    channel.onopen = console.log
    document.body.appendChild(remote)
  } else {
    remote.remove()
  }
}

peer.ontrack = ({ track }) => {
  console.log(track)

  if (!remoteStream) {
    remoteStream = new MediaStream()
  }
  if (track) {
    console.log(track)

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

peer.onsignalingstatechange = () => {
  log(peer, 'signaling')
}

peer.oniceconnectionstatechange = () => {
  log(peer, 'iceConnection')
}

peer.onicegatheringstatechange = () => {
  log(peer, 'iceGathering')
}

// createOffer()
