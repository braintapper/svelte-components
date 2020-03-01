<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import InlineInput from "../../components/Form/InlineInput/InlineInput.svelte"

  # inline input

  inlineInputValue = "Click on me to edit"


</script>

<style lang="sass">


</style>

<Section title="Inline Input">

  <h3>Basic Input</h3>

  <InlineInput bind:value={inlineInputValue}/>

</Section>
