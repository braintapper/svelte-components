<script lang="coffeescript">


  import { createEventDispatcher, onMount, afterUpdate } from 'svelte'
  import { slide } from 'svelte/transition'


  dispatch = createEventDispatcher()

  `export let disabled = false`
  `export let id = uuid()`
  `export let items = []`
  `export let width = '200px'`

  `export let selectedIndex = -1`
  `export let size = undefined`


  `export let value = ""`
  `export let blankSlate = ""`

  `export let labelKey = "label"`
  `export let idKey = "id"`


  `export let showMenu = false`

  `export let align = "left"`


  `export let parent = undefined`
  # if a parent is defined, it maps the width to the parent
  # and is placed just below it, used for combobox and custom select
  `export let matchParent = false`


  style = undefined

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



  menuId = uuid()

  onMount ()->
    console.log "parent, mounted"



  checkParent = (i)->
    if parent?
      if matchParent
        style = "width: #{width};top: #{parent.clientHeight + 4}px; width: #{parent.clientWidth + 2}px"
      else

        if align == "left"
          style = "width: #{width};top: #{parent.clientHeight + 4}px;"
        else
          parentContainerWidth = parent.offsetParent.clientWidth
          parentCoords = parent.getBoundingClientRect()
          right = parentContainerWidth  - (parentCoords.width)
          style = "width: #{width};top: #{parent.clientHeight + 4}px; right: #{right}px"


  `$: checkParent(parent)`

  menuItemClick = (item, index)->
    `showMenu = false`
    dispatch "click", item


  overlayClick = ()->
    `showMenu = false`

  afterUpdate ()->
    if parent?
      console.log parent.getBoundingClientRect()
</script>


<style lang="sass">


  div[menu]
    position: absolute

    background: white
    display: inline-block
    border: 1px solid var(--menu-border)
    width: auto
    text-align: left
    z-index: var(--z-index-menu)
    &[align="left"]
      left: 0


  [menu-item]
    display: block
    position: relative
    width: 100%
    padding: var(--fine-spacing-s) var(--fine-spacing-m)
    &:hover
      background: var(--lighter-gray)



</style>
<div type="overlay" clear open={showMenu} on:click={overlayClick}/>
{#if showMenu}
  <div bind:this={menuRef} menu id={menuId} transition:slide="{{duration: 75}}" {style} {align}>
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
