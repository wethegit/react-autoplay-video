"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useInView } from "@wethegit/react-hooks"

import { classnames } from "../utils/classnames"

import styles from "./autoplay-video.module.css"

export interface AutoplayVideoProps extends React.ComponentPropsWithRef<"div"> {
  /**
   * Visually-hidden description of the video.
   */
  description?: string
  /**
   * Whether the video should loop once playback is finished.
   */
  loop?: boolean
  /**
   * Whether the video should render in a paused state.
   */
  paused?: boolean
  /**
   * Image path to use as the video element's poster attribute.
   */
  posterImg?: string
  /**
   * Whether the user prefers reduced motion. Enables return value of renderReducedMotionFallback() to render.
   */
  prefersReducedMotion?: boolean
  /**
   * Render prop. Renders its return value when prefersReducedMotion is true.
   */
  renderReducedMotionFallback?: () => React.ReactNode
  /**
   * Video path to use as the video element's src attribute.
   */
  src: string
}

/**
 * AutoplayVideo
 * Renders an inline video. Pauses itself when out of view. Includes an optional fallback for when the user prefers redued motion.
 */
export function AutoplayVideo({
  className,
  description = "",
  paused = false,
  posterImg,
  prefersReducedMotion = false,
  renderReducedMotionFallback,
  src,
  loop = true,
  ...props
}: AutoplayVideoProps) {
  const [srcAdded, setSrcAdded] = useState(false)
  const [setInViewRef, isInView] = useInView<HTMLDivElement>(0)
  const descriptionID = useId()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const pauseVideo = () => {
    const video = videoRef?.current
    if (!video) return
    video.pause()
  }

  const playVideo = () => {
    const video = videoRef?.current
    if (!video || paused) return
    video.play()
  }

  // Set a flag to load the content (video or fallback), based on its visibility.
  useEffect(() => {
    if (isInView) setSrcAdded(true)
  }, [isInView])

  // Ensure the video does not continue to play when off-screen.
  // Play/pause the video based on the `paused` override prop.
  useEffect(() => {
    if (!srcAdded) return

    if (paused) pauseVideo()
    else if (isInView && !paused) playVideo()
    else pauseVideo()

    /* eslint-disable-next-line */
  }, [isInView, srcAdded, paused, prefersReducedMotion])

  return (
    <div
      className={classnames([styles["autoplay-video"], className])}
      {...props}
      ref={setInViewRef}
    >
      {prefersReducedMotion && typeof renderReducedMotionFallback === "function" ? (
        <div className={styles["autoplay-video__media"]}>
          {renderReducedMotionFallback()}
        </div>
      ) : (
        <>
          {description && (
            <p id={descriptionID} className={styles["visually-hidden"]}>
              {description}
            </p>
          )}
          <video
            tabIndex={-1}
            aria-describedby={descriptionID}
            autoPlay
            className={styles["autoplay-video__media"]}
            loop={loop}
            muted
            playsInline
            poster={posterImg}
            ref={videoRef}
            src={srcAdded ? src : undefined}
          />
        </>
      )}
    </div>
  )
}
