<script lang="coffeescript">
  # dependent on Sugar
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte'

  `export let value`

  dispatch = createEventDispatcher()
  displayValue = null

  toInt = (value)->
    return parseInt((value || "0").removeAll(/[^0-9]/))

  toFormattedString = (value)->
    return "#{value}".insert("-",4).insert("-",7)

  numcheck = /[^0-9]/

  refreshOriginal = (display)->
    dispatch "changed", toInt(display)

  refreshDateId = (val)->
    displayValue = toFormattedString(value || 0)


  `$: refreshDateId(value)`
  `$: refreshOriginal(displayValue)`
  `$: displayValue = toFormattedString(toInt(displayValue))`
</script>
<input type="text" bind:value={displayValue} maxlength="10"/>
