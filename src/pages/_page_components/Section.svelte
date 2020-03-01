<script>
  export let title = "";
</script>
<style lang="sass">

  section
    min-width: 700px
    margin-bottom: 36px
    header
      margin-bottom: 24px

    h3
      margin-bottom: 12px

</style>

<section>
  <header>
    <h2>{title}</h2>
  </header>
  <article>
    <slot/>
  </article>
  <footer>
  </footer>
</section>
