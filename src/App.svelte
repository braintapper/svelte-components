<script lang="coffeescript">

  `export let environment`



  import TopSplit from "./components/Layout/TopSplit.svelte"

  import TopNavigator from "./pages/_page_components/TopNavigator.svelte"



  import Router from 'svelte-spa-router'
  import {push,pop, location, link, replace} from 'svelte-spa-router'


  import Index from './pages/Index.svelte'

  import Styles from './pages/styles/Group.svelte'
  import Form from './pages/form/Group.svelte'
  import Overlay from './pages/overlay/Group.svelte'
  import Icons from './pages/icons/Group.svelte'
  import Css from './pages/css/Group.svelte'

  links = [
    {
      url: "#/"
      text: "Styles"
    }
    {
      url: "#/css"
      text: "CSS"
    }
    {
      url: "#/form"
      text: "Form"
    }
    {
      url: "#/overlay"
      text: "Overlay"
    }
    {
      url: "#/icons"
      text: "Icons"
    }
  ]






  routes =
    '/': Styles
    '/styles': Styles
    '/form': Form
    '/overlay': Overlay
    '/icons': Icons
    '/css': Css


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
    <TopNavigator {links}/>
  </div>
  <div slot="content">
    <Router {routes}/>
  </div>
</TopSplit>
