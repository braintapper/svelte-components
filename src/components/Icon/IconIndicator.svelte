<script lang="coffeescript">
  import { createEventDispatcher } from 'svelte'

  import Popover from "./Popover.svelte"
  `export let popoverText`



  dispatch = createEventDispatcher()



</script>
<style lang="sass">
  div
    display: inline-block
    position: relative
    top: 1.5px
</style>
<div>
  <Popover arrowColor="#fff" action="hover" placement="bottom-center" overlayColor="transparent" arrow={false}>
    <div slot="target"><slot></slot></div>
    <div slot="content" class="content">{@html popoverText}</div>
  </Popover>
</div>
