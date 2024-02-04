'use client'
import { useState } from "react"
import Join from "./Join"
import Create from "./Create"

type SelectRoom = 'join' | 'create'
export default function FormWrapper() {
  const [selectedRoom, setSelectedRoom] = useState<SelectRoom>('join')
  const handleSelectRoom = (room: SelectRoom) => setSelectedRoom(room)
  return (
    <div className="w-full">
      <div className="flex items-center text-center">
        <span className={ `w-1/2 p-4 cursor-pointer ${selectedRoom == 'join'? 'rounded-t-lg bg-secondary text-primary' : ''}` } onClick={() => handleSelectRoom('join')}>Ingressar</span>
        <span className={ `w-1/2 p-4 cursor-pointer ${selectedRoom == 'create'? 'rounded-t-lg bg-secondary text-primary' : ''}` } onClick={() => handleSelectRoom('create')}>Nova reunião</span>
      </div>
      <div className="bg-secondary py-4 rounded-b-lg space-y-8 p-10">
        <RoomSelector selectedRoom={selectedRoom} />
      </div>
    </div>
  )
}

interface IRoomSelector {
  selectedRoom: SelectRoom
}
const RoomSelector = ({ selectedRoom }: IRoomSelector) => {
  switch (selectedRoom) {
    case 'join':
      return <Join />
    case 'create': 
      return <Create />
    default:
      return <Join />
  }
}