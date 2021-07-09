export const stopMediaStream = (mediaStream: MediaStream) => {
  mediaStream.getTracks().forEach((track) => {
    track.stop();
    mediaStream.removeTrack(track);
  });
};