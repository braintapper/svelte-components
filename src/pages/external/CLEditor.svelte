<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import CLEditor from "../../components/External/CLEditor/CLEditor.svelte"

  value = """
    <h1>Head</h1>
    <p>You suck</p>
  """

</script>
<style>

</style>
<Section title="CKEditor">

  <CLEditor bind:value={value}/>


</Section>
