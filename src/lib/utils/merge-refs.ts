/** A React ref that may be omitted. */
type PossibleRef<T> = React.Ref<T> | undefined

/**
 * Combines multiple React refs into one callback ref.
 *
 * Use this when a component needs to assign the same DOM node to more than
 * one ref. The returned callback updates every ref and runs any cleanup
 * functions when the node is detached.
 *
 * @param refs Refs that should receive the node.
 * @returns A callback ref that updates all supplied refs.
 */
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
