import { ReactNode } from "react"

interface IContainer {
  children: ReactNode
}
export default function Container({ children }: IContainer) {
  return (
    <div className="px-4 max-w-7xl mx-auto">
      { children }
    </div>
  )
}