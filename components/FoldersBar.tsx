import {
  EllipsisHorizontalCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { FolderIcon } from "@heroicons/react/24/solid"
import { useAtom } from "jotai"
import { useState } from "react"
import { useTranslation } from "next-i18next"
import { selFolderAtom } from "../atoms"
import { useDeleteFolder, useEditFolder, useInsertFolder } from "../mutations"
import { useFolders } from "../queries"
import Dropdown from "./Dropdown"

const FoldersBar = () => {
  const [editFolder, setEditFolder] = useState<string | null>(null)
  const [selFolder, setSelFolder] = useAtom(selFolderAtom)
  const [newFolder, setNewFolder] = useState("")
  const [isNew, setIsNew] = useState(false)

  const { t } = useTranslation("index")

  const { data: folders } = useFolders()

  const insertFolderMutation = useInsertFolder()
  const editFolderMutation = useEditFolder()
  const deleteFolderMutation = useDeleteFolder()

  const onBlur = async () => {
    setIsNew(false)
    insertFolderMutation.mutate(newFolder)
    setNewFolder("")
  }

  const handleEditFolder = (
    e: React.FocusEvent<HTMLInputElement, Element>,
    id: string
  ) => {
    editFolderMutation.mutate({ name: e.target.value, id })
    setEditFolder(null)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  return (
    <div className="flex flex-col bg-amber-200 pt-8 pb-4 pl-4 pr-8 dark:bg-neutral-700">
      {isNew && (
        <div className="inline-flex items-center gap-1 py-1 px-2 text-sm">
          <FolderIcon className="h-4 w-4 shrink-0" />
          <input
            className="bg-amber-200 outline-none dark:bg-neutral-700 "
            autoFocus
            onKeyUp={handleKeyUp}
            onBlur={onBlur}
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
          />
        </div>
      )}
      {folders?.length === 0 && !isNew && (
        <div className="text-center">
          {t("noFolders.title")}
          <p className="text-sm">{t("noFolders.subtitle")}</p>
        </div>
      )}

      {folders &&
        folders.map((folder, i) => (
          <div
            className={`${
              selFolder === folder.id
                ? "bg-amber-300 dark:bg-neutral-600"
                : "hover:bg-amber-300/50 dark:hover:bg-neutral-800"
            } group/item flex items-center justify-between rounded-md py-1 px-2`}
            key={folder.id}
          >
            <button
              className="flex w-full items-center gap-1 text-left"
              onClick={(e) => {
                if (e.detail === 2) {
                  setEditFolder(folder.id)
                } else {
                  setSelFolder(folder.id)
                }
              }}
            >
              <FolderIcon className="h-4 w-4 shrink-0" />
              <p className="w-full justify-self-start overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
                {editFolder === folder.id ? (
                  <input
                    autoFocus
                    className="bg-inherit outline-none"
                    defaultValue={folder.name}
                    key={folder.id}
                    onKeyUp={handleKeyUp}
                    onBlur={(e) => handleEditFolder(e, folder.id)}
                  />
                ) : (
                  <>{folder.name}</>
                )}
              </p>
              <p className="w-10 text-center text-xs">
                {Array.isArray(folder.notes) ? folder.notes.length : 0}
              </p>
            </button>
            <Dropdown
              items={[
                {
                  text: t("folderDropdown.rename"),
                  onClick: () => setEditFolder(folder.id),
                  icon: <PencilIcon className="h-4 w-4" />,
                },
                {
                  text: t("folderDropdown.delete"),
                  onClick: () => deleteFolderMutation.mutate(folder.id),
                  icon: <TrashIcon className="h-4 w-4" />,
                },
              ]}
            >
              <EllipsisHorizontalCircleIcon className="invisible h-5 w-5 shrink-0 group-hover/item:visible ui-open:visible" />
            </Dropdown>
          </div>
        ))}
      <div className="mt-auto flex  justify-center">
        <button onClick={() => setIsNew(true)} className="flex gap-1">
          <PlusIcon className="h-6 w-6" />
          {t("newFolder")}
        </button>
      </div>
    </div>
  )
}

export default FoldersBar
