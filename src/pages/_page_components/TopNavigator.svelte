<script lang="coffeescript">
  export pages = []
  export style = undefined
  export theme = undefined
  import {location, link} from 'svelte-spa-router'
</script>
<style lang="sass">
  [active="true"]
    background-color: var(--blue)
  div > div > a
    padding: 0px 12px
</style>

<div layout="row" {style}>
  {#each pages as page}
  <div flex="initial" active={page.url == $location}>
    <a href="{page.url}" use:link>{page.text}</a>
  </div>
  {/each}
  <div flex/>
</div>
