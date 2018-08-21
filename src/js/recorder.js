
export default class Recorder {
  constructor (mediaStream) {
    this.mediaStream = mediaStream
    // this.mediaSource = new MediaSource()
    this.mediaRecorder = null
    this.recorderBlobs = null
    this.sourceBuffer = null
  }

  // handleSourceOpen(event) {
  //   console.log('MediaSource opened')
  //   sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  //   console.log('Source buffer: ', sourceBuffer);
  // }

  // handleDataAvailable (event) {
  //   if (event.data && event.data.size > 0) {
  //     this.recordedBlobs.push(event.data)
  //   }
  // }

  handleStop (event) {
    // Display recorder movie into video element
    console.log('Recorder stopped: ', event)
    // const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    // video.src = window.URL.createObjectURL(superBuffer);
  }

  // toggleRecording() {
  //   if (recordButton.textContent === 'Start Recording') {
  //     startRecording();
  //   } else {
  //     stopRecording();
  //     recordButton.textContent = 'Start Recording';
  //     playButton.disabled = false;
  //     downloadButton.disabled = false;
  //   }
  // }

  // The nested try blocks will be simplified when Chrome 47 moves to Stable
  startRecording () {
    let $this = this
    let options = {mimeType: 'video/webm'}
    this.recordedBlobs = []
    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options)
    } catch (e0) {
      console.log('Unable to create MediaRecorder with options Object: ', e0)
      try {
        options = {mimeType: 'video/webm,codecs=vp9'}
        this.mediaRecorder = new MediaRecorder(this.mediaStream, options)
      } catch (e1) {
        console.log('Unable to create MediaRecorder with options Object: ', e1)
        try {
          options = 'video/vp8' // Chrome 47
          this.mediaRecorder = new MediaRecorder(this.mediaStream, options)
        } catch (e2) {
          alert('MediaRecorder is not supported by this browser.\n\n' +
            'Try Firefox 29 or later, or Chrome 47 or later, ' +
            'with Enable experimental Web Platform features ' +
            'enabled from chrome://flags.')
          console.error('Exception while creating MediaRecorder:', e2)
          return
        }
      }
    }
    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options)
    // recordButton.textContent = 'Stop Recording'
    // playButton.disabled = true
    // downloadButton.disabled = true
    this.mediaRecorder.onstop = this.handleStop
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        $this.recordedBlobs.push(event.data)
      }
    }
    this.mediaRecorder.start(100) // collect 100ms of data ????????????????????????
    console.log('MediaRecorder started', this.mediaRecorder)
  }

  stopRecording () {
    this.mediaRecorder.stop()
    console.log('Recorded Blobs: ', this.recordedBlobs)
    // video.controls = true;
  }

  download () {
    console.log('Download requested')
    const blob = new Blob(this.recordedBlobs, {type: 'video/webm'})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = 'test.webm'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  }
}
