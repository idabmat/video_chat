import { Socket } from 'phoenix'
import 'webrtc-adapter'

export default class ChatSession {
  constructor (localVideo, removeVideo) {
    let socket = new Socket('/socket', {})
    socket.connect()

    this.channel = socket.channel('call', {})
    this.localVideo = localVideo
    this.remoteVideo = remoteVideo
    this.servers = {
      iceServers: [{
        urls: 'stun:stun.example.org'
      }]
    }
  }

  joinChannel () {
    this.channel
      .join()
      .receive('ok', res => {
        console.log('Joined successfully: ', res)
      })
      .receive('error', res => {
        console.log('Unable to join', res)
        throw(res)
      })
  }

  connect () {
    this.joinChannel()
    console.log('Requesting local stream')
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(this.setupLocalStream.bind(this))
      .catch((e) => console.log('getUserMedia() error: ' + e))
  }

  setupLocalStream (stream) {
    console.log('Received local stream')
    this.localStream = stream
    this.localVideo.srcObject = stream
    this.setupPeerConnection()
  }

  setupPeerConnection () {
    console.log('Waiting for call')
    this.peerConnection = new RTCPeerConnection(this.servers)
    console.log('Created local peer connection')
    this.peerConnection.onicecandidate = this.gotLocalIceCandidate.bind(this)
    this.peerConnection.onaddstream = this.gotRemoteStream.bind(this)
    this.peerConnection.addStream(this.localStream)
    console.log('Added localStream to localPeerConnection')
  }

  gotLocalIceCandidate (event) {
    if (event.candidate) {
      console.log('Local ICE candidate: \n' + event.candidate.candidate)
      this.channel.push('message', { body: JSON.stringify({
        candidate: event.candidate
      }) })
    }
  }

  gotRemoteStream () {
    this.remoteVideo.srcObject = event.stream
    console.log('Received remote stream')
  }

  listen () {
    this.channel.on('message', payload => {
      console.log('Message received')
      let message = JSON.parse(payload.body)
      if (message.sdp) {
        this.gotRemoteDescription(message)
      } else {
        this.gotRemoteIceCandidate(message)
      }
    })
  }

  call () {
    console.log('Starting call')
    this.peerConnection.createOffer(this.gotLocalDescription.bind(this), this.handleError.bind(this))
  }

  gotLocalDescription (description) {
    this.peerConnection.setLocalDescription(description, () => {
      this.channel.push('message', { body: JSON.stringify({
        sdp: this.peerConnection.localDescription
      }) })
    }, this.handleError)
    console.log('Offer from localPeerConnection: \n' + description.sdp)
  }

  handleError (error) {
    console.log('Error: ' + error)
  }

  gotRemoteDescription (description) {
    console.log('Answer from remotePeerConnection: \n' + description.sdp)
    this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(description.sdp)
    )
    this.peerConnection.createAnswer(this.gotLocalDescription.bind(this), this.handleError.bind(this))
  }

  gotRemoteIceCandidate (event) {
    if (event.candidate) {
      this.peerConnection.addIceCandidate(
        new RTCIceCandidate(event.candidate)
      )
      console.log('Remote ICE candidate: \n' + event.candidate.candidate)
    }
  }
}
