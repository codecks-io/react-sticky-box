---
title: react-sticky-box Changelog
layout: ../layouts/MainLayout.astro
---

# Changelog

## 0.9.3

- Fix: Stricter behaviour for unsubscribing to event listeners if a node gets removed.

## 0.9.2

- Fix: For decreasing bottom-based stickybox size when it's already stuck at bottom

## 0.9.1

- Fix: Keep affinity towards bottom when decreasing a bottom-based stickybox in "relative" mode

## 0.9.0

- Breaking: The `bottom` prop now expects the same treatment as `position: sticky; bottom :0;` in pure css. This means a StickyBox with `bottom={true}` needs to be forced to sit at the bottom of its container. This can be done with e.g. 'align-items: end' on a `flex: row` container, or `margin-top: auto` on the sticky box container itself. Check the examples for some code.

## 0.8.0

- Removed the deprecated `offset` prop. Use `offsetTop` instead as explained in [0.7.0](#070).
- Added Typescript declarations.
- Fixed calculations for when the StickyBox's height changed.

## 0.7.8

- Fixed calculations for when larger-than-viewport StickyBox reaches the bottom of the viewport when scrolling down.

## 0.7.7

- Recalculate position when parent height decreases and StickyBox is placed at bottom

## 0.7.6

- Fix wrong calculations when body tag had `overflow: auto`

## 0.7.5

- using [@db-scripts/build](https://github.com/danielberndt/db-scripts) for bundling. Output now also includes a umd-build.

## 0.7.4

- updated build tooling
- using babel 7 runtime helpers
- decreased bundle size requirements by using `loose` babel transforms

## 0.7.3

- warn users if the scroll pane height is 0
- fix behaviour for large `scrollTo` jumps

## 0.7.2

- apply [`{passive: true}`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners) to `scroll` and `mousewheel` listeners if it's supported by browsers

## 0.7.1

- Fix sticky behaviour when scroll parent was not offset parent.
- Automatically re-layout content if it's size changes. (e.g. when expanding or collapsing menu items)
- Adding these docs

## 0.7.0

Introducing the `offsetTop` and `offsetBottom` props.

_The `offset` prop is deprecated._ Please use `offsetTop` which has the exact same semantics. `offset` will be removed in v0.8.

## 0.6.0

Another internal rewrite.

Since `position: sticky` now is [widely supported](https://caniuse.com/#feat=css-sticky), React Sticky Box is based on this property. The main motivation is that all workarounds have been shown to be flawed in performance-heavy applications.

Browsers with no `sticky` support will fallback to a `position: "relative"` behaviour which in my opinion is much preferrable to the half-broken situation before for older browsers. You still might want to check out the 0.5 branch in case you need to support stickyness in IE and Edge <= 15.

Another benefit of the new approach: you don't need to specify the width anymore. Any `StickyBox` will be part of the layout flow like any other `position: "relative"` element would as well.

Performance was another priority. The scroll-handler now contains zero DOM-reads (except for getting the scroll position). Any container or content resize will be detected and handled separately via the [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill).

## 0.5.0

completely rewritten the engine - using `position: fixed` and `position: absolute`. This will lead to almost no jank.

This change causes some new limitations:

- you need to explicitely state the width of the StickyBox or use `width="measure"` to measure its child for its dimensions. (e.g. `<StickyBox width={200}><b>content</b></StickyBox>` or `<StickyBox width="measure"><div style={{width: myWidth}}>content</div></StickyBox>`)
- no more support for margins on the `<StickyBox/>`. I.e. `<StickyBox style={{marginTop: 20}}/>` etc. is not supported and will lead to undefined behaviour. Use paddings or margins on the parent and/or child nodes instead. (e.g. `<div style={{padding: 20}}><StickyBox width={100}><b style={{margin: 10}}>content</b></StickyBox></div>`)
- by default the old `stickToTop` behaviour is active, `stickToBottom` is now simply `bottom`

Background: browser started more and more to not reliably fire the `onScroll` and `onMouseWheel` event since their engines started moving scrolling to some async thread for performance reasons. This meant that a lot of scrolling could happen without react-sticky-box getting notified.

By using `position:fixed` and switching to `position:absolute` when certain scroll boundaries are reached, there's no more jank while scrolling. In the worst case a jump will happen when reaching one of these boundaries. But that's much better than jumping almost every frame when scrolling!
