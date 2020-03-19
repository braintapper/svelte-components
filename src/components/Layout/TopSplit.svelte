<script lang="coffeescript">

  export headerSize = "100px"
  export footerSize = "100px"
  export header = true
  export footer = true

</script>

<style lang="sass">
  main
    width: 100%
    height: 100%
    overflow: hidden

  header, footer
    overflow: visible

  section
    overflow-y: scroll


</style>

<main layout="column">
  {#if header}
  <header style="height: {headerSize}" flex="initial"><slot name="header"/></header>
  {/if}
  <section flex><slot name="content"/></section>
  {#if footer}
  <footer style="height: {footerSize}"flex="initial"><slot name="footer"/></footer>
  {/if}
</main>
