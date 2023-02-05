![Version](https://badgen.net/npm/v/react-sticky-box)
![Downloads/Week](https://badgen.net/npm/dw/react-sticky-box)
![Minified Bundlesize](https://badgen.net/bundlephobia/min/react-sticky-box)
![Minified Gzipped Bundlesize](https://badgen.net/bundlephobia/minzip/react-sticky-box)

# React Sticky Box

Sticky Boxes with sensible behaviour if the content is bigger than the viewport.

## Documentation & Demo

**[react-sticky-box.codecks.io](https://react-sticky-box.codecks.io/)**

## Quick Start

### Use as a Component

```jsx
import StickyBox from "react-sticky-box";

const Page = () => (
  <div className="row">
    <StickyBox offsetTop={20} offsetBottom={20}>
      <div>Sidebar</div>
    </StickyBox>
    <div>Content</div>
  </div>
);
```

### Or via the `useStickyBox` hook

```jsx
import {useStickyBox} from "react-sticky-box";

const Page = () => {
  const stickyRef = useStickyBox({offsetTop: 20, offsetBottom: 20})
  <div className="row">
    <aside ref={stickyRef}>
      <div>Sidebar</div>
    </aside>
    <div>Content</div>
  </div>
};
```
---

[Changelog](https://react-sticky-box.codecks.io/changelog)

## Contribute

- checkout the repo
- `cd /path/to/repo/packages/docs`
- `yarn install && yarn start`

this will allow you to modify the react-sticky-box sources in `packages/react-sticky-box/src` and check the effects in the docs.
