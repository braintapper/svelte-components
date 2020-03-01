<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"
  import CommonIcons from "../../helpers/icons/common.js"

  icons = Object.keys(CommonIcons)

</script>

<style lang="sass">
  div[icon]
    display: inline-block
    height: 36px
    width: 36px
    padding: 6px
    border-radius: 4px
    &:hover
      background-color: var(--light-gray)
</style>

<Section title="Common">
<div>
  {#each icons as icon}
    <div icon>{@html CommonIcons[icon]}</div>
  {/each}
</div>
</Section>
