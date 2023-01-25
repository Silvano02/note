import { useQuery } from "@tanstack/react-query"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Database } from "../db_types"
import { useAtom } from "jotai"
import { selFolderAtom, selNoteAtom } from "../atoms"

export const useFolders = () => {
  const supabase = useSupabaseClient<Database>()
  const [, setSelFolder] = useAtom(selFolderAtom)
  return useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await supabase.from("folders").select("*, notes(id)")
      return data
    },
    onSuccess: (data) => {
      data &&
        setSelFolder((selFolder) =>
          selFolder !== "" ? selFolder : data[0]?.id
        )
    },
  })
}

export const useNotes = () => {
  const supabase = useSupabaseClient<Database>()
  const [selFolder] = useAtom(selFolderAtom)
  const [, setSelNote] = useAtom(selNoteAtom)
  return useQuery({
    queryKey: [selFolder],
    queryFn: async () => {
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("folder", selFolder)
        .order("updated_at", { ascending: false })
      return data
    },
    onSuccess: (data) => data && setSelNote(data[0]?.id),
  })
}
