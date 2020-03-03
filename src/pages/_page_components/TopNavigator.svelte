<script lang="coffeescript">
  `export let links = []`
  `export let style = undefined`
</script>
<style lang="sass">
  div > div > a
    padding: 0px 12px
</style>

<div layout="row" {style}>
  {#each links as link}
  <div flex="initial" >
    <a href="{link.url}">{link.text}</a>
  </div>
  {/each}
  <div flex/>
</div>
