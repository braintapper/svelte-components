<script lang="coffeescript">
  `export let pages = []`
  `export let style = undefined`
  `export let theme = undefined`
  import {location} from 'svelte-spa-router'
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
    <a href="#{page.url}">{page.text}</a>
  </div>
  {/each}
  <div flex/>
</div>
