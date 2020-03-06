<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Select from "../../components/Form/Select/Select.svelte"
  import Combobox from "../../components/Form/Select/Combobox.svelte"

  inputOptions = [
    { id: 1, value: "test1", label: "Label 1", icon: "1"}
    { id: 2, value: "test2", label: "Label 2", icon: "2"}
    { id: 3, value: "test3", label: "Label 3", icon: "3"}
    { id: 4, value: "test4", label: "Label 4", icon: "4"}
    { id: 5, value: "test5", label: "Label 5", icon: "5"}
    { id: 6, value: "test6", label: "Label 6", icon: "6"}
    { id: 7, value: "test7", label: "Label 7", icon: "7"}
    { id: 8, value: "test8", label: "Label 8", icon: "8"}
  ]
  inputValue = true
  value = 6


</script>

<style lang="sass">


</style>

<Section title="Selection Types">

  <h3>Select</h3>
  <field>
    <Select items={inputOptions} bind:value={value}/>
  </field>
  <h3>Combobox/Autocomplete</h3>
  <field>
    <Combobox items={inputOptions} bind:value={value}/>
  </field>


</Section>
