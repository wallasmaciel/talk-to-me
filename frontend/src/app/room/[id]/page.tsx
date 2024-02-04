import Chat from "@/components/Chat"
import Footer from "@/components/Footer"
import Header from "@/components/Header"

interface IRoom {
  params: {
    id: string
  }
}
export default function Room({ params }: IRoom) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex max-h-96 overflow-auto">
        <div className="md:w-[85%] w-full m-3">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8 overflow-y-auto max-h-full">
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video className="w-full h-full"></video>
              <span className="absolute bottom-3">Alexia Kattah</span>
            </div>
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video className="w-full h-full"></video>
              <span className="absolute bottom-3">Alexia Kattah</span>
            </div>
          </div>
        </div>
        <Chat />
      </div>
      <Footer />
    </div>
  )
}