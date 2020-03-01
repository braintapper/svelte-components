<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"
  import Tooltip from "../../components/Overlay/Tooltip/Tooltip.svelte"
</script>
<Section title="Tooltips">


  <div>
    <Tooltip>
      <div slot="trigger"><button type="button" normal>Hover</button></div>
      Bah humbug
    </Tooltip>
  </div>


</Section>
