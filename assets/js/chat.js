import ChatSession from './chat_session'

window.onload = () => {
  let callButton = document.getElementById('callButton')
  let localVideo = document.getElementById('localVideo')
  let remoteVideo = document.getElementById('remoteVideo')
  let chatSession = new ChatSession(localVideo, remoteVideo)

  chatSession.connect()
  chatSession.listen()
  callButton.onclick = () => { chatSession.call() }
}
