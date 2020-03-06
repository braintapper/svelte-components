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
<<<<<<< HEAD
  <article type="content">
=======
<article type="content">
>>>>>>> 2281ec76cf87920f082cd520700f52d369cb119e
    <slot/>
  </article>
  <footer>
  </footer>
</section>
