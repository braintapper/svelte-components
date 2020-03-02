<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Buttons from "./Buttons.svelte"
  import Common from "./Common.svelte"
  import DateInput  from "./DateInput.svelte"
  import DurationInput  from "./DurationInput.svelte"
  import InlineInput  from "./InlineInput.svelte"
  import TimeInput  from "./TimeInput.svelte"
  import Checkbox  from "./Checkbox.svelte"
  import Combobox  from "./Combobox.svelte"

</script>
<Group title="Form">
  <Common/>
  <Buttons/>
  <InlineInput/>
  <DateInput/>
  <TimeInput/>
  <DurationInput/>
  <Checkbox/>
  <Combobox/>
</Group>
