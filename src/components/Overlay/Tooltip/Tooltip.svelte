<script lang="coffeescript">

  # todo: make the positioning "smart"

  `export let position = undefined`

</script>
<style lang="sass">

  [tooltipcontainer]
    display: inline-block
    position: relative
    width: auto
    border: 1px solid black

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
    display: none
    &[open="true"]
      display: block
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


  .tooltip
    position: relative
    display: inline-block

    .tooltiptext
      font-size: var(--font-xs)
      padding: var(--font-xs)
      visibility: hidden
      width: 120px
      background-color: var(--tooltip-bg)

      color: var(--tooltip-fg)
      border-radius: var(--corner-s)

      position: absolute
      z-index: var(--z-index-tooltip)
      bottom: 125%
      left: 50%
      margin-left: -60px
      opacity: 0
      transition: opacity 0.3s
      &[position="right"]
        top: -5px
        left: 105%
      &[position="left"]
        top: -5px
        right: 105%
      &[position="top"]
        width: 120px
        bottom: 100%
        left: 50%
        margin-left: -60px //* Use half of the width (120/2 = 60), to center the tooltip */
      &[position="bottom"]
        width: 120px
        top: 100%
        left: 50%
        margin-left: -60px //* Use half of the width (120/2 = 60), to center the tooltip */
      &::after
        content: ""
        position: absolute
        top: 100%
        left: 50%
        margin-left: -5px
        border-width: 5px
        border-style: solid
        border-color: var(--tooltip-bg) transparent transparent transparent



    &:hover .tooltiptext
      visibility: visible
      opacity: var(--tooltip-bg-opacity)

</style>

<div class="tooltip">
  <slot/>
  <span class="tooltiptext"><slot name="tip"/></span>
</div>
