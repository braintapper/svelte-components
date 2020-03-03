<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"


</script>

<style lang="sass">


</style>

<Section title="Buttons">
<div>
<button type="button">normal</button>
<button type="button" disabled>disabled</button>
<button type="button" critical>critical</button>
<button type="button" critical disabled>critical disabled</button>
<button type="button" primary>primary</button>
<button type="button" primary disabled>primary disabled</button>
</div>
<div>
<input type="button" value="input type=button">
<input disabled type="button" value="input type=button">
<input critical type="button" value="input type=button">
<input primary type="button" value="input type=button">
</div>
</Section>
