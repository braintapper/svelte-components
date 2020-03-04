<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Buttons from "./Buttons.svelte"
  import Common from "./Common.svelte"
  import DateInput  from "./DateInput.svelte"
  import DurationInput  from "./DurationInput.svelte"
  import InlineInput  from "./InlineInput.svelte"
  import SearchInput  from "./SearchInput.svelte"
  import TimeInput  from "./TimeInput.svelte"
  import Checkbox  from "./Checkbox.svelte"
  import Combobox  from "./Combobox.svelte"
  import Select  from "./Select.svelte"

</script>
<Group title="Form">
  <Common/>
  <Buttons/>
  <InlineInput/>
  <SearchInput/>
  <DateInput/>
  <TimeInput/>
  <DurationInput/>
  <Checkbox/>
  <Select/>
  <Combobox/>
</Group>
