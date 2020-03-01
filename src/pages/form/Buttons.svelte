<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"


</script>

<style lang="sass">


</style>

<Section title="Buttons">
<div>
<button normal>normal</button>
<button normal disabled>disabled</button>
<button normal critical>critical</button>
<button normal critical disabled>critical disabled</button>
<button normal primary>primary</button>
<button normal primary disabled>primary disabled</button>
</div>
<div>
<input normal type="button" value="input type=button">
<input normal disabled type="button" value="input type=button">
<input normal critical type="button" value="input type=button">
<input normal primary type="button" value="input type=button">
</div>
</Section>
