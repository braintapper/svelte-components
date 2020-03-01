<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Modals from "./Modals.svelte"
  import Menus from "./Menus.svelte"
  import Popovers from "./Popovers.svelte"
  import Tooltips from "./Tooltips.svelte"

</script>
<Group title="Overlay Type">
  <Modals/>
  <Menus/>
  <Popovers/>
  <Tooltips/>
</Group>
