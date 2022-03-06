---
title: react-sticky-box api
layout: ../layouts/MainLayout.astro
---

# Api

## Usage

### Component-based approach

```jsx
import StickyBox from "react-sticky-box";

const MyPage = () => (
  <div className="container">
    <StickyBox
      bottom={false | true}
      offsetTop={number}
      offsetBottom={number}
      style={style}
      className={className}
    >
      <div className="sidebar">Sidebar</div>
    </StickyBox>
    <div className="main">Content</div>
  </div>
);
```

Note that the `StickyBox` Component simply renders a `div` which uses the hook below.

### Hook-based approach

```jsx
import {useStickyBox} from "react-sticky-box";

const MyPage = () => {
  const stickyRef = useStickyBox({
    offsetTop: number,
    offsetBottom: number,
    bottom: false | true
  })

  return (
    <div className="container">
      <div className="sidebar" ref={stickyRef}>
        Sidebar
      </div>
      <div className="main">Content</div>
    </div>;
  )
}

```

## Props / Hook Args

- **`bottom = {boolean | default: false}`**

  If `true`, content will stick to the bottom of viewport, note that you also need to make sure that the css is set up correctly. The container should use e.g `display: flex; align-items: flex-end;`

- **`offsetTop = {number | default: 0}`**

  Defines the offset to the top of the viewport in pixels.

- **`offsetBottom = {number | default: 0}`**

  Defines the offset to the bottom of the viewport in pixels.
