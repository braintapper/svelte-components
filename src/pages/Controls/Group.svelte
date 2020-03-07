<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Expandable from "./Expandable.svelte"


  window.dispatchEvent(new Event('resize'))

</script>
<Group title="Controls">
  <Expandable/>

</Group>
