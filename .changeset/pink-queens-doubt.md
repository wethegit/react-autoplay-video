---
"@wethegit/react-autoplay-video": minor
---

Improves developer experience by adding the following:
- Allow for persisting of `src` attribute, even when out of viewport, via the `persistSrcAttribute` prop.
- Allow for custom IntersectionObserver options, via the `inViewOptions` prop.
- Allow for passing of props to the video element itself, via the `videoProps` prop.
- Expose the video element's ref via the `videoRef` prop.

Bug fixes:
- Fixes an issue where the video would not render _anything_ when mounted, if `paused` was true.
