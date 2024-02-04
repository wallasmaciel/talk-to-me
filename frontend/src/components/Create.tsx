'use client'
import { FormEvent, useRef } from "react"
import Button from "./Button"
import { Input } from "./Input"
import { useRouter } from "next/navigation"

export default function Create() {
  const name = useRef<HTMLInputElement>(null)
  const router = useRouter()
  function handleCreateRoom(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (name.current != null && name.current.value != '') {
      sessionStorage.setItem('username', name.current.value)
      const roomId = generateRandomString()
      console.log('handleCreateRoom ~ roomId:', roomId)
      window.location.href = `/room/${roomId}`
    }
  }

  function generateRandomString() {
    return Math.random().toString(36).substring(2, 7)
  }

  return (
    <>
      <form onSubmit={ handleCreateRoom }  className="space-y-8">
        <Input type="text" placeholder="Seu nome" ref={name} />
        <Button title="Entrar" type="submit" />
      </form>
    </>
  )
}