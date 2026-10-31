"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useInView } from "@wethegit/react-hooks"

import { classnames } from "../utils/classnames"
import { mergeRefs } from "../utils/merge-refs"

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
  persistSrcAttribute?: boolean
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
  persistSrcAttribute = false,
  videoRef,
  videoProps,
  ref: rootRef,
  ...props
}: AutoplayVideoProps) {
  const [setInViewRef, isInView] = useInView<HTMLDivElement>(inViewOptions ?? 0)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const descriptionID = useId()
  const internalVideoRef = useRef<HTMLVideoElement | null>(null)

  if (isInView && !hasBeenInView) setHasBeenInView(true)

  const srcAdded =
    loading === "eager" || isInView || (persistSrcAttribute && hasBeenInView)

  // This just handles all the possible ways developers might pass in a ref.
  const setRootRef = useMemo(
    () => mergeRefs(setInViewRef, rootRef),
    [setInViewRef, rootRef]
  )

  const setVideoRef = useMemo(
    () => mergeRefs<HTMLVideoElement>(internalVideoRef, videoRef),
    [videoRef]
  )

  useEffect(() => {
    const video = internalVideoRef.current
    if (!video) return

    if (!srcAdded) {
      // Now that src attribute is gone, we're resetting the element to save bandwidth.
      video.load()
      return
    }

    if (paused || !isInView) {
      video.pause()
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    video.play().catch(() => {})
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
            aria-describedby={description ? descriptionID : undefined}
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
