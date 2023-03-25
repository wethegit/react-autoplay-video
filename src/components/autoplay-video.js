// packages
import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useInView } from "@wethegit/react-hooks"

// utils
import { classnames } from "../lib/classnames"
import { makeHash } from "../lib/make-hash"

// styles
import "./autoplay-video.scss"

export const AutoplayVideo = ({
  className,
  description,
  height,
  inViewRootMargin,
  paused,
  posterImg,
  prefersReducedMotion,
  renderReducedMotionFallback,
  src,
  width,
}) => {
  const [srcAdded, setSrcAdded] = useState(false)
  const [setInViewRef, isInView] = useInView(
    { threshold: 0, rootMargin: inViewRootMargin },
    false
  )
  // gets us a unique ID for the video description:
  const descriptionID = description
    ? `autoplay-video-desc-${makeHash(description)}`
    : null
  const videoRef = useRef()

  const pauseVideo = () => {
    if (!videoRef.current) return
    videoRef.current.pause()
  }

  const playVideo = () => {
    if (!videoRef.current || paused) return
    videoRef.current.play()
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
  }, [isInView, srcAdded, paused, prefersReducedMotion])

  return (
    <div
      ref={setInViewRef}
      className={classnames(["autoplay-video", className])}
      {...(width &&
        height && {
          style: {
            "--aspect-ratio": `${parseFloat((height / width).toFixed(4)) * 100}%`,
          },
        })}
    >
      {prefersReducedMotion && renderReducedMotionFallback ? (
        <div className="autoplay-video__media">{renderReducedMotionFallback()}</div>
      ) : (
        <>
          {descriptionID && (
            <p id={descriptionID} className="autoplay-video-util-visually-hidden">
              {description}
            </p>
          )}
          <video
            aria-describedby={descriptionID}
            autoPlay
            className="autoplay-video__media"
            loop
            muted
            playsInline
            poster={posterImg}
            ref={videoRef}
            src={srcAdded ? src : null}
          />
        </>
      )}
    </div>
  )
}

AutoplayVideo.defaultProps = {
  description: "",
  inViewRootMargin: "0px 0px 400px 0px",
  paused: false,
  prefersReducedMotion: false,
}

AutoplayVideo.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  height: PropTypes.number.isRequired,
  inViewRootMargin: PropTypes.string.isRequired,
  paused: PropTypes.bool,
  posterImg: PropTypes.string,
  prefersReducedMotion: PropTypes.bool.isRequired,
  renderReducedMotionFallback: PropTypes.func,
  src: PropTypes.string,
  width: PropTypes.number.isRequired,
}
