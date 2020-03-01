<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import DateInput from "../../components/Form/DateInput/DateInput.svelte"

  # inline input

  inputValue = ""


</script>

<style lang="sass">


</style>

<Section title="Date Input">

  <h3>Date Input</h3>
  <p>Masked input of numbers
  </p>

  <DateInput bind:value={inputValue}/>

</Section>
