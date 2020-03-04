<script lang="coffeescript">


  import { fade, fly, slide, scale, draw } from "svelte/transition"


  import { createEventDispatcher, onMount } from "svelte"



  `export let style = undefined`
  `export let value = false`
  `export let option = undefined`
  `export let label = ""`

  dispatch = createEventDispatcher()

  duration = 250

  set = ()->
    `value = option`

</script>

<style lang="sass">
  div
    margin-bottom: var(--fine-spacing-xs)
  button, label
    vertical-align: middle


  button[checked=false]
    svg
      fill: var(--light-gray)

  button[checked=true]
    svg
      fill: var(--primary)

  label
    margin-left: var(--fine-spacing-m)
</style>

<div {style}>
  <button icon type="button" on:click={set} checked={value == option}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
        {#if value == option}
        <path fill="none" d="M0 0h24v24H0V0z" transition:fade="{{duration: duration}}"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" transition:fade="{{duration: duration}}"/><circle cx="12" cy="12" r="5" transition:fade="{{duration: duration}}"/>
        {:else}
        <path fill="none" d="M0 0h24v24H0V0z" transition:fade="{{duration: duration}}"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" transition:fade="{{duration: duration}}"/>
        {/if}
      </svg>
  </button>
  {#if label.length > 0}
  <label on:click={set}>{label}</label>
  {/if}
</div>
