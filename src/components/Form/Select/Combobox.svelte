<script lang="coffeescript">


  import { createEventDispatcher, afterUpdate } from 'svelte'

  import Menu from "../../Overlay/Menu/Menu.svelte"

  dispatch = createEventDispatcher()

  `export let disabled = false`
  `export let id = uuid()`
  `export let items = []`
  `export let placeholder = ''`
  `export let selectedIndex = -1`
  `export let value = ""`
  `export let labelKey = "label"`
  `export let idKey = "id"`


  showMenu = false
  invalid = false
  inputValue = null
  inputRef = undefined
  hasfocus = false
  highlightedIndex = -1
  filteredItems = []


  findLabelForValue = (value)->
    found = items.find (item)->
      item[idKey] == value
    if found?
      return found[labelKey]
    else
      return ""

  # initialize
  inputValue = findLabelForValue(value)




  filteredList = (item) ->
    if inputValue.length > 0
      return item[labelKey].toLowerCase().includes(("#{inputValue}").toLowerCase())
    else
      return true



  changeIndex = (direction) ->
    index = highlightedIndex + direction;

    if (index < 0)
      index = items.length - 1
    else if (index >= items.length)
      index = 0
    highlightedIndex = index


  inputFocus = ()->
    showMenu = true


  menuClick = (e)->
    console.log "menuClick"
    console.log e.detail
    `value = e.detail[idKey]`
    inputValue = e.detail[labelKey]


  inputKeyChange = (event)->

    updateValue()
    switch event.key
      when "Enter"
        showMenu = !showMenu
        if (filteredItems.length > 0)
          `value = filteredItems[0][idKey]`
          inputValue = filteredItems[0][labelKey]
          dispatch("change", filteredItems[0])
      when "Tab","Escape"
        showMenu = false
      when "ArrowDown"
        changeIndex(1)
      when "ArrowUp"
        changeIndex(-1)

  comboboxId = uuid()


  clear = ()->
    `inputValue = ""`
    `value = ""`


  updateValue = (value)->
    filteredItems = items.filter(filteredList)
    invalid = (filteredItems.length == 0) && (inputValue.length > 0)

  afterUpdate ()->
    console.log "after update"
    console.log value

  `$: ariaLabel = $$props['aria-label'] || 'Choose an item'`
  `$: selectedItem = items[selectedIndex]`
  `$: blankSlate = 'No matches'`
  `$: updateValue(value)`




</script>


<style lang="sass">






</style>





<div role="combobox" id={comboboxId}>
    <input
      bind:this={inputRef}
      tabindex="0"
      autocomplete="off"
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

    <button icon type="button" input-right on:click={clear}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
    </button>

  <Menu bind:showMenu={showMenu} items={filteredItems} on:click={menuClick} {labelKey} {idKey} bind:blankSlate={blankSlate} bind:trigger={inputRef} matchTrigger={true}/>
</div>
