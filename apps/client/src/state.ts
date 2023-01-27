import { useState } from './core'

/**
 * Initial state
 */
export const state = useState<RTCState>({
	stream: new MediaStream(),
  negotiationAttempts: 0,
  signaling: 'closed',
  connection: 'new',
  iceConnection: 'closed',
  iceGathering: 'new',
  candidate: null,
})
