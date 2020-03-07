<svelte:head>



</svelte:head>
<script lang="coffee">
    # requires scriptloader in store
  import {loader} from "../../../helpers/stores.js"

  prereqs = [
    './css/vendor/fullcalendar/core/main.css'
    './css/vendor/fullcalendar/daygrid/main.css'
    './css/vendor/fullcalendar/timegrid/main.css'
    './css/vendor/fullcalendar/list/main.css'
    './css/vendor/fullcalendar/full-calendar-custom.css'
  ]

  import CommonIcons from "../../../helpers/icons/common.js"
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import uuid from 'uuid'
  import { Calendar } from '@fullcalendar/core'

  import { getCalendarProps } from './full_calendar.js'

  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import listPlugin from '@fullcalendar/list'
  import interactionPlugin from '@fullcalendar/interaction' # needed for dayClick

  import EventModal from "./EventModal.svelte"
  import EventCloneModal from "./EventCloneModal.svelte"
  import EventDeleteConfirmationModal from "./EventDeleteConfirmationModal.svelte"


  import EventMenu from "./EventMenu.svelte"

  # General Props

  `export { classes as class }`
  `export let style = undefined`
  `export let value = []`

  dispatch = createEventDispatcher()

  classes = null
  calendarEl = undefined
  calendar = undefined
  calendarProps = {}
  oldProps = {}
  updates = {}
  removals = []
  instanceId = uuid()
  editableEvent = null
  deletableEvent = null
  clonableEvent = null


  eventMenuRef = undefined
  eventMenuItems = [
    {
      ordinal: 0
      label: "Edit"
      id: "edit"
      icon: CommonIcons.edit
      classes: []
    }
    {
      ordinal: 1
      label: "Clone"
      id: "clone"
      icon: CommonIcons.clone
      classes: []
    }
    {
      ordinal: 2
      label: "Delete"
      id: "delete"
      icon: CommonIcons.trash
      classes: []
    }
    ]


  cloneModal = false
  deleteModal = false
  eventModal = false
  eventMenu = false

  isDragging = false

  eventMenuClick = (e)->
    console.log "eventmenuclick"
    console.log e.detail
    menuItem = e.detail.menuItem
    switch menuItem.id
      when "edit"
        eventModal = true
        editableEvent = e.detail.event
      when "delete"
        deleteModal = true
        deletableEvent = e.detail.event
      when "clone"
        cloneModal = true
        clonableEvent = e.detail.event

  cancel = ()->
    eventModal = false
    deleteModal = false
    cloneModal = false
    editableEvent = null
    deletableEvent = null
    clonableEvent = null


  mounted = false
  queueCb = ()->
    console.log "fullcalendar queue completed"
    window.dispatchEvent(new Event('resize'));

  onMount ()->
    mounted = true
    loader.enqueue "fullcalendar", prereqs, queueCb
    # hack to force proper initial position, such bs




  window.rerender = rerender = (events) ->

    if mounted
      console.log "rerender fired"
      if (calendar != undefined)
        #console.log(events.length);
        #console.log(events);
        #console.log("should rerender");
        calendar.rerenderEvents()
        #console.log("called calednar reredner")
        #console.log("calendar.fullcalendar")
        #console.log(calendar.getEvents())
        calendarEvents = calendar.getEvents()
        # remove events not in current Events

        calendarIds = calendarEvents.map((item)->
          return item.id
        )

        updatedIds = events.map((item)->
          return item.id
        )



        # removals
        calendarEvents.forEach((calendarEvent)->
          # check to see if found in events
          match = events.find( (event)->
            return (event.id == calendarEvent.id)
          )
          if (typeof match == "undefined")
            #console.log("remove")
            #console.log(calendarEvent)
            calendarEvent.remove()

        )
        # todo: move this out into _Calendar using calendarComponentRef
        events.forEach (event)->
          # only need to check start, end, title
          if (event.id != null)
            match = calendarEvents.find (calendarEvent)->
              return (event.id == calendarEvent.id)

            if (typeof match != "undefined")  # found

              changed = false

              if (match.title != event.title)
                changed = true
              if (!Date.create(match.start).is(event.start))
                changed = true
              if (!Date.create(match.start).is(event.start))
                changed = true

              if (changed)
                match.remove()
                calendar.addEvent(event)

             else
              # doesn't exist, add it
              calendar.addEvent(event)



      else
        console.log("calendar didn't rerender")
    else
      console.log "not mounted, didn't rerender"


  cloneEvent = ()->


  deleteEvent = (e)->
    console.log "deleteEvent"
    console.log deletableEvent
    `value = value.remove( (item)=> {
      return item.id == deletableEvent.id
    })`

    cancel()
  clickedEvent = ()->

  fullCalendar = (element) ->


    window.calendar = calendar = new Calendar element,
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]
      weekends: true
      defaultView:"timeGridWeek"
      header:
        left: 'prev,next today'
        center: 'title'
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      events: value
      timezone: 'local'
      dateClick: (event) ->
        console.log event
        `value = value.append({
          id: uuid(),
          title: "",
          start: event.date,
          end: event.date.clone().addMinutes(60),
          allDay: false,
          editable: true,
          startEditable: true,
          durationEditable: true,
          overlap: false,
          constraint: null,
          extendedProps: {
            dateString: event.date.format("{yyyy}-{MM}-{dd}"),
            durationString: "1h",
            durationMinutes: 60,
            startTimeInputString: event.date.format("{HH}{mm}"),
            startTimeString: event.date.format("{HH}:{mm}"),
            endTimeInputString: event.date.clone().addMinutes(60).format("{HH}{mm}"),
            endTimeString: event.date.clone().addMinutes(60).format("{HH}:{mm}")
          }
        })`
        dispatch('eventsChanged', event)
      datesDestroy: (event) -> dispatch('datesDestroy', event)
      datesRender: (event) -> dispatch('datesRender', event)
      dayRender: (event) -> dispatch('dayRender', event)
      drop: (event) -> dispatch('drop', event)
      eventClick: (eventElement) ->
        console.log "eventClick"
        eventMenu = true



        eventMenuRef = eventElement
        console.log eventElement
        console.log eventElement.el.offsetParent
        console.log eventElement.el.offsetParent.clientHeight
        console.log eventElement.el.clientHeight
        console.log eventElement.el.getBoundingClientRect()

        #dispatch('eventClick', event)
      eventDestroy: (event) -> dispatch('eventDestroy', event)
      eventDragStart: (event) ->
        console.log('eventDragStart', event)
      eventDragStop: (event) ->
        console.log('eventDragStop', event)
      eventDrop: (event) -> dispatch('eventDrop', event)
      eventLeave: (event) -> dispatch('eventLeave', event)
      eventMouseEnter: (event) -> dispatch('eventMouseEnter', event)
      eventMouseLeave: (event) -> dispatch('eventMouseLeave', event)
      eventPositioned: (event) ->
      eventReceive: (event) -> dispatch('eventReceive', event)
      eventRender: (event) -> dispatch('eventRender', event)
      eventResize: (event) ->
        console.log value


      eventResizeStart: (event) ->
        console.log "resize start"
        isDragging = true
      eventResizeStop: (event) ->
        console.log "resize stop"
        isDragging = false
      loading: (event) -> dispatch('loading', event)
      select: (event) -> dispatch('select', event)
      unselect: (event) -> dispatch('unselect', event)
      resourceRender: (event) -> dispatch('resourceRender', event)
      viewSkeletonRender: (event) ->
        dispatch('viewSkeletonRender', event)
      viewSkeletonDestroy: (event) ->
        dispatch('viewSkeletonDestroy', event)
      windowResize: (event) ->
        dispatch('windowResize', event)

    calendar.render()

  onDestroy () ->
    calendar.destroy()


  `$: { console.log("fc events changed"); console.log(value) }`

  `$: { rerender(value) }`
</script>
<div>
<div id="calendar-{instanceId}" use:fullCalendar class={classes} {style} />

{#if eventModal}
<EventModal on:cancel={cancel} on:save={save} on:destroy={destroy} event={editableEvent}/>
{/if}


<EventMenu on:click={eventMenuClick} bind:trigger={eventMenuRef} items={eventMenuItems} bind:showMenu={eventMenu}/>




{#if deleteModal}
  <EventDeleteConfirmationModal event={deletableEvent} on:confirm-delete={deleteEvent} on:cancel={cancel}/>
{/if}
{#if cloneModal}
  <EventCloneModal event={clonableEvent} on:save={cloneEvent} on:cancel={cancel}/>
{/if}
</div>
