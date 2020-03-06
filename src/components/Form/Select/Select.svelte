<script lang="coffeescript">


  import { createEventDispatcher, onMount } from 'svelte'

  import Menu from "../../Overlay/Menu/Menu.svelte"

  dispatch = createEventDispatcher()

  `export let disabled = false`
  `export let id = uuid()`
  `export let items = []`
  `export let placeholder = ''`
  `export let selectedIndex = -1`
  `export let size = undefined`
  `export let style = undefined`

  `export let value = null`

  `export let labelKey = "label"`
  `export let idKey = "id"`


  showMenu = false

  toggleOptions = ()->
    console.log "click #{showMenu}"
    showMenu = !showMenu
    console.log "click post #{showMenu}"

  findLabelForValue = (value)->
    found = items.find (item)->
      item[idKey] == value
    if found?
      return found[labelKey]
    else
      return ""

  inputValue = findLabelForValue(value)
  inputRef = undefined


  menuItemClick = (item, index)->
    console.log("menuitem click item: #{item}, hide menu")
    `value = item[idKey]`
    inputValue = item[labelKey]
    showMenu = false


  comboboxId = uuid()
  menuId = uuid()

  invalid = false

  `$: invalid = (value == null)`

  menuClick = (e)->
    console.log "menuClick"
    console.log e.detail
    `value = e.detail[idKey]`
    inputValue = e.detail[labelKey]


  bodyClick = (event) ->
    if comboboxRef
      unless comboboxRef.contains(event.target)
        console.log "combobox blur"
        showMenu = false

  clear = ()->
    `inputValue = ""`
    `value = null`
</script>


<style lang="sass">
  div
    position: relative
  input

    &[invalid="true"]
      color: var(--critical)

  svg
    position: absolute
    top: 0
    right: 0
  div[role="combobox"]
    display: block
    position: relative

  [menu-item]
    display: block
    position: relative
    width: 100%
    padding: 8px 16px

  div[menu]
    display: inline-block
    border: 1px solid black
    width: auto
    margin: 6px
    text-align: left


</style>






<div>
<button
type="select"
bind:this={inputRef}
tabindex="0"
autocomplete="off"
aria-autocomplete="list"
aria-expanded={showMenu}

aria-controls={showMenu ? menuId : undefined}
aria-owns={showMenu ? menuId : undefined}
{placeholder}
on:click={toggleOptions}
on:focus
on:blur
{disabled}
{invalid}
{id}
>{inputValue}&nbsp;</button>
<button on:click={clear} type="button" icon input-right>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
</button>
<Menu bind:showMenu={showMenu} items={items} on:click={menuClick} {labelKey} {idKey} bind:trigger={inputRef} matchTrigger={true}/>
</div>
