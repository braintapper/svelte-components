<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import DurationInput from "../../components/Form/DurationInput/DurationInput.svelte"

  # inline input

  inputValue = ""


</script>

<style lang="sass">


</style>

<Section title="Duration Input">

  <h3>Duration Input</h3>
  <p>Masked input of numbers
  </p>

  <DurationInput bind:value={inputValue}/>

</Section>
