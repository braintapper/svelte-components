<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import TimeInput from "../../components/Form/TimeInput/TimeInput.svelte"

  # inline input

  inputValue = ""


</script>

<style lang="sass">


</style>

<Section title="Time Input">

  <h3>Time Input</h3>
  <p>Masked input of numbers
  </p>

  <TimeInput bind:value={inputValue}/>

</Section>
