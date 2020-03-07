<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import AgGrid from "../../components/External/AgGrid/AgGrid.svelte"

  value = """
    <h1>Head</h1>
    <p>You suck</p>
  """

</script>
<style>

</style>
<Section title="AgGrid">

  <AgGrid bind:value={value}/>


</Section>
