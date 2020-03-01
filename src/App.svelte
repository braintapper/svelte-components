<script lang="coffeescript">

  `export let environment`







  import Router from 'svelte-spa-router'
  import {push,pop, location, link, replace} from 'svelte-spa-router'


  import Index from './pages/Index.svelte'








  routes =
    '/': Index

  appName = "Svelte-Components"





</script>
<style>
</style>

<template lang="pug">
  svelte:head
    title { appName }
    //link(rel="stylesheet" href="./css/fullcalendar/core/main.css" lang="css" media=screen)
    //link(rel="stylesheet" href="./css/fullcalendar/daygrid/main.css" lang="css" media=screen)
    //link(rel="stylesheet" href="./css/fullcalendar/timegrid/main.css" lang="css" media=screen)
    //link(rel="stylesheet" href="./css/fullcalendar/list/main.css" lang="css" media=screen)

  Router('{routes}')

</template>
