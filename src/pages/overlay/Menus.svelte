<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import Menu from "../../components/Overlay/Menu/Menu.svelte"

  import CommonIcons from "../../helpers/icons/common.js"

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

  showMenu1 = false
  showMenu2 = false

  menu1 = ()->
    showMenu1 = true

  menu2 = ()->
    showMenu2 = true

  menuClick = (e)->
    console.log "menu choice made"
    console.log e.detail

  menuRef1 = undefined
  menuRef2 = undefined

</script>
<Section title="Menus">


  <div>
    <button type="button" normal on:click={menu1} bind:this={menuRef1}>Text</button>
    <Menu bind:showMenu={showMenu1} items={menuOptions} on:click={menuClick} {labelKey} {idKey} bind:trigger={menuRef1} />
  </div>

  <div >
    <button type="button" icon on:click={menu2} bind:this={menuRef2}>{@html CommonIcons["starred"]}</button>
    <Menu bind:showMenu={showMenu2} items={menuOptions} on:click={menuClick} {labelKey} {idKey} bind:trigger={menuRef2} align="right"/>
  </div>


</Section>
