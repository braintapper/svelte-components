<script lang="coffeescript">


  import { createEventDispatcher } from 'svelte'

  dispatch = createEventDispatcher()

  className = undefined


  # export { className as class };
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




  bodyClick = (event) ->
    if comboboxRef
      unless comboboxRef.contains(event.target)
        console.log "blur"
        showMenu = false

  clear = ()->
    `inputValue = ""`
    `value = ""`
</script>


<style lang="sass">
  input
    width: 100%
    height: 100%
    padding: 0px
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


<svelte:body on:click={bodyClick} />

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
        on:click={() => {
          console.log("listbox field click, show menu");
          showMenu = true;
        }}
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
    {#if showMenu}
      <div menu aria-label={ariaLabel} {id}>
        {#each filteredItems as item, i (item.id || i)}
          <button menu-item id={item[idKey]} active={selectedIndex === i || selectedId === item.id} highlighted={highlightedIndex === i || selectedIndex === i} on:click={menuItemClick(item,i)}>
            {item[labelKey]}
          </button>
        {/each}
        {#if filteredItems.length == 0}
          <button menu-item>
            No items found matching "{inputValue}"
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>
