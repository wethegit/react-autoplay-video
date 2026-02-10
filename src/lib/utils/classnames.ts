type ClassValue = string | undefined | boolean | ClassValue[]

export function classnames(classes: ClassValue[] = []): string | undefined {
  if (!classes || !Array.isArray(classes) || !classes.length) return undefined

  const output: string[] = []

  classes.forEach((arg) => {
    if (typeof arg === "string") output.push(arg)
  })

  return output.flat().join(" ")
}
