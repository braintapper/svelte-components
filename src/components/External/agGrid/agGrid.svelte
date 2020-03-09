<!--
  ag-grid component (https://www.ag-grid.com/)

  Usage:

  <DataGrid rows="{rows}" resource="{resource}"></DataGrid>

  rows = array of data
  resource = object containing gridoptions (see ag-grid doc)

  Prerequisite:

  make sure you have refrences to the ag-grid code:

  ```
  <link rel="stylesheet" href="/stylesheets/ag-grid/ag-grid.css"/>
  <link rel="stylesheet" href="/stylesheets/ag-grid/ag-theme-balham.css"/>
  <script src="/javascripts/ag-grid-community.min.noStyle.js"></script>
  ```
-->
<script lang="coffeescript">

  import { onMount } from 'svelte'
  import {loader} from "../../../helpers/stores.js"

  `export let rows = []`
  `export let gridOptions = {}`
  `export let style = "height: 600px; width: 100%"`

  datagrid = undefined
  datagridEl = undefined
  mounted = false

  prereqs = [
    "/js/ag-grid/ag-grid-community.min.noStyle.js"
    "/css/vendor/ag-grid/ag-grid.css"
    "/css/vendor/ag-grid/ag-theme-balham.css"
  ]

  # gridOptions = resource.gridOptions;

  queuecb = ()->
    console.log "loaded dependencies"
    grid datagridEl

  onMount () ->
    mounted = true
    loader.enqueue "agGrid",prereqs, queuecb

  # $: { if (mounted) { gridOptions.api.setRowData(rows);} };



  grid = (el)->
    console.log "do it"
    console.log agGrid
    datagrid = new agGrid.Grid(el, gridOptions);
    gridOptions.api.setRowData(rows);

</script>

<style>
</style>

<div bind:this={datagridEl} {style} class="ag-theme-balham"></div>
