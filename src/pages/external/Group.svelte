<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Quill from "./Quill.svelte"
  import CodeMirror from "./CodeMirror.svelte"
  import Solver from "./Solver.svelte"
  import HyperMD from "./HyperMD.svelte"
  import FullCalendar from "./FullCalendar.svelte"

  window.dispatchEvent(new Event('resize'))

</script>
<Group title="External">
  <!--<FullCalendar/>-->
  <Solver/>
  <HyperMD/>
  <CodeMirror/>
  <!--<Quill/>-->
</Group>
