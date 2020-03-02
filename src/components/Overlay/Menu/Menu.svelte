<script lang="coffeescript">


  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'


  dispatch = createEventDispatcher()

  `export let disabled = false`
  `export let id = uuid()`
  `export let items = []`

  `export let selectedIndex = -1`
  `export let size = undefined`
  `export let style = undefined`

  `export let value = ""`
  `export let blankSlate = ""`

  `export let labelKey = "label"`
  `export let idKey = "id"`


  `export let showMenu = false`

  `export let parent = undefined`

  findLabelForValue = (value)->
    found = items.find (item)->
      item[idKey] == value
    if found?
      return found[labelKey]
    else
      return ""

  inputValue = findLabelForValue(value)





  menuRef = undefined



  hasfocus = false

  highlightedIndex = -1

  changeIndex = (direction) ->
    index = highlightedIndex + direction;

    if (index < 0)
      index = items.length - 1
    else if (index >= items.length)
      index = 0
    highlightedIndex = index






  menuItemClick = (item, index)->
    `showMenu = false`
    dispatch "click", item

  menuId = uuid()

  bodyClick = (event) ->
    console.log "bodyclick"
    console.log event.target
    console.log "parent.contains(event.target): #{parent.contains(event.target)}"
    if parent?
      console.log parent.contains?

      unless parent.contains(event.target)
        console.log "parent blur"
        `showMenu = false`
    else
      if menuRef
        unless menuRef.contains(event.target)
          console.log "menu blur"
          `showMenu = false`


</script>


<style lang="sass">


  div[menu]
    position: absolute
    background: white
    display: inline-block
    border: 1px solid black
    width: auto
    margin: 6px
    text-align: left
    z-index: 100

  [menu-item]
    display: block
    position: relative
    width: 100%
    padding: 8px 16px
    &:hover
      background: var(--lighter-gray)



</style>
<svelte:body on:click={bodyClick} />
{#if showMenu}
  <div bind:this={menuRef} menu id={menuId} transition:slide="{{duration: 75}}">
    {#each items as item, i (item.id || i)}
      <button menu-item id={item[idKey]} active={selectedIndex === i} highlighted={highlightedIndex === i || selectedIndex === i} on:click={menuItemClick(item,i)}>
        {item[labelKey]}
      </button>
    {/each}
    {#if items.length == 0}
      <button menu-item>{@html blankSlate}</button>
    {/if}
  </div>
{/if}
