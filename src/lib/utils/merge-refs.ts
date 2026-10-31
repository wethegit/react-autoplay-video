type PossibleRef<T> = React.Ref<T> | undefined

export function mergeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    const cleanups: Array<() => void> = []

    for (const ref of refs) {
      if (typeof ref === "function") {
        const cleanup = ref(node)
        cleanups.push(typeof cleanup === "function" ? cleanup : () => ref(null))
      } else if (ref) {
        ref.current = node
        cleanups.push(() => {
          ref.current = null
        })
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }
}
