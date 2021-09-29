export function filterObject(schema: string[], obj: any, fixedValue: any) {
  const schemaKeys = Object.keys(schema)
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([key]) => schemaKeys.includes(key))
  )
  const assigned = Object.assign(fixedValue ? fixedValue : {}, schema, filtered)
  return assigned
}
