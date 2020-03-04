<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Checkbox from "../../components/Form/Checkbox/Checkbox.svelte"

  checkboxValue = true


</script>

<style lang="sass">


</style>

<Section title="Checkbox">
  <div>CheckboxValue: {checkboxValue}</div>
  <Checkbox bind:checked={checkboxValue} label="This has a label"/>
  <Checkbox/>
  <Checkbox style="margin-bottom: 18px" label="This has a margin style applied"/>
  <Checkbox/>

</Section>
