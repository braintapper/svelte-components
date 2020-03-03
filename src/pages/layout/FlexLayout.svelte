<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"


</script>

<style lang="sass">
  [layout="row"], [layout="column"]
    width: 100%
    & > div
      border: 1px solid var(--black)


</style>

<Section title="Flex Layout">


  <h1>Row</h1>

  <div layout="row">
    <div flex="33">1</div>
    <div flex="33">2</div>
    <div flex="33">3</div>
  </div>

  <h1>Column</h1>

  <div layout="column">
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </div>




</Section>
