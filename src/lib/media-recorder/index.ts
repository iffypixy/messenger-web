const stopAndRemoveTrack = (mediaStream: MediaStream) => (track: MediaStreamTrack) => {
  track.stop();
  mediaStream.removeTrack(track);
};

export const stopMediaStream = (mediaStream: MediaStream) => {
  mediaStream.getTracks().forEach(stopAndRemoveTrack(mediaStream));
};