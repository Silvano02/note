import { Database } from "./db_types"

export type Note = Database["public"]["Tables"]["notes"]["Row"]
export type Folder = Database["public"]["Tables"]["folders"]["Row"]

export type Test = Folder & { notes: { id: number } | { id: number }[] }
