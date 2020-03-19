<script lang="coffeescript">
  export open = true
  export allowClick = true
  export style = undefined
  handleClick = (e)->
    console.log "handleclick"
    if allowClick
      open = !open
</script>
<style lang="sass">

</style>

<details bind:open={open} {style}>
  <summary on:click|preventDefault={handleClick}><slot name="summary"/></summary>
  <slot/>
</details>
