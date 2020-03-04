<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import SearchInput from "../../components/Form/SearchInput/SearchInput.svelte"

  # inline input

  inlineInputValue = ""


</script>

<style lang="sass">


</style>

<Section title="Search Input">

  <h3>Basic Input</h3>

  <SearchInput bind:value={inlineInputValue}/>

</Section>
