---
title: react-sticky-box api
layout: ../layouts/MainLayout.astro
---

# Api

## Usage

```jsx
import StickyBox from "react-sticky-box";

<div className="container">
  <StickyBox bottom={false | true} offsetTop={number} offsetBottom={number} onChangeMode={callback}>
    <div className="sidebar">Sidebar</div>
  </StickyBox>
  <div className="main">Content</div>
</div>;
```

## Props

- **`bottom={boolean|default: false}`**

  If `true`, content will stick to the bottom of viewport

- **`offsetTop={number|default: 0}`**

  Defines the offset to the top of the viewport.

- **`offsetBottom={number|default: 0}`**

  Defines the offset to the bottom of the viewport.
