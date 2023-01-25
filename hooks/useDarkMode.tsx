import { SetStateAction } from "jotai"
import { Dispatch, useEffect, useState } from "react"

function useDarkMode(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [isDark, setIsDark] = useState<boolean>(
    typeof window !== "undefined" ? localStorage.theme === "dark" : false
  )

  useEffect(() => {
    const root = window.document.documentElement

    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark ? "dark" : "light")
    }
  }, [isDark])

  return [!isDark, setIsDark]
}

export default useDarkMode
