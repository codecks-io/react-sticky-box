---
title: react-sticky-box Debug Example
layout: ../../layouts/MainLayout.astro
setup: |
  import {Body, Row, Content} from '../../components/ui.jsx'
  import {StickySidebar, BottomStickySidebar, CollapseContent} from '../../components/Sidebar.jsx'
  import CodeSample from '../../components/CodeSample.astro'
---

# Debug Examples

This sections serves to describe edge cases and making it easier to manually test them.

## Decrease Height of Scroll Container when scrolled down

To reproduce:

- Scroll all the way to the bottom.
- Expand the Sidebar
- Collapse the Content Area

**fixed in v0.7.7**

<Body big>
	<Row>
		<Content size="xs" />
	</Row>
	<Row>
		<StickySidebar offsetTop={20} offsetBottom={20} elements={20} client:idle />
		<CollapseContent size="lg" client:idle/>
	</Row>
</Body>
