<script lang="coffeescript">


  export calendarDate = Date.create()
  export events = []

  import { createEventDispatcher } from 'svelte'
  dispatch = createEventDispatcher()

  weeks = []

  console.log events

  eventsForDay = (day)->

    if events.length ==  0
      return []
    else
      return events.filter (event)->
        return Date.create(event.start).format("{MM}{dd}") == Date.create(day).format("{MM}{dd}")




  currentCalendar = []
  currentMonth = null
  currentCalendarHeader = null

  generate = ()->
    weeks = []
    if calendarDate?
      currentCalendarHeader = calendarDate.format("{Month} {yyyy}")
      currentMonth = calendarDate.format("{M}")
      calendarStart = calendarDate.clone().beginningOfMonth().beginningOfWeek()
      calendarEnd = calendarDate.clone().endOfMonth().endOfWeek()
      runningDate = calendarStart.clone()
      currentWeek = []
      count = 0
      while runningDate.isBetween(calendarStart, calendarEnd)
        currentWeek.push runningDate.clone()
        runningDate.addDays(1)
        count++
        if count == 7
          weeks.push currentWeek
          currentWeek = []
          count = 0







  current = ()->
    calendarDate = Date.create().clone()
    console.log calendarDate

    generate()

  next = ()->
    calendarDate.addMonths(1)
    generate()
    console.log "calendarDate #{calendarDate}"


  previous = ()->
    calendarDate.addMonths(-1)
    generate()
    console.log "calendarDate #{calendarDate}"

  nextYear = ()->
    calendarDate.addYears(1)
    generate()
    console.log "calendarDate #{calendarDate}"


  previousYear = ()->
    calendarDate.addYears(-1)
    generate()
    console.log "calendarDate #{calendarDate}"

  current()


  setDay = (day)->
    console.log "CALENDAR SETDAY"
    dispatch "setDay", day


  mouseleave = (e)->
    dispatch "mouseleave", e



</script>

<style lang="sass">
  [container]
    display: block
  table
    padding: 14px

  tr[monthname]
    td
      font-weight: bold
      text-align: center
      padding: 6px 0px 18px 0px
      font-size: 18px
  tr[weekdays]
    td
      text-align: center

  tbody
    td
      text-align: center
      height: 32px
      width: 32px
      font-weight: bold

  [month=previous]
    color: #dddddd
  [month=next]
    color: #dddddd

  tfoot
    button
      padding: 0px
      background: none
      border: none
      &:hover
        color: blue
  tbody
    td[events]
      background: tan
    td[events="0"]
      background: none

    button
      background: none

  [today="true"]
    background-color: blue !important
  [selected="true"]
    background-color: red !important

</style>





<div container on:mouseleave={mouseleave}>



<table calendar>
  <thead>
    <tr monthname>
      <td colspan="7">{currentCalendarHeader}</td>
    </tr>
    <tr weekdays>
      <td>S</td>
      <td>M</td>
      <td>T</td>
      <td>W</td>
      <td>T</td>
      <td>F</td>
      <td>S</td>
    </tr>
  </thead>
  <tbody>
    {#each weeks as week, weekIndex}
      <tr>

        {#each week as day, dayindex}
          {#if (parseInt(day.format("{M}")) != parseInt(currentMonth)) }
            {#if (weekIndex < 1) }
              <td month="previous" events={eventsForDay(day).length} selected={day.is(calendarDate)}><button on:click={setDay(day)}>{day.format("{d}")}</button></td>
            {:else}
              <td month="next" events={eventsForDay(day).length} selected={day.is(calendarDate)}><button on:click={setDay(day)}>{day.format("{d}")}</button></td>
            {/if}
          {:else}
            <td month="current" events={eventsForDay(day).length} today={day.isToday()} selected={day.is(calendarDate)}><button on:click={setDay(day)}>{day.format("{d}")}</button></td>
          {/if}
        {/each}
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <td><button type="button" on:click={previousYear}>&laquo;</button></td>
      <td><button type="button" on:click={previous}>&lt;</button></td>
      <td></td>
      <td><button type="button" on:click={current}>&bull;</button></td>
      <td></td>
      <td><button type="button" on:click={next}>&gt;</button></td>
      <td><button type="button" on:click={nextYear}>&raquo;</button></td>
    </tr>
  </tfoot>

</table>
</div>
