<script lang="coffeescript">


  import { createEventDispatcher } from 'svelte'

  import Menu from "../../Overlay/Menu/Menu.svelte"

  dispatch = createEventDispatcher()

  `export let disabled = false`
  `export let id = uuid()`
  `export let items = []`
  `export let placeholder = ''`
  `export let selectedIndex = -1`
  `export let size = undefined`
  `export let style = undefined`

  `export let value = ""`

  `export let labelKey = "label"`
  `export let idKey = "id"`


  showMenu = false

  findLabelForValue = (value)->
    found = items.find (item)->
      item[idKey] == value
    if found?
      return found[labelKey]
    else
      return ""

  inputValue = findLabelForValue(value)

  filteredItems = []

  filteredList = (item) ->
    if inputValue.length > 0
      return item[labelKey].toLowerCase().includes(("#{inputValue}").toLowerCase())
    else
      return true



  selectedId = undefined
  inputRef = undefined
  comboboxRef = undefined

  hasfocus = false

  highlightedIndex = -1

  changeIndex = (direction) ->
    index = highlightedIndex + direction;

    if (index < 0)
      index = items.length - 1
    else if (index >= items.length)
      index = 0
    highlightedIndex = index


  inputFocus = ()->
    showMenu = true

  updateItem = (item)->
    `value = item[idKey]`
    `inputValue = item[labelKey]`



  menuItemClick = (item, index)->
    console.log("menuitem click item: #{item}, hide menu")
    updateItem item
    showMenu = false


  inputKeyChange = (event)->
    `filteredItems = items.filter(filteredList)`

    switch event.key
      when "Enter"
        showMenu = !showMenu
        if (filteredItems.length > 0)
          value = filteredItems[0][idKey]
          inputValue = filteredItems[0][labelKey]
          dispatch("change", filteredItems[0])
      when "Tab","Escape"
        showMenu = false
      when "ArrowDown"
        changeIndex(1)
      when "ArrowUp"
        changeIndex(-1)

  comboboxId = uuid()
  menuId = uuid()

  invalid = false

  `$: ariaLabel = $$props['aria-label'] || 'Choose an item'`
  `$: highlightedId = items[highlightedIndex] ? items[highlightedIndex].id : undefined`
  `$: filteredItems = items.filter(filteredList)`
  `$: selectedItem = items[selectedIndex]`
  `$: invalid = (filteredItems.length == 0) && (inputValue.length > 0)`

  `$: blankSlate = 'No input matching !' + inputValue + '"'`

  menuClick = (e)->
    console.log "menuClick"
    console.log e.detail
    value = e.detail[idKey]
    inputValue = e.detail[labelKey]
  bodyClick = (event) ->
    if comboboxRef
      unless comboboxRef.contains(event.target)
        console.log "combobox blur"
        showMenu = false

  clear = ()->
    `inputValue = ""`
    `value = ""`
</script>


<style lang="sass">
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




<div {style}>
  <div role="combobox"
    bind:this={comboboxRef}
    id={comboboxId}
    aria-label={ariaLabel}
    {disabled}
    {size}>
    <listboxfield
      role="button"
      aria-expanded={showMenu}

      {id}
      {disabled}
      >
      <input
        bind:this={inputRef}
        tabindex="0"
        autocomplete="off"
        aria-autocomplete="list"
        aria-expanded={showMenu}
        aria-activedescendant={highlightedId}
        aria-labelledby={comboboxId}
        aria-disabled={disabled}
        aria-controls={showMenu ? menuId : undefined}
        aria-owns={showMenu ? menuId : undefined}
        {placeholder}
        on:click={inputFocus}
        on:focus={inputFocus}
        on:keydown
        on:keydown|stopPropagation={inputKeyChange}
        on:keyup={inputKeyChange}
        on:focus
        on:blur
        {disabled}
        {invalid}
        {id}
        bind:value={inputValue} />


      <button on:click={clear}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      </button>

    </listboxfield>
    <Menu bind:showMenu={showMenu} items={filteredItems} on:click={menuClick} {labelKey} {idKey} bind:blankSlate={blankSlate} bind:parent={inputRef} matchParent={true}/>
    showMenu: {showMenu}
  </div>
</div>
