<!--
  ag-grid component (https://www.ag-grid.com/)

  Usage:

  <DataGrid items="{items}" resource="{resource}"></DataGrid>

  items = array of data
  resource = object containing gridoptions (see ag-grid doc)

  Prerequisite:

  make sure you have refrences to the ag-grid code:

  ```
  <link rel="stylesheet" href="/stylesheets/ag-grid/ag-grid.css"/>
  <link rel="stylesheet" href="/stylesheets/ag-grid/ag-theme-balham.css"/>
  <script src="/javascripts/ag-grid-community.min.noStyle.js"></script>
  ```
-->
<script>

  import { onMount } from 'svelte';


  export let items;
  export let resource;

  let datagrid;
  let mounted = false;
  let gridOptions;

  //gridOptions = resource.gridOptions;


  onMount(function() {
    mounted = true;
    //let grid = new agGrid.Grid(datagrid, gridOptions);
    // gridOptions.api.setRowData(items);
  });


  //$: { if (mounted) { gridOptions.api.setRowData(items);} };

</script>

<style>

  :global(.ag-theme-balham .ag-root) {
    border-bottom: 1px solid #FFF !important;
  }
  :global(.ag-center-cols-container) {
    min-width: 100% !important;
  }
  :global(.ag-popup-editor .ag-large-text .ag-large-textarea textarea) {
      margin: 0px;
  }

</style>
<div>agGrid goes here</div>
<!--<datagrid class="ag-theme-balham" bind:this="{datagrid}" style="height: 100%; width: 100%"></datagrid>-->
