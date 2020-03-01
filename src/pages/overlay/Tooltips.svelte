<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"
  import Tooltip from "../../components/Overlay/Tooltip/Tooltip.svelte"

</script>
<Section title="Tooltips">


  <div>
    <Tooltip>
      <div><button type="button" normal>Hover</button></div>
      <div slot="tip">Bah humbug!!</div>
    </Tooltip>
  </div>


</Section>
