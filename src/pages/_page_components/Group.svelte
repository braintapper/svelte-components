<script>
  export let title = "";
</script>
<style lang="sass">

  header
    margin-bottom: 36px
    h1
      font-size: 36px
      color: var(--dark-blue)

</style>

<section>

  <header>
    <h1>{title}</h1>
  </header>

  <article>
    <slot/>
  </article>
</section>
