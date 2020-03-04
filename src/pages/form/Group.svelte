<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Buttons from "./Buttons.svelte"
  import Common from "./Common.svelte"
  import DateInput  from "./DateInput.svelte"
  import DurationInput  from "./DurationInput.svelte"
  import TranslatedInput  from "./TranslatedInput.svelte"
  import InlineInput  from "./InlineInput.svelte"
  import SearchInput  from "./SearchInput.svelte"
  import TimeInput  from "./TimeInput.svelte"
  import Checkbox  from "./Checkbox.svelte"
  import Radio  from "./Radio.svelte"
  import Combobox  from "./Combobox.svelte"
  import Select  from "./Select.svelte"

</script>
<Group title="Form">
  <Common/>
  <Buttons/>
  <Radio/>
  <Checkbox/>
  <InlineInput/>
  <SearchInput/>
  <DateInput/>
  <TranslatedInput/>
  <TimeInput/>
  <DurationInput/>

  <Select/>
  <Combobox/>
</Group>
