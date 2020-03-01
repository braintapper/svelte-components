<script lang="coffeescript">

  # todo: inject menu width ul[role=menu] or maybe use a class , narrow, medium, wide


  import { createEventDispatcher, setContext, afterUpdate } from 'svelte'
  import { slide } from 'svelte/transition'
  import { writable } from 'svelte/store'

  `export let direction = 'bottom'`
  `export let flipped = false`
  `export let id = uuid()`
  `export let style = undefined`
  `export let tabindex = '0'`

  dispatch = createEventDispatcher();

  show = false

  triggerRef = undefined
  buttonWidth = undefined
  tooltipRef = undefined

  showTooltip = () ->
    show = true


  hideTooltip = () ->
    show = false


  onKeydown = (event) ->
    if (event.key == 'Escape')
      event.stopPropagation()
      show = false

  afterUpdate () ->

    if show
      width = triggerRef.getBoundingClientRect().width
      height = triggerRef.getBoundingClientRect().height

      buttonWidth = width

      offsetX = 0
      offsetY = 0

      if (flipped)
        tooltipRef.style.left = 'auto'
        tooltipRef.style.right = 0


      if (direction == 'top')
        tooltipRef.style.top = 'auto'
        tooltipRef.style.bottom = height + 'px'


  `$: ariaLabel = $$props['aria-label'] || 'menu'`

</script>
<style lang="sass">

  [tooltipcontainer]
    display: inline-block
    position: relative
    width: auto


  [role=tooltip]
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3)
    //display: none

    flex-direction: column
    align-items: flex-start
    position: absolute
    z-index: 10000
    background-color: #ffffff
    width: 12rem
    list-style: none
    top: 32px
    left: 0
    border-radius: 6px
    margin: 12px
    padding: 12px
    text-align: left
    font-size: 12px
    line-height: 18px

    &::after
      content: ''
      position: absolute
      display: block
      background-color: #f4f4f4


    &[data-floating-menu-direction='bottom']::after
      top: -0.1875rem
      left: 0
      width: 2rem
      height: 0.1875rem

    &[data-floating-menu-direction='top']::after
      bottom: -0.5rem
      left: 0
      width: 2rem
      height: 0.5rem

    &[data-floating-menu-direction='left']::after
      right: -0.375rem
      top: 0
      height: 2rem
      width: 0.375rem

    &[data-floating-menu-direction='right']::after
      top: 0
      left: -0.375rem
      height: 2rem
      width: 0.375rem



</style>


<div tooltipcontainer {style} {id}>
  <div bind:this={triggerRef} on:mouseover={showTooltip} on:mouseout={hideTooltip} on:click={hideTooltip} on:blur={hideTooltip} on:keydown={onKeydown}>
    <slot/>
  </div>
{#if show}
  <div
    bind:this={tooltipRef}
    {id}
    role="tooltip"
    aria-label={ariaLabel}
    data-floating-menu-direction={direction}
    transition:slide="{{duration: 75}}"
    >
    <slot name="tip"/>
  </div>
{/if}
</div>
