import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import Link from "next/link"
import Image from "next/image"
import { Router, useRouter } from "next/router"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useEffect, useState } from "react"
import { Database } from "../db_types"
import googleIcon from "../public/google.svg"
import { useTranslation } from "next-i18next"

const Login = () => {
  const { t } = useTranslation("login")
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

  const loginEmail = async () => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: user,
      password: password,
    })
  }

  const loginGoogle = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
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
          onClick={loginEmail}
        >
          {t("login")}
        </button>
        <div className="text-sm">
          {t("notRegistred")}
          <Link className="text-amber-600" href={"/signup"}>
            {t("signup")}
          </Link>
        </div>
        <div className="text-center">{t("or")}</div>

        <button
          onClick={loginGoogle}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-600 p-2 text-amber-100 shadow-md"
        >
          <Image src={googleIcon} width={40} height={40} alt="google logo" />
          {t("loginGoogle")}
        </button>
      </div>
    </div>
  )
}

export async function getServerSideProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["login"])),
    },
  }
}

export default Login
