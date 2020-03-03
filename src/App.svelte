<script lang="coffeescript">

  `export let environment`



  import TopSplit from "./components/Layout/TopSplit.svelte"

  import TopNavigator from "./pages/_page_components/TopNavigator.svelte"



  import Router from 'svelte-spa-router'
  import {push,pop, location, link, replace} from 'svelte-spa-router'



  import Styles from './pages/styles/Group.svelte'
  import Form from './pages/form/Group.svelte'
  import Overlay from './pages/overlay/Group.svelte'
  import Icons from './pages/icons/Group.svelte'
  import Css from './pages/css/Group.svelte'
  import Layout from './pages/layout/Group.svelte'

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
    <!--link(rel="stylesheet" href="./css/fullcalendar/core/main.css" lang="css" media=screen)
    //link(rel="stylesheet" href="./css/fullcalendar/daygrid/main.css" lang="css" media=screen)
    //link(rel="stylesheet" href="./css/fullcalendar/timegrid/main.css" lang="css" media=screen)
    //link(rel="stylesheet" href="./css/fullcalendar/list/main.css" lang="css" media=screen)
    -->
</svelte:head>

<TopSplit header={true} headerSize="42px" footer={false}>
  <div slot="header">
    <TopNavigator {pages}/>
  </div>
  <div slot="content">
    <Router {routes}/>
  </div>
</TopSplit>
