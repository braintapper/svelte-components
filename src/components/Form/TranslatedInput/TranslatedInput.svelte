<script lang="coffeescript">
  # dependent on Sugar
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte'


  `export let value = ''`
  `export let translatedValue = ''`
  `export let maxlength = 50`
  `export let translateFn = (val) => { return (val || "empty").toUpperCase() }`
  `export let validateFn = (val) => { return true }`
  `export let stateFn = (val) => { return "ok" }`

  style = undefined

  dispatch = createEventDispatcher()


  labelRef = null


  change = (e)->
    console.log "debounced change"
    dispatch "change", { value: value, translatedValue: translatedValue }

  debouncedUpdate = change.debounce(250)


  afterUpdate ()->

    if labelRef?
      style = "padding-right: #{16 + labelRef.clientWidth}px"


  `$: translatedValue = translateFn(value)`
  `$: valid = validateFn(value)`
  `$: state = stateFn(value)`


</script>
<style lang="sass">




</style>
<div container>
  <input type="text" bind:value={value} on:keyup={debouncedUpdate} {style} {maxlength} {valid}/>
  <label bind:this={labelRef} type="translated-input" {state}>{translatedValue}</label>
</div>
