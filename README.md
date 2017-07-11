# React Sticky Box

The code went through a lot of iterations. Now I just need to find some time to document everything. So stay tuned!

This library is heavily used within [Codecks](https://www.codecks.io), so expect it to be fairly stable.

## Idea

We know lots of pages with sticky navigations. But what happens if the navigation takes up more height than the viewport? StickyBox solves this issue by allowing to scroll sticky positioned elements if they are too big.

## Usage

```jsx
<SomeContainer>
  <StickyBox bottom={false|true}>
    <div className="sidebar">...sidebar...</div>
  </StickyBox>
  <div className="main">...lots of content...</div>
</SomeContainer>
```

## Advanced usage

use an almost no-overhead-es2017 version of the library:

`import StickyBox from "react-sticky-box/dist/react-sticky.esnext.js"`

## `position: sticky`

`StickyBox` is based on the fairly new `position: sticky` feature. And it doesn't work in any context (yet!?).
In case it doesn't stick, try and minimize the use of `overflow` and `z-index` within the parents of the container. Also expect inconsistent behaviour if your container is positioned via `translate3D`.


## Changelog

### 0.5 -> 0.6

And another rewrite.

Since `position: sticky` now is [widely supported](https://caniuse.com/#feat=css-sticky), `StickyBox` is based on this property. The main motivation is that all workarounds have been shown to be flawed in performance-heavy applications.

Browsers with no `sticky` support will fallback to a `position: "relative"` behaviour which in my opinion is much preferrable to the half-broken situation before for older browsers. You still might want to check out the 0.5 branch in case you need to support stickyness in IE and Edge <= 15.

Another benefit of the new approach: you don't need to specify the width anymore. Any `StickyBox` will be part of the layout flow like any other `position: "relative"` element would as well.

Performance was another priority. The scroll-handler now contains zero DOM-reads (except for getting the scroll position). Any container or content resize will be detected and handled separately via the [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill).



### 0.4 -> 0.5

completely rewritten the engine - using position fixed and position absolute. This will lead to almost no jank.

This change causes some new limitations:

- you need to explicitely state the width of the StickyBox or use `width="measure"` to measure its child for its dimensions. (e.g. `<StickyBox width={200}><b>content</b></StickyBox>` or `<StickyBox width="measure"><div style={{width: myWidth}}>content</div></StickyBox>`)
- no more support for margins on the `<StickyBox/>`. I.e. `<StickyBox style={{marginTop: 20}}/>` etc. is not supported and will lead to undefined behaviour. Use paddings or margins on the parent and/or child nodes instead. (e.g. `<div style={{padding: 20}}><StickyBox width={100}><b style={{margin: 10}}>content</b></StickyBox></div>`)
- by default the old `stickToTop` behaviour is active, `stickToBottom` is now simply `bottom`

Background: browser started more and more to not reliably fire the `onScroll` and `onMouseWheel` event since their engines started moving scrolling to some async thread for performance reasons. This meant that a lot of scrolling could happen without react-sticky-box getting notified.

By using `position:fixed` and switching to `position:absolute` when certain scroll boundaries are reached, there's no more jank while scrolling. In the worst case a jump will happen when reaching one of these boundaries. But that's much better than jumping almost every frame when scrolling!
