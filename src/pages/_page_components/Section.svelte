<script>
  export let title = "";
</script>
<style lang="sass">

  section
    min-width: 700px
    margin-bottom: 36px
    header
      margin-bottom: 24px

    h1
      font-size: 32px
    h3
      margin-bottom: 12px

</style>

<section>
  <header>
    <h1>{title}</h1>
  </header>
  <article type="content">
    <slot/>
  </article>
  <footer>
  </footer>
</section>
