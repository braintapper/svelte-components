<script lang="coffeescript">

  `export let environment`



  import TopSplit from "./components/Layout/TopSplit.svelte"

  import TopNavigator from "./pages/_page_components/TopNavigator.svelte"



  import Router from 'svelte-spa-router'
  import {push,pop, location, link, replace} from 'svelte-spa-router'



  import Styles from './pages/Styles/Group.svelte'
  import Form from './pages/Form/Group.svelte'
  import Overlay from './pages/Overlay/Group.svelte'
  import Icons from './pages/Icons/Group.svelte'
  import Css from './pages/Css/Group.svelte'
  import Layout from './pages/Layout/Group.svelte'
  import Navigation from './pages/Navigation/Group.svelte'
  import External from './pages/External/Group.svelte'
  import Controls from './pages/Controls/Group.svelte'



  pages = [
    {
      ordinal: 0
      url: "/"
      text: "Styles"
      context: "styles"
      component: Styles
    }
    {
      ordinal: 1
      url: "/css"
      text: "CSS"
      context: "css"
      component: Css
    }
    {
      ordinal: 2
      url: "/form"
      text: "Form"
      context: "form"
      component: Form
    }
    {
      ordinal: 3
      url: "/overlay"
      text: "Overlay"
      context: "overlay"
      component: Overlay
    }
    {
      ordinal: 4
      url: "/icons"
      text: "Icons"
      context: "icons"
      component: Icons
    }
    {
      ordinal: 5
      url: "/layout"
      text: "Layout"
      context: "layout"
      component: Layout
    }
    {
      ordinal: 6
      url: "/navigation"
      text: "Navigation"
      context: "navigation"
      component: Navigation
    }
    {
      ordinal: 6
      url: "/controls"
      text: "Controls"
      context: "controls"
      component: Controls
    }
    {
      ordinal: 7
      url: "/external"
      text: "External"
      context: "external"
      component: External
    }
  ]


  routes = {}

  pages.sortBy('ordinal').forEach (page)->
    routes[page.url] = page.component




  appName = "Svelte-Components"





</script>
<style lang="sass">
  div[slot="content"]
    padding: var(--spacing-xxl)
</style>


<svelte:head>
    <title>{ appName }</title>

</svelte:head>

<TopSplit header={true} headerSize="42px" footer={false}>
  <div slot="header">
    <TopNavigator {pages}/>
  </div>
  <div slot="content">
    <Router {routes}/>
  </div>
</TopSplit>
