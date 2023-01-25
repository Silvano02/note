import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Database } from "../db_types"

const Signup = () => {
  const supabaseClient = useSupabaseClient<Database>()
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          router.push("/")
        }
      }
    )
    return () => authListener.subscription?.unsubscribe()
  }, [supabaseClient, router])

  const singUp = async () => {
    const { data, error } = await supabaseClient.auth.signUp({
      email: user,
      password: password,
    })
  }

  return (
    <div className="flex h-full items-center justify-center bg-amber-200 text-amber-800">
      <div className="flex flex-col gap-6">
        <input
          className=" w-96 rounded-md bg-amber-100 p-2 shadow-md"
          type="text"
          placeholder="email"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="w-96 rounded-md bg-amber-100 p-2 shadow-md"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="rounded-md bg-amber-300 p-2 shadow-md"
          onClick={singUp}
        >
          Sign up
        </button>
      </div>
    </div>
  )
}

export default Signup
