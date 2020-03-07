<script lang="coffeescript">
  `export let open = true`
  `export let allowClick = true`
  `export let style = undefined`
  handleClick = (e)->
    console.log "handleclick"
    if allowClick
      `open = !open`
</script>
<style lang="sass">

</style>

<details bind:open={open} {style}>
  <summary on:click|preventDefault={handleClick}><slot name="summary"/></summary>
  <slot/>
</details>
