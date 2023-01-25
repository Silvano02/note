import { Database } from "../db_types"
import { useMemo } from "react"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSidePropsContext } from "next/types"
import FoldersBar from "../components/FoldersBar"
import NotesBar from "../components/NotesBar"
import Note from "../components/Note"
import { useFolders, useNotes } from "../queries"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { selNoteAtom } from "../atoms"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const Index = () => {
  const [selNote] = useAtom(selNoteAtom)
  const { data: notes } = useNotes()

  const note = useMemo(
    () => notes?.find((note) => note.id === selNote),
    [notes, selNote]
  )

  return (
    <div className="grid h-full grid-flow-col grid-cols-5 overflow-hidden bg-yellow-50 text-amber-900 dark:text-amber-200">
      <FoldersBar />
      <NotesBar />
      <Note note={note} key={note?.id} />
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data: folders } = await supabase
        .from("folders")
        .select("*, notes(id)")
      return folders
    },
  })

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? "en", ["index"])),
      initialSession: session,
      user: session.user,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Index
