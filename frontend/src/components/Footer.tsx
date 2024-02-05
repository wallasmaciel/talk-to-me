'use client'
import { Camera, Computer, Mic, NoCamera, NoComputer, NoMic, Phone } from "@/Icons"
import Container from "./Container"
import { useState } from "react"

interface IFooter {
  videoMediaStream: MediaStream | null
  peerConnections: Record<string, RTCPeerConnection>
  localStream: HTMLVideoElement | null
  logout: () => void,
}
export default function Footer({ videoMediaStream, peerConnections, localStream, logout }: IFooter) {
  const [isMuted, setIsMuted] = useState(true)
  const [isCameraOff, setIsCameraOff] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  const toggleMuted =  () => {
    setIsMuted(oldIsMuted => {
      videoMediaStream?.getAudioTracks().forEach(track => track.enabled = !oldIsMuted)
      Object.values(peerConnections).forEach(peerConnection => {
        peerConnection.getSenders().forEach(sender => {
          if (sender.track?.kind == 'audio') {
            if (videoMediaStream && videoMediaStream?.getAudioTracks().length > 0)
              sender.replaceTrack(videoMediaStream.getAudioTracks().find(track => track.kind == 'audio') || null)
          }
        })
      })
      return !oldIsMuted
    })
  }
  const toggleVideo = () => {
    setIsCameraOff(oldIsCameraOff => {
      videoMediaStream?.getVideoTracks().forEach(track => track.enabled = !oldIsCameraOff)
      Object.values(peerConnections).forEach(peerConnection => {
        peerConnection.getSenders().forEach(sender => {
          if (sender.track?.kind == 'video') {
            if (videoMediaStream && videoMediaStream?.getVideoTracks().length > 0)
              sender.replaceTrack(videoMediaStream.getVideoTracks().find(track => track.kind == 'video') || null)
          }
        })
      })
      return !oldIsCameraOff
    })
  }

  const toggleScreenSharing = async() => {
    if (!isScreenSharing) {
      const videoShareScreen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      })
      if (localStream) localStream.srcObject = videoShareScreen

      Object.values(peerConnections).forEach(peerConnection => {
        peerConnection.getSenders().forEach(sender => {
          if (sender.track?.kind == 'video') {
            sender.replaceTrack(videoShareScreen.getVideoTracks()[0])
          }
        })
      })

      setIsScreenSharing(!isScreenSharing)
      return;
    }

    if (localStream) localStream.srcObject = videoMediaStream
    Object.values(peerConnections).forEach(peerConnection => {
      peerConnection.getSenders().forEach(sender => {
        if (sender.track?.kind == 'video') {
          if (videoMediaStream) sender.replaceTrack(videoMediaStream.getVideoTracks()[0])
        }
      })
    })
    setIsScreenSharing(!isScreenSharing)
  }
  return (
    <div className="fixed bottom-0 bg-black py-6 w-full">
      <Container>
        <div className="grid grid-cols-3">
          <div className="flex items-center">
            <span className="text-xl">{ `${hours}:${minutes}` }</span>
          </div>
          <div className="flex space-x-6 justify-center">
            { isMuted? 
              (<NoMic className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md" onClick={ toggleMuted }/>) :
              (<Mic className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md" onClick={ toggleMuted }/>)}
            { isCameraOff?
              (<NoCamera className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md" onClick={ toggleVideo }/>) :
              (<Camera className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md" onClick={ toggleVideo }/>)}
            { isScreenSharing? 
              (<NoComputer className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md" onClick={ toggleScreenSharing }/>) :
              (<Computer className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md" onClick={ toggleScreenSharing }/>)}
            <Phone onClick={ logout } className="h-12 w-16 text-white hover:bg-red-500 p-2 cursor-pointer bg-primary rounded-md"/>
          </div>
        </div>
      </Container>
    </div>
  )
}