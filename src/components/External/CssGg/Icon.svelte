<script lang="coffeescript">
  import {loader} from "../../../helpers/stores.js";


  export  value = "info"
  export  color = "red"
  export  size = 24
  export  animate = true
  `$: iconStyles = "color: var(--" + color +"); transform: scale(" + (size / 24) + ");"`
  `$: animationClass = (animate ? "" : " no-animate")`


  loader.enqueue "cssgg", ["./css/vendor/css.gg.css/css.gg.css"], ()->
    true

</script>

<style lang="sass">
  div
    display: flex
    justify-content: center
    align-items: center

  .no-animate,.no-animate::before,.no-animate::after
    animation-play-state: paused

</style>

<div style="height: {size}px; width: {size}px;">
  <i class="gg-{value}{animationClass}" style={iconStyles}></i>
</div>
