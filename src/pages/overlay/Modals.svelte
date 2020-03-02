<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"


  import DeleteConfirmation from "../../components/Overlay/Modal/DeleteConfirmation.svelte"

  showDeleteConfirmation = false

  modals = [
    {
      show: false

    }
  ]

  cancel = ()->
    showDeleteConfirmation = false
  confirmDelete = ()->
    showDeleteConfirmation = true
  destroy = ()->
    console.log "deostry"

</script>
<Section title="Modals">

  <div>
    <button type="button" normal>Generic</button>
  </div>

  <div>
    <button type="button" normal critical>Alert</button>
  </div>

  <div>
    <button type="button" normal primary>Create/Edit</button>
  </div>

  <div>
    <button type="button" normal critical on:click={confirmDelete}>Delete Confirmation</button>
  </div>

</Section>

{#if showDeleteConfirmation}
  <DeleteConfirmation on:cancel={cancel} on:confirm={destroy}/>
{/if}
