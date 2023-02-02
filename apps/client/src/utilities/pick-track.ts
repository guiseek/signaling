export const pickTrack = (kind: 'audio' | 'video') => (stream: MediaStream) => {
  const [track] =
    kind === 'audio' ? stream.getAudioTracks() : stream.getVideoTracks()
  return track
}
