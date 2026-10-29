"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useInView } from "@wethegit/react-hooks"

import { classnames } from "../utils/classnames"

import styles from "./autoplay-video.module.css"

type VideoProps = Omit<
  React.ComponentPropsWithoutRef<"video">,
  | "aria-describedby"
  | "autoPlay"
  | "loading"
  | "loop"
  | "muted"
  | "playsInline"
  | "poster"
  | "ref"
  | "src"
  | "tabIndex"
>

declare module "react" {
  interface VideoHTMLAttributes<T> extends React.HTMLAttributes<T> {
    loading?: "lazy" | "eager"
  }
}

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
  /**
   * Whether to load the video source immediately or when the component enters view.
   */
  loading?: "lazy" | "eager"
  /**
   * IntersectionObserver options used to determine when the component is in view.
   */
  inViewOptions?: IntersectionObserverInit
  /**
   * Keep the video source attached after it enters view, even when it leaves view.
   */
  keepLoaded?: boolean
  /**
   * Ref to the underlying video element.
   */
  videoRef?: React.Ref<HTMLVideoElement>
  /**
   * Additional props to apply to the underlying video element.
   * Playback, source, loading, and accessibility props are managed by this component.
   * A provided className is combined with the component's media class.
   */
  videoProps?: VideoProps
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
  loading,
  inViewOptions,
  keepLoaded = false,
  videoRef,
  videoProps,
  ref: rootRef,
  ...props
}: AutoplayVideoProps) {
  const [srcAdded, setSrcAdded] = useState(loading === "eager")
  const [setInViewRef, isInView] = useInView<HTMLDivElement>(inViewOptions ?? 0)
  const descriptionID = useId()
  const internalVideoRef = useRef<HTMLVideoElement | null>(null)

  // This just handles all the possible ways developers might pass in a ref.
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) setInViewRef(node)

      if (typeof rootRef === "function") {
        // New to R19: Callback-style refs can return a cleanup function. This block catches that in case that's what has been passed in, and returns it as expected.
        const cleanup = rootRef(node)
        if (typeof cleanup === "function") {
          return () => {
            cleanup()
          }
        }
      } else if (rootRef) {
        rootRef.current = node
      }
    },
    [rootRef, setInViewRef]
  )

  // Similar to the above, this just handles all forms an external ref can take.
  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      internalVideoRef.current = node

      if (typeof videoRef === "function") {
        const cleanup = videoRef(node)
        if (typeof cleanup === "function") {
          return () => {
            cleanup()
            internalVideoRef.current = null
          }
        }
      } else if (videoRef) {
        videoRef.current = node
      }
    },
    [videoRef]
  )

  const pauseVideo = () => {
    const video = internalVideoRef.current
    if (!video) return
    video.pause()
  }

  const playVideo = () => {
    const video = internalVideoRef.current
    if (!video || paused) return
    video.play()
  }

  // Set a flag to load the content (video or fallback), based on its visibility.
  useEffect(() => {
    if (loading === "eager") {
      setSrcAdded(true)
      return
    }

    if (isInView) setSrcAdded(true)
    else if (!keepLoaded) setSrcAdded(false)
  }, [isInView, keepLoaded, loading])

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
      ref={setRootRef}
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
            {...videoProps}
            tabIndex={-1}
            aria-describedby={descriptionID}
            autoPlay
            className={classnames([
              styles["autoplay-video__media"],
              videoProps?.className,
            ])}
            loading={loading}
            loop={loop}
            muted
            playsInline
            poster={posterImg}
            ref={setVideoRef}
            src={srcAdded ? src : undefined}
          />
        </>
      )}
    </div>
  )
}
