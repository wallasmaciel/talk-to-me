import Image from "next/image"

export default function Chat() {
  return (
    <div className="flex-col h-full bg-gray-900 px-4 pt-4 md:w-[15%] hidden md:flex rounded-md m-3">
      <div className="flex-1 h-full w-full overflow-y-auto pb-2">
        <div className="bg-gray-950 rounded p-2">
          <div className="flex items-center text-pink-400 space-x-2">
            <span>Alexia Kattah</span>
            <span>09:15</span>
          </div>
          <div className="mt-5 text-sm">
            <span>text</span>
          </div>
        </div>
      </div>
      <form action="" className="w-full pb-2">
        <div className="flex relative">
          <input type="text" name="" id="" className="px-3 py-2 bg-gray-950 rounded-md w-full" />
          <Image className="absolute right-2 top-2.5 cursor-pointer" src="/send.png" width={ 20 } height={ 20 } alt="Send" />
        </div>
      </form>
    </div>
  )
}