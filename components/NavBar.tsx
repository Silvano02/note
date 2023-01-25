import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { PencilSquareIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Database } from "../db_types"
import { useRouter } from "next/router"
import Dropdown from "./Dropdown"
import {
  ArrowLeftOnRectangleIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline"
import { useTranslation } from "react-i18next"
import useDarkMode from "../hooks/useDarkMode"

const NavBar = () => {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const { t } = useTranslation("index")

  const changeTo = router.locale === "en" ? "it" : "en"

  const changeLanguage = () => {
    router.push(router.pathname, router.pathname, { locale: changeTo })
  }

  const logout = () => {
    supabaseClient.auth.signOut()
    router.push("/login")
  }

  const [isDark, setIsDark] = useDarkMode()

  if (user) {
    return (
      <div className="flex h-24 flex-row items-center justify-between border-b border-amber-400 bg-amber-400 px-4 dark:bg-zinc-900">
        <div className="flex text-amber-900 dark:text-amber-400">
          <PencilSquareIcon className="aspect-square h-6 " />
          My Notes
        </div>
        <div className="relative flex h-12 w-12">
          <Dropdown
            items={[
              {
                text: t("logout"),
                onClick: logout,
                icon: <ArrowLeftOnRectangleIcon className="h-5 w-5" />,
              },
              {
                text: t("changeLanguage"),
                onClick: changeLanguage,
                icon: <LanguageIcon className="h-5 w-5" />,
              },
              {
                text: t(isDark ? "setDark" : "setLight"),
                onClick: () => setIsDark((v) => !v),
                icon: isDark ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                ),
              },
            ]}
            className="top-[50px]"
          >
            <Image
              className="rounded-full"
              src={user.user_metadata.avatar_url || "/avatar.svg"}
              alt="Profile image"
              width={60}
              height={60}
            />
          </Dropdown>
        </div>
      </div>
    )
  }
  return null
}

export default NavBar
