<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Expandable from "../../components/Expandable/Expandable.svelte"
  import Checkbox from "../../components/Form/Checkbox/Checkbox.svelte"
  checkboxValue = true
</script>
<style lang="sass">
  [level="1"]
    margin-left: 10px
  [level="2"]
    margin-left: 20px
  [level="3"]
    margin-left: 30px

  .accordion-header
    border-bottom: 1px solid var(--black)
    h6
      margin: 0px
      padding: 12px
      height: 100%
      display: block
      width: 100%

</style>
<Section title="Expandable">
  <field>
    <Checkbox bind:checked={checkboxValue} label="Open"/>
  </field>

  <h2>Default Behaviour</h2>

  <p>Clicking on summary will toggle details visibility</p>
  <Expandable bind:open={checkboxValue} allowClick={true}>
    <div slot="summary">
      <h6>Summary</h6>
    </div>
    <div>Details</div>
  </Expandable>

  <h2>Custom Behaviour</h2>
  <p>Clicking on summary will not toggle details visibility, but clicking on a button will.</p>
  <Expandable bind:open={checkboxValue} allowClick={false}>
    <div slot="summary" layout="row">
      <div flex>
        <h6>Summary</h6>
      </div>
      <div flex="initial">
        <button on:click={()=>{checkboxValue = !checkboxValue}}>open:{checkboxValue}</button>
      </div>
    </div>
    <div>Details</div>
  </Expandable>

  <h2>Nesting</h2>

  <Expandable allowClick={true}>
    <div slot="summary">
        <h6>Level 1</h6>
    </div>
    <div level="1">
      <Expandable  allowClick={true}>
        <div slot="summary">
            <h6>Level 2</h6>
        </div>
        <div level="2">
          <Expandable  allowClick={true}>
            <div slot="summary">
                <h6>Level 3</h6>
            </div>
            <div level="3">
              Details

            </div>
          </Expandable>
        </div>
      </Expandable>
    </div>
  </Expandable>

  <h2>Accordion</h2>
  <Expandable  allowClick={true} style="border: 1px solid var(--black); border-bottom: 0px">
    <div slot="summary" class="accordion-header">
        <h6>Level 3</h6>
    </div>
    <div level="3">
      Details

    </div>
  </Expandable>
  <Expandable  allowClick={true} style="border: 1px solid var(--black); border-bottom: 0px">
    <div slot="summary" class="accordion-header">
        <h6>Level 3</h6>
    </div>
    <div level="3">
      Details

    </div>
  </Expandable>
  <Expandable  allowClick={true} style="border: 1px solid var(--black)">
    <div slot="summary" class="accordion-header">
        <h6>Level 3</h6>
    </div>
    <div level="3">
      Details

    </div>
  </Expandable>

</Section>
