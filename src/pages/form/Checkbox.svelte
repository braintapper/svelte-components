<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Checkbox from "../../components/Form/Checkbox/Checkbox.svelte"

  checkboxValue = true


</script>

<style lang="sass">


</style>

<Section title="Checkbox">



  <Checkbox bind:checked={checkboxValue}/>

</Section>
