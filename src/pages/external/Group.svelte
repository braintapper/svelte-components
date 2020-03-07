<script lang="coffeescript">

  import Group from "../_page_components/Group.svelte"

  import Select from "../../components/Form/Select/Select.svelte"

  import Quill from "./Quill.svelte"
  import CodeMirror from "./CodeMirror.svelte"
  import Solver from "./Solver.svelte"
  import HyperMD from "./HyperMD.svelte"
  import FullCalendar from "./FullCalendar.svelte"
  import CLEditor from "./CLEditor.svelte"
  import AgGrid from "./AgGrid.svelte"


  window.dispatchEvent(new Event('resize'))

  library = "aggrid"

  inputOptions = [
    { id: "fullcalendar", label: "FullCalendar", icon: "1"}
    { id: "hypermd", label: "HyperMD", icon: "2"}
    { id: "solver", label: "Solver", icon: "3"}
    { id: "codemirror", label: "CodeMirror", icon: "4"}
    { id: "quill",  label: "Quill", icon: "5"}
    { id: "cleditor",  label: "CLEditor", icon: "5"}

    { id: "aggrid",  label: "agGrid", icon: "5"}
  ]

</script>
<Group title="External">

  <div>
    <h3>Select A Component</h3>
    <field>
      <Select items={inputOptions} bind:value={library}/>
    </field>
  </div>
  <div>
    {#if library=="fullcalendar"}
      <FullCalendar/>
    {/if}
    {#if library=="solver"}
      <Solver/>
    {/if}

    {#if library=="hypermd"}
      <HyperMD/>
    {/if}

    {#if library=="codemirror"}
      <CodeMirror/>
    {/if}

    {#if library=="quill"}
      <Quill/>
    {/if}
    {#if library=="cleditor"}
      <CLEditor/>
    {/if}


    {#if library=="aggrid"}
      <AgGrid/>
    {/if}



  </div>
</Group>
