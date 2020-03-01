<script>
  import { createEventDispatcher } from 'svelte';
  let dispatch = createEventDispatcher();
  export let style = undefined;
  let click = function () { dispatch("clicked"); }
</script>
<style>
  button {
    display: inline-block;
    padding: 0px;
    background: none;
    height: 24px;
    min-width: 24px;
    width: 24px;
    border: none;
    margin: 0px;
  }
</style>
<button type="button" on:click={click} {style}><slot></slot></button>
