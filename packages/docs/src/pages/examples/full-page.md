---
title: react-sticky-box Full Page Example
layout: ../../layouts/MainLayout.astro
setup: |
  import {Row, Content, Bg} from '../../components/ui.jsx'
  import {StickySidebar, BottomStickySidebar} from '../../components/Sidebar.jsx'
  import CodeSample from '../../components/CodeSample.astro'
---

# Full Page Example

This page mostly serves to verify that it's also working if the window serves as scroll container. (Which probably is the most common case)

<Bg>
  <Row>
    <Content size="xs" />
  </Row>
  <Row>
    <StickySidebar offsetTop={20} offsetBottom={20} elements={20} client:idle />
    <Content size="lg">
      <p>The sidebar to the left stays in a sticky position.</p>
      <p>
        Go ahead and hit the <b>expand</b> button to see how it behaves once the sidebar becomes
        greater than the viewport.
      </p>
    </Content>
  </Row>
  <Row>
    <Content size="md" />
  </Row>
</Bg>
