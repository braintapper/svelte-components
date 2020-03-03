<script lang="coffeescript">
  `export let pages = []`
  `export let style = undefined`
</script>
<style lang="sass">
  div > div > a
    padding: 0px 12px
</style>

<div layout="row" {style}>
  {#each pages as page}
  <div flex="initial" >
    <a href="#{page.url}">{page.text}</a>
  </div>
  {/each}
  <div flex/>
</div>
