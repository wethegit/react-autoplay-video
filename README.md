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

```shell
import "@wethegit/react-autoplay-video/style.css"
```

## Usage

```jsx
import { AutoplayVideo } from "@wethegit/react-autoplay-video"

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
💡 Note that the inline styles in this snippet are just for the sake of brevity. Don't use inline styles if you don't have to.

## Props

| Prop                        | Type                       | Default value | Description |
| --------------------------- | -------------------------- | ------------- | ----------- |
| className                   | String                     |               | Class name applied to the wrapper element. |
| description                 | String                     | `""`          | Video description rendered accessibly and connected to the video with `aria-describedby`. |
| inViewOptions               | `IntersectionObserverInit` | `{ threshold: 0 }` | Options passed to `IntersectionObserver` to define when the wrapper counts as in view. For example, set `rootMargin` to start loading before it enters the viewport. |
| keepLoaded                  | Boolean                    | `false`       | Keep the source attached after the video has entered view once. By default, the source is removed when it leaves view. |
| loading                     | `"lazy" \| "eager"`        | `"lazy"`      | Set to `"eager"` to attach the source immediately. Lazy loading attaches it when the component enters view. |
| loop                        | Boolean                    | `true`        | Whether the video loops. |
| paused                      | Boolean                    | `false`       | Whether playback should be paused. |
| posterImg                   | String                     |               | Value for the video element's `poster` attribute. |
| prefersReducedMotion        | Boolean                    | `false`       | Render `renderReducedMotionFallback` instead of the video when true. |
| ref                         | `React.Ref<HTMLDivElement>` |               | Ref to the wrapper element. |
| renderReducedMotionFallback | Function                   |               | Render prop for alternative content when the user prefers reduced motion. |
| src                         | String                     |               | Video source file. |
| videoProps                  | Video attributes | | Additional video props or attributes for the HTML Video element. Playback, source, loading, and accessibility props are managed by this component, so you can't override those. |
| videoRef                    | `React.Ref<HTMLVideoElement>` |             | Ref to the underlying HTML video element. |


## Styling

This component uses the [BEM methodology](https://getbem.com/) for CSS `classNames` — the block here being `.autoplay-video`. While you aren't likely to need too many style overrides, you will want to import the stylesheet into your app, as it helps with responsiveness and maintaining aspect ratio. The default aspect-ratio is configured to display a 16:9 video. You can overwrite that by setting the `--aspect-ratio` CSS variable on the component.

## Accessibility

This component was built with accessibility at top-of-mind, which allows you customize the experience delivered to your users. It provides you with the ability to render reduced-motion alternatives to auto-playing videos, and to add screen-reader support for announcing descriptions of auto-playing videos.

### Reduced motion

Use the `prefersReducedMotion` and `renderReducedMotionFallback` props to serve up a reduced motion experience for your users who have that option enabled on their systems. The boolean `prefersReducedMotion` prop can be derived via the browser's `matchMedia API`, and the `renderReducedMotionFallback` prop should be passed a function which returns some alternative JSX to an auto-playing video. This workflow is demonstrated in the [Usage](#usage) section above.

### Video description

It's important to provide a description of the video for use with assistive technologies such as screen-readers. Think of this like alt text for a video — it's navigable in the DOM, but it is hidden to users who are not using any assistive technology. Pass your video description to the `description` prop, and a visually-hidden, unique descriptor element will be added to your rendered markup.
