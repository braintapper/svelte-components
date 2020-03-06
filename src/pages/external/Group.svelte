<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Quill from "./Quill.svelte"
  import CodeMirror from "./CodeMirror.svelte"
  import Solver from "./Solver.svelte"
  import HyperMD from "./HyperMD.svelte"


</script>
<Group title="External">
  <Solver/>
  <HyperMD/>
  <CodeMirror/>
  <Quill/>
</Group>
