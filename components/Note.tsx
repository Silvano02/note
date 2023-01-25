import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { useTranslation } from "next-i18next"
import { useEditNote } from "../mutations"
import { Note as N } from "../types"

type NoteProps = {
  note: N | undefined
}

const Note = ({ note }: NoteProps) => {
  let timer = useRef<NodeJS.Timeout>()

  const { t } = useTranslation("index")

  const editNoteMutation = useEditNote()

  const divide = (text: string) => {
    const index = text.indexOf("\n") === -1 ? text.length : text.indexOf("\n")

    const firstLine = text.slice(0, index)
    const rest = text.slice(index)
    return [firstLine, rest]
  }
  let unitedNote
  if (!note) {
    unitedNote = ""
  } else if (note.title) {
    unitedNote = note.title + note.body
  }

  const [text, setText] = useState<string | undefined>(unitedNote)
  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])

  if (!note)
    return (
      <div className="col-span-4 flex h-full w-full items-center justify-center bg-amber-50 dark:bg-zinc-900">
        <div className="col-span-4 m-auto  text-center ">
          <h1 className="text-4xl">{t("noNotes.title")}</h1>
          <p>{t("noNotes.subtitle")}</p>
        </div>
      </div>
    )

  const onChange = (value: Partial<N>) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      editNoteMutation.mutate({ ...note, ...value })
    }, 250)
  }

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const [title, body] = divide(e.target.value)

    onChange({ title, body })
    setText(e.target.value)
  }

  return (
    <div className="col-span-4">
      <textarea
        autoFocus
        onFocus={(e) =>
          e.target.setSelectionRange(
            e.target.value.length,
            e.target.value.length
          )
        }
        className=" h-full w-full resize-none bg-amber-50
      p-10 text-lg outline-none first-line:text-[2rem] first-line:font-bold first-line:leading-relaxed dark:bg-zinc-900"
        onChange={onTextChange}
        value={text}
      />
    </div>
  )
}

export default Note
