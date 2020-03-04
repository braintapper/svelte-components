<script lang="coffeescript">


  import { fade, fly, slide, scale, draw } from "svelte/transition"


  import { createEventDispatcher, onMount } from "svelte"
  import { sineInOut } from "svelte/easing"


  `export let style = undefined`
  `export let checked = false`
  `export let label = ""`

  dispatch = createEventDispatcher()

  duration = 250

  toggle = ()->
    `checked = !checked`

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
  <button icon type="button" on:click={toggle} {checked}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
        {#if checked}
        <path fill="none" d="M0 0h24v24H0V0z" transition:fade="{{duration: duration}}"/><path d="M21 3H3v18h18V3zM10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" transition:fade="{{duration: duration}}"/>
        {:else}
        <path fill="none" d="M0 0h24v24H0V0z" transition:fade="{{duration: duration}}"/><path d="M19 5v14H5V5h14m2-2H3v18h18V3z" transition:fade="{{duration: duration}}"/>
        {/if}
      </svg>
  </button>
  {#if label.length > 0}
  <label on:click={toggle}>{label}</label>
  {/if}
</div>
