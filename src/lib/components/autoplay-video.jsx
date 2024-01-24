// packages
import { forwardRef, useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useInView } from "@wethegit/react-hooks"

// utils
import { classnames } from "../utils/classnames"
import { makeHash } from "../utils/make-hash"

// styles
import "./autoplay-video.css"

const AutoplayVideo = forwardRef(
  (
    {
      className,
      description,
      paused,
      posterImg,
      prefersReducedMotion,
      renderReducedMotionFallback,
      src,
      loop = true,
    },
    inputRef
  ) => {
    const [srcAdded, setSrcAdded] = useState(false)
    const [setInViewRef, isInView] = useInView(0)
    // gets us a unique ID for the video description:
    const descriptionID = description
      ? `autoplay-video-desc-${makeHash(description)}`
      : null

    const localRef = useRef()
    const videoRef = inputRef ? inputRef : localRef

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

      /* eslint-disable-next-line */
    }, [isInView, srcAdded, paused, prefersReducedMotion])

    return (
      <div ref={setInViewRef} className={classnames(["autoplay-video", className])}>
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
              loop={loop}
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
)

AutoplayVideo.defaultProps = {
  description: "",
  inViewRootMargin: "0px 0px 400px 0px",
  paused: false,
  prefersReducedMotion: false,
  loop: true,
}

AutoplayVideo.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  paused: PropTypes.bool,
  posterImg: PropTypes.string,
  prefersReducedMotion: PropTypes.bool.isRequired,
  renderReducedMotionFallback: PropTypes.func,
  src: PropTypes.string,
  loop: PropTypes.bool,
}

AutoplayVideo.displayName = "AutoplayVideo"

export default AutoplayVideo
