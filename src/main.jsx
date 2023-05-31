/* eslint-disable react/prop-types */

import React, { useCallback, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { AutoplayVideo } from "./lib"

function App() {
  const [videoRef, setVideoRef] = useState()

  return (
    <>
      <AutoplayVideo
        ref={setVideoRef}
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

      <AutoplayVideo
        ref={setVideoRef}
        src="/example-assets/example-video.mp4"
        posterImg="/example-assets/example-fallback.jpg"
        description="This is a description of the video."
        loop={false}
        prefersReducedMotion={false}
        renderReducedMotionFallback={() => (
          <img
            src="/example-assets/example-fallback.jpg"
            alt="Description of the fallback image."
          />
        )}
      />

      <DebugStats videoElement={videoRef} />
    </>
  )
}

/**
 * The purpose of this debug snipe is to provide a tool to ensure that the
 * IntersectionObserver aspect of the video component is working. The video's
 * currentTime property will be displayed, and should only be incrementing
 * when the video is considered to be "in view" (per the ovbserver options).
 */
function DebugStats({ videoElement }) {
  const rafId = useRef()
  const timeRef = useRef()

  const updateStats = useCallback(() => {
    if (!videoElement) return

    timeRef.current.innerHTML = videoElement.currentTime
    requestAnimationFrame(updateStats)
  }, [videoElement])

  useEffect(() => {
    rafId.current = requestAnimationFrame(updateStats)

    return () => cancelAnimationFrame(rafId.current)
  }, [updateStats])

  if (!videoElement) return null

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

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
