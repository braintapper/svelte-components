<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import TranslatedInput from "../../components/Form/TranslatedInput/TranslatedInput.svelte"

  # inline input

  inputValue = ""


</script>

<style lang="sass">


</style>

<Section title="Translated Input">

  <h3>TranslatedInput Input</h3>
  <p>Masked input of numbers
  </p>

  <TranslatedInput bind:value={inputValue}/>

</Section>
