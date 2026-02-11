import React, { useCallback, useEffect, useRef } from "react"
import ReactDOM from "react-dom/client"
import { AutoplayVideo } from "./lib"

function App() {
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div ref={ref}>
        <AutoplayVideo
          src="/example-assets/example-video.mp4"
          posterImg="/example-assets/example-fallback.jpg"
          description="This is a description of the video."
          prefersReducedMotion={false}
          renderReducedMotionFallback={() => (
            <img
              src="/example-assets/example-fallback.jpg"
              alt="Description of the fallback image."
            />
          )}
        />
      </div>

      <DebugStats elementRef={ref} />
    </>
  )
}

/**
 * The purpose of this debug snipe is to provide a tool to ensure that the
 * IntersectionObserver aspect of the video component is working. The video's
 * currentTime property will be displayed, and should only be incrementing
 * when the video is considered to be "in view" (per the ovbserver options).
 */
function DebugStats({ elementRef }: { elementRef: React.RefObject<HTMLDivElement> }) {
  const rafId = useRef<number>(0)
  const timeRef = useRef<HTMLTableCellElement | null>(null)

  const updateStats = useCallback(() => {
    const element = elementRef?.current
    const timeElement = timeRef?.current
    if (!element || !timeElement) return

    const video = element.querySelector("video")
    if (!video) return
    timeElement.innerHTML = String(video.currentTime)
    requestAnimationFrame(updateStats)
  }, [elementRef])

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateStats)

    return () => cancelAnimationFrame(rafId.current)
  }, [updateStats])

  return (
    <div className="stats">
      <table>
        <tbody>
          <tr>
            <td>currentTime:</td>
            <td ref={timeRef} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
