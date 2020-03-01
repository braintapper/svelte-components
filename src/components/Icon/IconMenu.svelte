<script lang="coffeescript">
  import { createEventDispatcher } from 'svelte'

  import Popover from "./Popover.svelte"
  `export let item`
  `export let placement='bottom-start'`


  `let openstate`
  dispatch = createEventDispatcher()

  `$: {console.log(openstate)}`

</script>
<style lang="sass">
  div
    display: inline-block
    position: relative
  .menu
    padding: 0px
</style>
<div>
  <div>{openstate}</div>
  <Popover arrowColor="#fff" action="hover" placement={placement} overlayColor="transparent" arrow={false} let:open={openstate} open={openstate}>
    <div slot="target"><slot></slot></div>
    <div slot="content"><div class="menu" on:click={openstate=false}><slot name="menu"></slot></div></div>
  </Popover>
</div>
