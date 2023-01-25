import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useAtom } from "jotai"
import { useTranslation } from "next-i18next"
import { selNoteAtom } from "../atoms"
import { useDeleteNote, useInsertNote } from "../mutations"
import { useNotes } from "../queries"

const NotesBar = () => {
  const [selNote, setSelNote] = useAtom(selNoteAtom)

  const { data: notes, isLoading } = useNotes()

  const insertNoteMutation = useInsertNote()
  const deleteNoteMutation = useDeleteNote()

  if (isLoading || !notes) return <Loading />

  return (
    <div className="overflow-hidden bg-amber-100 dark:bg-zinc-800">
      <div className=" flex justify-end px-4 pt-4">
        <div className="flex">
          <button
            onClick={() => insertNoteMutation.mutate()}
            className="rounded-md p-2 hover:bg-amber-200/50 dark:hover:bg-stone-500"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => deleteNoteMutation.mutate()}
            className="rounded-md p-2 hover:bg-amber-200/50 dark:hover:bg-stone-500"
          >
            <TrashIcon className="h-5 w-6" />
          </button>
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-2 overflow-auto p-4">
        {notes.map((note, i: number) => (
          <div
            className={`${
              selNote === note.id ? "bg-amber-300 dark:bg-stone-900" : ""
            } rounded-md p-2 `}
            key={note.id}
            onClick={() => {
              setSelNote(note.id)
            }}
          >
            <p className=" overflow-hidden  overflow-ellipsis">
              {note.title || "‎"}
            </p>
            <p className="overflow-hidden overflow-ellipsis text-xs">
              {note?.body?.split("\n")[1] || "‎"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Loading() {
  const { t } = useTranslation("index")
  return (
    <div className="bg-amber-100 dark:bg-zinc-800">
      <div className=" flex justify-end px-4 pt-4">
        <div className="flex">
          <button className="rounded-md p-2 hover:bg-amber-200/50">
            <PlusIcon className="h-6 w-6" />
          </button>
          <button className="rounded-md p-2 hover:bg-amber-200/50">
            <TrashIcon className="h-5 w-6" />
          </button>
        </div>
      </div>
      <div className="pt-4 text-center">
        <h1>{t("noNotes.title")}</h1>
        <p className="text-sm">{t("noNotes.subtitle")}</p>
      </div>
    </div>
  )
}

export default NotesBar
