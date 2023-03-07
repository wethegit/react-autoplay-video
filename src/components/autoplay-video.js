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
  lazyLoadRootMargin,
  posterImg,
  prefersReducedMotion,
  renderReducedMotionFallback,
  src,
  width,
}) => {
  // "loaded" is a loose term. This just refers to whether the video's src tag has already been placed in the DOM:
  const [loaded, setLoaded] = useState(false)
  const [setInViewRef, isInView] = useInView(
    { threshold: 0, rootMargin: lazyLoadRootMargin },
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
    if (!videoRef.current) return
    videoRef.current.play()
  }

  // Set a flag to load the content (video or fallback), based on its visibility.
  useEffect(() => {
    if (isInView) setLoaded(true)
  }, [isInView])

  // ensure the video does not continue to play when off-screen
  useEffect(() => {
    if (!loaded) return
    if (isInView) playVideo()
    else pauseVideo()
  }, [isInView, loaded])

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
        renderReducedMotionFallback()
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
            src={loaded ? src : null}
          />
        </>
      )}
    </div>
  )
}

AutoplayVideo.defaultProps = {
  description: "",
  lazyLoadRootMargin: "0px 0px 400px 0px",
}

AutoplayVideo.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  height: PropTypes.number.isRequired,
  lazyLoadRootMargin: PropTypes.string.isRequired,
  posterImg: PropTypes.string,
  prefersReducedMotion: PropTypes.bool.isRequired,
  renderReducedMotionFallback: PropTypes.func,
  src: PropTypes.string,
  width: PropTypes.number.isRequired,
}
