<script lang="coffeescript">

  import Section from "../_page_components/Section.svelte"

  import FullCalendar from "../../components/External/FullCalendar/FullCalendar.svelte"

  calendarComponentRef = undefined

  format = "{yyyy}-{MM}-{dd}T{HH}:{mm}:00"
  events = [
    {
      id: uuid()
      title: ""
      start: Date.create().format(format)
      end: Date.create().addMinutes(60).format(format)
      allDay: false
      editable: true
      startEditable: true
      durationEditable: true
      overlap: false
      constraint: null
      extendedProps:
        dateString: Date.create().format("{yyyy}-{MM}-{dd}")
        durationString: "1h"
        durationMinutes: 60
        startTimeInputString: Date.create().format("{HH}{mm}")
        startTimeString: Date.create().format("{HH}:{mm}")
        endTimeInputString: Date.create().addMinutes(60).format("{HH}{mm}")
        endTimeString: Date.create().addMinutes(60).format("{HH}:{mm}")
    }
    {
      id: uuid()
      title: ""
      start: Date.create().addMinutes(90).format(format)
      end: Date.create().addMinutes(240).format(format)
      allDay: false
      editable: true
      startEditable: true
      durationEditable: true
      overlap: false
      constraint: null
      extendedProps:
        dateString: Date.create().format("{yyyy}-{MM}-{dd}")
        durationString: "1h"
        durationMinutes: 60
        startTimeInputString: Date.create().format("{HH}{mm}")
        startTimeString: Date.create().format("{HH}:{mm}")
        endTimeInputString: Date.create().addMinutes(60).format("{HH}{mm}")
        endTimeString: Date.create().addMinutes(60).format("{HH}:{mm}")
    }
  ]
  console.log events
  eventClick = (e) ->

    clickedEvent = e.detail
    clickMenu = true



  eventDrop = (e) ->
    console.log "eventDrop"
    console.log("e")
    console.log(e.detail)





  eventResize = (e) ->
    console.log "eventResize"
    console.log("e")
    console.log(e.detail.event)
    index = events.findIndex (o)->
      return o.id == e.detail.event.id
    events[index].start = e.detail.event.start
    events[index].end = e.detail.event.end
    # todo: fix extended props
    # then save


  eventsChanged = (e) ->
    console.log "events"
    console.log events
    console.log(e.detail)




</script>
<style>

</style>
<Section title="Full Calendar">

		<FullCalendar
		bind:this={calendarComponentRef}
		bind:value={events}
		height={480}
		on:eventsChanged={eventsChanged}
    on:eventClick={eventClick}
    on:eventDrop={eventResize}
    on:eventResize={eventResize}
 />


</Section>
