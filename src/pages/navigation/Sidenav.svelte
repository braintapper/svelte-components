<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Menu from "../../components/Overlay/Menu/Menu.svelte"

  import CommonIcons from "../../helpers/icons/common.js"

  import Sidenav from "../../components/Navigation/Sidenav/Sidenav.svelte"

  menuOptions = [
    { id: 1, value: "test1", label: "Label 1", icon: "1"}
    { id: 2, value: "test2", label: "Label 2", icon: "2"}
    { id: 3, value: "test3", label: "Label 3", icon: "3"}
    { id: 4, value: "test4", label: "Label 4", icon: "4"}
    { id: 5, value: "test5", label: "Label 5", icon: "5"}
    { id: 6, value: "test6", label: "Label 6", icon: "6"}
    { id: 7, value: "test7", label: "Label 7", icon: "7"}
    { id: 8, value: "test8", label: "Label 8", icon: "8"}
  ]

  labelKey = "label"
  idKey = "value"

  position = "left"

  showNav = false
  showMenu2 = false

  togglenav = () ->
    showNav = !showNav

  hideNav = ()->
    showNav = false

  menu2 = ()->
    showMenu2 = true

  menuClick = (e)->
    console.log "menu choice made"
    console.log e.detail

  menuRef1 = undefined
  menuRef2 = undefined

</script>
<style>

</style>
<Section title="Sidenav">
  <div>
    <select bind:value={position}>
      <option value="left">Left</option>
      <option value="right">Right</option>
    </select>
  </div>

  <div bind:this={menuRef1}>
    <button type="button" normal on:click={togglenav}>Toggle</button>
    <div>{showNav}</div>

  </div>



</Section>

<Sidenav bind:open={showNav} {position}>
  <p><a href="javascript:void(0)" class="closebtn" on:click={togglenav()}>&times;</a></p>
  <p><a href="#">About</a></p>
  <p><a href="#">Services</a></p>
  <p><a href="#">Clients</a></p>
  <p><a href="#">Contact</a></p>
</Sidenav>
