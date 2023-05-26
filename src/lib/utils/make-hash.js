// Helper function taken from https://stackoverflow.com/a/7616484
// This is used in order to create a unique ID for the video's aria-describedby attribute,
// without the need for the developer to manually pass a unique ID.
export const makeHash = (string) => {
  let hash = 0,
    i,
    chr
  if (string.length === 0) return hash
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
