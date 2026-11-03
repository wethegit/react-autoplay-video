# @wethegit/react-autoplay-video

## 3.1.0

### Minor Changes

- 1b2c256: Removes deprecated CSS "clip" declaration in favor of "clip-path". This applies to the visually-hidden CSS helper class.
- d8cc1fd: Improves developer experience by adding the following:
  - Allow for persisting of `src` attribute, even when out of viewport, via the `persistSrcAttribute` prop.
  - Allow for custom IntersectionObserver options, via the `inViewOptions` prop.
  - Allow for passing of props to the video element itself, via the `videoProps` prop.
  - Expose the video element's ref via the `videoRef` prop.
  
  Bug fixes:
  - Fixes an issue where the video would not render _anything_ when mounted, if `paused` was true.

## 3.0.1

### Patch Changes

- 29b9353: Adds loading prop, allowing for lazy and eager loading of the video element.

## 3.0.0

### Major Changes

- 596c4d1: Updates to React version 19.

## 2.0.0

### Major Changes

- 4ae390f: Upgrades to React 19, TypeScript, and CSS modules.

  ### Breaking changes:

  - Class names are now CSS module hashes.
  - Video element no longer exposes a ref.
  - Props are now spread onto the outermost div container.
