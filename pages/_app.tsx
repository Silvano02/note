import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useState } from "react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react"
import { Database } from "../db_types"
import NavBar from "../components/NavBar"
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { appWithTranslation } from "next-i18next"

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
  dehydratedState: any
}>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  )

  const queryClient = new QueryClient()

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <NavBar />
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </Hydrate>
      </QueryClientProvider>
    </SessionContextProvider>
  )
}

export default appWithTranslation(MyApp)
