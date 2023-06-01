# @wethegit/react-autoplay-video

- [Getting set up](#getting-set-up)
- [Usage](#usage)
- [Props](#props)
- [Styling](#styling)
- [Accessibility](#accessibility)

## Getting set up

### Install

```bash
npm install @wethegit/react-autoplay-video
```

### Import the CSS

Import this wherever it makes sense to, based on your project structure:

```bash
import "@wethegit/react-autoplay-video/style.css"
```

## Usage

```jsx
const YourComponent = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  return (
    <AutoplayVideo
      src="your-video.mp4"
      posterImg="your-poster-image.jpg"
      description="This is a description of the video."
      prefersReducedMotion={prefersReducedMotion}
      style={{'--aspect-ratio': 'calc((9 / 16) * 100%)'}}
      renderReducedMotionFallback={() => (
        <img src="your-fallback-image.jpg" alt="Description of the fallback image." />
      )}
    />
  )
}
```

## Props

| Prop                        | Type     | Default value       | Description                                                                                                                                                                                                                                                                                                                                  |
| --------------------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className                   | String   |                     |                                                                                                                                                                                                                                                                                                                                              |
| description                 | String   | ""                  | A unique description of the video. A unique hash based on this text will be generated and used as the `aria-describedby` ID for a visually-hidden description of the video in the DOM.                                                                                                                                                       |
| lazyLoadRootMargin          | String   | "0px 0px 400px 0px" | Optional. The `rootMargin` string, as expected by the browser's [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). By default, the component gets a 400-pixel "look-ahead", which means the detection of whether or not the component is in view checks up to 400px below the viewport. |
| posterImg                   | String   |                     | Optional. The `poster` attribute of the `<video>` element.                                                                                                                                                                                                                                                                                   |
| prefersReducedMotion        | Boolean  | false               | Whether the user prefers reduced motion. If `true`, the component will check for the `renderReducedMotionFallback` render prop, and use that instead of the default auto-playing video.                                                                                                                                                      |
| renderReducedMotionFallback | Function |                     | Render prop to provide fallback content when the user has enabled reduced motion. This is most commonly an image, or a paused video with controls.                                                                                                                                                                                           |
| src                         | String   |                     | The video source file.                                                                                                                                                                                                                                                                                                                       |
| loop                         | Boolean   |                     | Whether to infitely loop the video.                                                                                                                                                                                                                                                                                                                       |


## Styling

This component uses the [BEM methodology](https://getbem.com/) for CSS `classNames` — the block here being `.autoplay-video`. While you aren't likely to need too many style overrides, you will want to import the stylesheet into your app, as it helps with responsiveness and maintaining aspect ratio. The default aspect-ratio is configured to display a 16:9 video. You can overwrite that by setting the `--aspect-ratio` CSS variable on the component.

## Accessibility

This component was built with accessibility at top-of-mind, which allows you customize the experience delivered to your users. It provides you with the ability to render reduced-motion alternatives to auto-playing videos, and to add screen-reader support for announcing descriptions of auto-playing videos.

### Reduced motion

Use the `prefersReducedMotion` and `renderReducedMotionFallback` props to serve up a reduced motion experience for your users who have that option enabled on their systems. The boolean `prefersReducedMotion` prop can be derived via the browser's `matchMedia API`, and the `renderReducedMotionFallback` prop should be passed a function which returns some alternative JSX to an auto-playing video. This workflow is demonstrated in the [Usage](#usage) section above.

### Video description

It's important to provide a description of the video for use with assistive technologies such as screen-readers. Think of this like alt text for a video — it's navigable in the DOM, but it is hidden to users who are not using any assistive technology. Pass your video description to the `description` prop, and a visually-hidden, unique descriptor element will be added to your rendered markup.
