<script lang="coffeescript">

  import { onMount, afterUpdate, createEventDispatcher } from 'svelte'

  `export let value = ''`
  `export let maxlength = 50`
  `export let translateFn = (val) => { return (val || "empty").toUpperCase() }`
  `export let validateFn = (val) => { return true }`
  `export let stateFn = (val) => { return "ok" }`

  style = undefined

  dispatch = createEventDispatcher()


  labelRef = null


  change = (e)->
    dispatch "change", { value: value, translatedValue: translatedValue }

  afterUpdate ()->

    if labelRef?
      style = "padding-right: #{16 + labelRef.clientWidth}px"


  `$: translatedValue = translateFn(value)`
  `$: valid = validateFn(value)`
  `$: state = stateFn(value)`


</script>
<style lang="sass">
  // appears inside a text type of input on the right side
  // remember to add right padding on the input manually

  label[type="translated-input"]
    position: absolute
    right: 0px
    top: 0px
    margin-top: 7px
    margin-right: 8px
    padding: 2px 6px
    font-size: var(--font-xs)
    font-weight: var(--font-bold)
    color: var(--white)
    background: var(--blue)
    border-radius: var(--corner-s)
    &[state=empty],&[state=neutral]
      background: var(--neutral)
    &[state="ok"]
      background: var(--ok)
    &[state=critical]
      background: var(--critical)
    &[state=warning]
      background: var(--warning)


</style>
<div>
  <input type="text" bind:value={value} on:keyup={change} on:change={change} {style} {maxlength} invalid={!valid}/>
  <label bind:this={labelRef} type="translated-input" {state}>{translatedValue}</label>
</div>
