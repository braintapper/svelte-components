<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Radio from "../../components/Form/Radio/Radio.svelte"

  radioValue = "first"


</script>

<style lang="sass">


</style>

<Section title="Radio">
  <div>radioValue: {radioValue}</div>
  <Radio bind:value={radioValue} option="first" label="This has a label"/>
  <Radio bind:value={radioValue} option="second" label="Second Option"/>
  <Radio bind:value={radioValue} style="margin-bottom: 18px"  option="third" label="This has a margin style applied"/>
  <Radio bind:value={radioValue} option="fourth" label="Fourth Option"/>
</Section>
