'use client'
import Chat from "@/components/Chat"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { SocketContext } from "@/contexts/SocketContext"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"

interface IRoom {
  params: {
    id: string
  }
}
interface IAnswer {
  sender: string
  description: RTCSessionDescriptionInit
}
interface ICandidates {
  candidate: RTCIceCandidate
  sender: string
}
interface IDataStream {
  id: string
  stream: MediaStream
}
export default function Room({ params }: IRoom) {
  const {socket} = useContext(SocketContext)
  const router = useRouter()
  const localStream = useRef<HTMLVideoElement>(null)
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({})
  const [remoteStreams, setRemoteStreams] = useState<IDataStream[]>([])
  const [videoMediaStream, setVideoMediaStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    socket?.on('connect', async() => {
      console.log('conectado')
      socket.emit('subscribe', {
        roomId: params.id,
        socketId: socket.id,
      })
      await initLocalCamera()
    })

    socket?.on('newUserStart', data => {
      console.log('Usuario conectado na sala', data)
      createPeerConnection(data.sender, true)
    })

    socket?.on('new user', data => {
      console.log('Novo usuário tetando se conectar', data)
      createPeerConnection(data.socketId, false)
      socket.emit('newUserStart', {
        to: data.socketId,
        sender: socket.id,
      })
    })

    socket?.on('ice candidates', data => handleIceCandidates(data))
    socket?.on('sdp', data => handleAnswer(data))
  }, [socket])

  const handleIceCandidates = async(data: ICandidates) => {
    const peerConnection = peerConnections.current[data.sender]
    if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  }

  const handleAnswer = async(data: IAnswer) => {
    const peerConnection = peerConnections.current[data.sender]
    if (data.description.type == 'offer') {
      await peerConnection.setRemoteDescription(data.description)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      console.log('criando uma resposta')

      socket?.emit('sdp', {
        to: data.sender,
        sender: socket.id,
        description: peerConnection.localDescription,
      })
    } else if (data.description.type == 'answer') {
      console.log('respondendo a oferta')
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.description))
    }
  }

  const createPeerConnection = async (socketId: string, createOffer: boolean) => {
    const config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    }
    const peer = new RTCPeerConnection(config)
    peerConnections.current[socketId] = peer
    const peerConnection = peerConnections.current[socketId]

    if (videoMediaStream) {
      videoMediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, videoMediaStream)
      })
    } else {
      const video = await initRemoteCamera()
      video.getTracks().forEach(track => peerConnection.addTrack(track, video))
    }

    if (createOffer) {
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      console.log('criando uma oferta')

      socket?.emit('sdp', {
        to: socketId,
        sender: socket.id,
        description: peerConnection.localDescription,
      })
    }

    peerConnection.ontrack = event => {
      const remoteStream = event.streams[0]
      const dataStream: IDataStream = {
        id: socketId,
        stream: remoteStream,
      }
      setRemoteStreams((oldRemoteStreams: IDataStream[]) => {
        if (!oldRemoteStreams.some(stream => stream.id == socketId)) 
          return [...oldRemoteStreams, dataStream]
        return oldRemoteStreams
      })
    }

    peer.onicecandidate = event => {
      if (event.candidate) {
        socket?.emit('ice candidates', {
          to: socketId,
          sender: socket.id,
          candidate: event.candidate,
        })
      }
    }

    peerConnection.onsignalingstatechange = event => {
      switch (peerConnection.signalingState) {
        case 'closed':
          setRemoteStreams(prev => prev.filter(stream => stream.id != socketId))
          break
      }
    }

    peerConnection.onconnectionstatechange = event => {
      switch (peerConnection.connectionState) {
        case 'disconnected':
        case 'failed':
        case 'closed':
          setRemoteStreams(prev => prev.filter(stream => stream.id != socketId))
          break
      }
    }
  }

  const logout = () => {
    videoMediaStream?.getTracks().forEach(track => {
      track.stop()
    })

    Object.values(peerConnections.current).forEach(peerConnection => {
      peerConnection.close()
    })
    socket?.disconnect()
    router.push('/')
  }

  const initLocalCamera = async() => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      },
    })
    setVideoMediaStream(video)
    if (localStream.current != null) localStream.current.srcObject = video
  }

  const initRemoteCamera = async() => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      },
    })
    return video
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex max-h-96 overflow-auto">
        <div className="md:w-[85%] w-full m-3">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8 overflow-y-auto max-h-full">
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video className="w-full h-full mirror-mode" autoPlay ref={ localStream }/>
              <span className="absolute bottom-3">Alexia Kattah</span>
            </div>
            {remoteStreams.map((stream, index) => (
              <div className="bg-gray-950 w-full rounded-md h-full p-2 relative" key={ index }>
                <video className="w-full h-full" autoPlay ref={(video) => {
                  if (video && video.srcObject != stream.stream) video.srcObject = stream.stream
                }} />
                <span className="absolute bottom-3">Alexia Kattah</span>
              </div>
            ))}
          </div>
        </div>
        <Chat roomId={ params.id } />
      </div>
      <Footer videoMediaStream={ videoMediaStream } peerConnections={ peerConnections.current } localStream={ localStream.current } logout={ logout } />
    </div>
  )
}