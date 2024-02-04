'use client'
import { useRef } from "react"
import Button from "./Button"
import { Input } from "./Input"

export default function Join() {
  const name = useRef<HTMLInputElement>(null)
  const id = useRef<HTMLInputElement>(null)
  return (
    <>
      <Input type="text" placeholder="Seu nome" ref={name} />
      <Input type="text" placeholder="Seu Id da reunião" ref={id} />
      <Button title="Entrar" type="button" />
    </>
  )
}