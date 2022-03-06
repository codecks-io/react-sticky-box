---
title: react-sticky-box Complex Example
layout: ../../layouts/MainLayout.astro
setup: |
  import {Body, Row, Content} from '../../components/ui.jsx'
  import {StickySidebar, BottomStickySidebar} from '../../components/Sidebar.jsx'
  import CodeSample from '../../components/CodeSample.astro'
---

# Complex Example

<CodeSample size="lg">
<div slot="result">
  <Row>
		<Content size="xs">Header</Content>
	</Row>
  <Row>
    <StickySidebar elements={20} offsetTop={20} offsetBottom={20} client:idle />
    <Content size="lg">
      <p>Content</p>
    </Content>
    <BottomStickySidebar elements={20} offsetTop={20} offsetBottom={20} style={{alignSelf: "flex-end"}} client:idle/>
  </Row>
  <Row>
		<Content size="xs">Footer</Content>
	</Row>
  <Row>
    <StickySidebar elements={17} offsetTop={20} offsetBottom={20} client:idle />
    <Content size="md">
      <p>Content</p>
    </Content>
  </Row>
</div>

```jsx
<header>Header</header>
<div style={{display: "flex", alignItems: "flex-start"}}>
  <StickyBox offsetTop={10} offsetBottom={10}>
    <Sidebar />
  </StickyBox>
  <div>Content</div>
  <StickyBox offsetTop={10} offsetBottom={10} bottom style={{alignSelf: "flex-end"}}>
    <Sidebar />
  </StickyBox>
</div>
<footer>Footer</footer>
<div style={{display: "flex", alignItems: "flex-start"}}>
  <StickyBox offsetTop={20} offsetBottom={20}>
    <Sidebar />
  </StickyBox>
  <div>Content</div>
</div>
```

</CodeSample>
