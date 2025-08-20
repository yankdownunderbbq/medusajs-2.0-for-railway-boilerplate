import { ulid } from "ulid"

export function generateUniqueId(prefix?: string): string {
  const id = ulid()
  return prefix ? `${prefix}_${id}` : id
}