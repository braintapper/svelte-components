<script lang="coffeescript">

  `export let events = []`
  `export let calendarDate`

  import {  createEventDispatcher } from 'svelte'



  dispatch = createEventDispatcher()




  currentCalendar = []
  currentMonth = null
  currentCalendarHeader = null


</script>

    Time Entries: {events.length}
    <div>
      <table>
      <thead>
      <tr>
        <td>Date</td>
        <td>Start</td>
        <td>End</td>
        <td>Duration</td>
        <td>Memo</td>
      </tr>
      </thead>
      <tbody>
      {#each events.sortBy('start') as event}
        <tr>
          <td>{Date.create(event.start).format("{yyyy}-{MM}-{dd}")} </td>
          <td>{Date.create(event.start).format("{HH}:{mm}")} </td>
          <td>{Date.create(event.end).format("{HH}:{mm}")} </td>
          <td>{ Math.abs((Date.create(event.end) - Date.create(event.start) ) / 1000 / 60 / 60) }  </td>
          <td>{event.memo || ""}</td>
        </tr>
      {/each}
      </tbody>
      <!---
      Totals
      -->
      <tfoot>

      </tfoot>
      </table>
    </div>
