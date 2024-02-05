'use client'
import { SocketContext } from "@/contexts/SocketContext"
import Image from "next/image"
import { FormEvent, useContext, useEffect, useRef, useState } from "react"

interface IChat {
  roomId: string
}
interface IChatMessage {
  message: string
  username: string
  roomId: string
  time: string
}
export default function Chat({ roomId }: IChat) {
  const currentMsg = useRef<HTMLInputElement>(null)
  const {socket} = useContext(SocketContext)
  const [chat, setChat] = useState<IChatMessage[]>([])

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (currentMsg.current != null && currentMsg.current?.value != '') {
      const sendMsgToServer = {
        message: currentMsg.current?.value,
        username: 'Alexia Kattah',
        roomId,
        time: new Date().toLocaleTimeString(),
      }
      socket?.emit('chat', sendMsgToServer)
      setChat(oldChat => [...oldChat, sendMsgToServer])
      currentMsg.current.value = ''
    }
  }

  useEffect(() => {
    socket?.on('chat', data => {
      setChat(oldChat => [...oldChat, data])
      console.log('message:', data)
    })
  }, [socket])
  return (
    <div className="flex-col h-full bg-gray-900 px-4 pt-4 md:w-[15%] hidden md:flex rounded-md m-3">
      <div className="flex-1 h-full w-full overflow-y-auto pb-2">
        {chat.map((element, index) => (
          <div className="bg-gray-950 rounded p-2 mb-4" key={ index }>
            <div className="flex items-center text-pink-400 space-x-2">
              <span>{ element.username }</span>
              <span>{ element.time }</span>
            </div>
            <div className="mt-5 text-sm">
              <span>{ element.message }</span>
            </div>
          </div>
        ))}
      </div>
      <form action="" className="w-full pb-2" onSubmit={ sendMessage }>
        <div className="flex relative">
          <input type="text" name="" id="" className="px-3 py-2 bg-gray-950 rounded-md w-full" ref={ currentMsg } />
          <button type="submit">
            <Image className="absolute right-2 top-2.5 cursor-pointer" src="/send.png" width={ 20 } height={ 20 } alt="Send" />
          </button>
        </div>
      </form>
    </div>
  )
}
