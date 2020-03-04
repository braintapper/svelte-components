<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import uuid from 'uuid';
	import { Calendar } from '@fullcalendar/core';
	import deepEqual from 'fast-deep-equal';
	import { getCalendarProps } from '../../helpers/full_calendar.js';
	// General Props
	let classes = null;
	export { classes as class };
	export let style = null;
	const dispatch = createEventDispatcher();
	let calendarEl;
	let calendar;
	let calendarProps = {};
	let oldProps = {};
	let updates = {};
	let removals = [];
  let instanceId = uuid();
	onMount(() => {
		calendarProps = getCalendarProps($$props);
		oldProps = { ...calendarProps };
		calendar = new Calendar(calendarEl, {
			...calendarProps,
			dateClick: (event) => dispatch('dateClick', event),
			datesDestroy: (event) => dispatch('datesDestroy', event),
			datesRender: (event) => dispatch('datesRender', event),
			dayRender: (event) => dispatch('dayRender', event),
			drop: (event) => dispatch('drop', event),
			eventClick: (event) => dispatch('eventClick', event),
			eventDestroy: (event) => dispatch('eventDestroy', event),
			eventDragStart: (event) => dispatch('eventDragStart', event),
			eventDragStop: (event) => dispatch('eventDragStop', event),
			eventDrop: (event) => dispatch('eventDrop', event),
			eventLeave: (event) => dispatch('eventLeave', event),
			eventMouseEnter: (event) => dispatch('eventMouseEnter', event),
			eventMouseLeave: (event) => dispatch('eventMouseLeave', event),
			eventPositioned: (event) => dispatch('eventPositioned', event),
			eventReceive: (event) => dispatch('eventReceive', event),
			eventRender: (event) => dispatch('eventRender', event),
			eventResize: (event) => dispatch('eventResize', event),
			eventResizeStart: (event) => dispatch('eventResizeStart', event),
			eventResizeStop: (event) => dispatch('eventResizeStop', event),
			loading: (event) => dispatch('loading', event),
			select: (event) => dispatch('select', event),
			unselect: (event) => dispatch('unselect', event),
			resourceRender: (event) => dispatch('resourceRender', event),
			viewSkeletonRender: (event) =>
				dispatch('viewSkeletonRender', event),
			viewSkeletonDestroy: (event) =>
				dispatch('viewSkeletonDestroy', event),
			windowResize: (event) => dispatch('windowResize', event),
		});
		calendar.render();
	});
  let rerender = (events) => {
    if (calendar != undefined) {
      //console.log(events.length);
      //console.log(events);
      //console.log("should rerender");
      calendar.rerenderEvents();
      //console.log("called calednar reredner");
      //console.log("calendar.fullcalendar")
      //console.log(calendar.getEvents());
      let calendarEvents = calendar.getEvents();
      // remove events not in current Events

      let calendarIds = calendarEvents.map((item)=> {
        return item.id
      });

      let updatedIds = events.map((item)=>{
        return item.id
      });



      // removals
      calendarEvents.forEach((calendarEvent)=>{
        // check to see if found in events
        let match = events.find( (event)=> {
          return (event.id == calendarEvent.id);
        });
        if (typeof match == "undefined") {
          //console.log("remove");
          //console.log(calendarEvent);
          calendarEvent.remove();
        }
      });
      // todo: move this out into _Calendar using calendarComponentRef
      events.forEach((event)=>{
        // only need to check start, end, title
        if (event.id != null) {
          let match = calendarEvents.find( (calendarEvent)=> {
            return (event.id == calendarEvent.id);
          });

          if (typeof match != "undefined") { // found

            let changed = false;

            if (match.title != event.title) { changed = true ;}
            if (!Date.create(match.start).is(event.start)) { changed = true ;}
            if (!Date.create(match.start).is(event.start)) { changed = true ;}


            if (changed) {
              match.remove();
              calendar.addEvent(event)
            }
          } else {
            // doesn't exist, add it
            calendar.addEvent(event);
          }
        }
      });




    } else {
      //console.log("didn't rerender");
    }

  }

	onDestroy(() => {
		calendar.destroy();
	});
	export function getAPI() {
		return calendar;
	}
	$: {
		if (calendar) {
			calendarProps = getCalendarProps($$props);
			updates = {};
			removals = [];
			for (const propName in oldProps) {
				if (!(propName in calendarProps)) {
					removals.push(propName);
				}
			}
			for (const propName in calendarProps) {
				if (!deepEqual(calendarProps[propName], oldProps[propName])) {
					updates[propName] = calendarProps[propName];
				}
			}
			calendar.mutateOptions(updates, removals, false, deepEqual);
			oldProps = { ...calendarProps };
		}
	}
  $: { rerender(calendarProps.events) }
</script>

<div id="calendar-{instanceId}" bind:this={calendarEl} class={classes} {style} />
