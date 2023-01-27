import { Answer, Candidate, Offer, useProvider } from './core'
import { Signaling } from './ports/signaling'

const signaling = useProvider(Signaling)

/**
 * Types of negotiations
 */
signaling.on('offer', Offer)
signaling.on('answer', Answer)
signaling.on('candidate', Candidate)

export { signaling }
