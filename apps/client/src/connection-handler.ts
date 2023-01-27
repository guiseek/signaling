import { canAnswer, createAnswer, ofType } from './utilities'
import { Answer, Candidate, Offer } from './core'
import { signaling } from './signaling'
import { map } from 'rxjs'

export const connectionHandler = (peer: RTCPeerConnection) => {
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
}
