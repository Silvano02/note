import { Menu } from "@headlessui/react"
import { ReactNode } from "react"

interface DropDownProps {
  items: {
    onClick: React.MouseEventHandler<HTMLButtonElement>
    icon: ReactNode
    text: string
  }[]
  className?: string
  children: ReactNode
}

const Dropdown = ({ items, className = "top-6", children }: DropDownProps) => {
  return (
    <Menu as="div" className="relative flex">
      <Menu.Button>{children}</Menu.Button>
      <Menu.Items
        className={`absolute right-1 z-50 rounded-lg bg-amber-100 py-2 text-sm text-amber-800 dark:bg-stone-800 dark:text-amber-200 ${className}`}
      >
        {items.map((item, i) => (
          <Menu.Item
            as="button"
            key={i}
            className="inline-flex w-full items-center gap-1.5 whitespace-nowrap p-1 px-3 text-left ui-active:bg-amber-200 dark:ui-active:bg-stone-700"
            onClick={item.onClick}
          >
            <>
              {item.icon}
              {item.text}
            </>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}

export default Dropdown
