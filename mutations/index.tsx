import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { selFolderAtom, selNoteAtom } from "../atoms"
import { Database } from "../db_types"
import { Note } from "../types"

export const useInsertFolder = () => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient<Database>()
  const [, setSelFolder] = useAtom(selFolderAtom)

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await supabase.from("folders").insert({ name }).select()
      return data
    },
    onSuccess: (data) => {
      data && setSelFolder(data[0].id)
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
  })
}

export const useEditFolder = () => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient<Database>()

  return useMutation({
    mutationFn: async ({ name, id }: { name: string; id: string }) => {
      await supabase.from("folders").update({ name }).eq("id", id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
  })
}

export const useDeleteFolder = () => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient<Database>()

  return useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notes").delete().eq("folder", id)
      await supabase.from("folders").delete().eq("id", id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

export const useInsertNote = () => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient<Database>()
  const [selFolder] = useAtom(selFolderAtom)

  return useMutation({
    mutationFn: async () => {
      await supabase.from("notes").insert({ folder: selFolder })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [selFolder] })
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
  })
}

export const useEditNote = () => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient<Database>()
  const [selFolder] = useAtom(selFolderAtom)

  return useMutation({
    mutationFn: async (note: Note) => {
      await supabase.from("notes").update(note).eq("id", note.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [selFolder] })
    },
  })
}

export const useDeleteNote = () => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient<Database>()
  const [selNote] = useAtom(selNoteAtom)
  const [selFolder] = useAtom(selFolderAtom)

  return useMutation({
    mutationFn: async () => {
      await supabase.from("notes").delete().eq("id", selNote)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [selFolder] })
      queryClient.invalidateQueries({ queryKey: ["folders"] })
    },
  })
}
