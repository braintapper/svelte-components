<script lang="coffeescript">
  `export let open = false`
  `export let position = "left"`
  import { slide } from 'svelte/transition'
  `export let style = undefined`
  `export let panelRef = undefined`

  clickCount = 0

  setState = (state)->
    console.log "Setstate show: #{state}"


  if position == "left"
    shadow = "right"
  else
    shadow = "left"


  overlayClick = ()->
    `open = false`


</script>

<style lang="sass">



[type="sidenav"]
  display: block
  height: 100%
  width: 0px
  position: fixed
  z-index: 1000
  top: 0
  transition: 0.25s
  overflow: hidden
  background: #fff

  &[open="true"]
    width: 250px
    &[position="left"]
      left: 0
    &[position="right"]
      right: 0

  // accommodate borders and sahdows
  &[position="left"]
    left: -10px
    //border-right: 1px solid black
  &[position="right"]
    right: -10px
    //border-left: 1px solid black


</style>

<div type="overlay" open={open} on:click={overlayClick}/>
<nav type="sidenav" {style} open={open} bind:this={panelRef} {position} shadow={shadow}>
  <slot/>
</nav>
