class HumanEffort

  hours_per_day: 8
  days_per_week: 5
  weeks_per_month: 4
  weeks_per_year: 52


  day: ()->
    @hours_per_day * 60
  week: ()->
    @days_per_week * @day()
  month: ()->
    @weeks_per_month * @week()
  year: ()->
    @weeks_per_year * @week()

  units:
    minutes:
      patterns: ["minute", "min", "m(?!s)"]
      formats:
        chrono: ":"
        micro: "m"
        short: "min"
        long: "minute"

    hours:
      patterns: ["hour", "hr", "h",":"]
      formats:
        chrono: ":"
        micro: "h"
        short: "hr"
        long: "hour"

    days:
      patterns: ["day", "dy", "d"]
      formats:
        chrono: ":"
        micro: "d"
        short: "day"
        long: "day"

    weeks:
      patterns: ["week", "wk", "w"]
      formats:
        chrono: ":"
        micro: "w"
        short: "wk"
        long: "week"

    months:
      patterns: ["month", "mon", "mo", "mth"]
      formats:
        chrono: ":"
        micro: "mo"
        short: "mth"
        long: "month"

    years:
      patterns: ["year", "yr", "y"]
      formats:
        chrono: ":"
        micro: "y"
        short: "yr"
        long: "year"




  parseMinutes: (string)->
    options =
      minutes: 1
      hours: 60
      days: @day()
      weeks: @week()
      months: @month()
      years: @year()


    # error trap items not passed in by an input field
    if Object.isNumber(string)
      string = "#{string}"

    if string?
      for unit of @units
        i = 0
        mLen = @units[unit].patterns.length
        while i < mLen
          regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + @units[unit].patterns[i] + "s?(?=\\s|\\d|\\b))", "gi")
          string = string.replace(regex, (str, p1, p2) ->
            " " + (p1 * options[unit]).toString() + " "
          )

          i++
      sum = 0
      # replaces non-word chars (excluding '.') with whitespace
      # trim L/R whitespace, replace known join words with ''
      numbers = string.replace(/(?!\.)\W+/g, " ").replace(/^\s+|\s+$|(?:and|plus|with)\s?/g, "").split(" ")
      j = 0

      nLen = numbers.length

      while j < nLen
        if numbers[j] and isFinite(numbers[j])
          sum += parseFloat(numbers[j])
        else unless numbers[j]?
          # Unable to parse: a falsey value
          0
        else
          0
        j++


      return sum
    else
      return 0

  parseHours: (string, toMinutes)->
    options =
      minutes: (1 / 60)
      hours: 1
      days: @day() / 60
      weeks: @week() / 60
      months: @month() / 60
      years: @year() / 60


    # error trap items not passed in by an input field
    if Object.isNumber(string)
      string = "#{string}"

    if string?
      for unit of @units
        i = 0
        mLen = @units[unit].patterns.length
        while i < mLen
          regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + @units[unit].patterns[i] + "s?(?=\\s|\\d|\\b))", "gi")
          string = string.replace(regex, (str, p1, p2) ->
            " " + (p1 * options[unit]).toString() + " "
          )

          i++
      sum = 0
      # replaces non-word chars (excluding '.') with whitespace
      # trim L/R whitespace, replace known join words with ''
      numbers = string.replace(/(?!\.)\W+/g, " ").replace(/^\s+|\s+$|(?:and|plus|with)\s?/g, "").split(" ")
      j = 0
      nLen = numbers.length

      while j < nLen
        if numbers[j] and isFinite(numbers[j])
          sum += parseFloat(numbers[j])
        else unless numbers[j]?
          # Unable to parse: a falsey value
          0
        else
          0
        j++

      if toMinutes?
        return sum * 60
      else
        return sum
    else
      return 0
  # ## Humanize

  # Humanize returns effort in person days and hours only.

  # start_at_hours sets the output to use hours instead of days

  humanizeMinutes: (minutes, start_at_hours)->
    humanized_effort = ""
    start_at_hours = start_at_hours || false
    if minutes?
      minutes = parseInt(minutes)
      if !isNaN(minutes)
        # days
        if !start_at_hours
          if minutes >= @day()
            unit = "d"
            days = Math.floor(minutes / @day())
            minutes = minutes - (days * @day())
            humanized_effort = humanized_effort + "#{days}#{unit} "
        # hours
        if minutes >= 60
          unit = "h"
          hours = Math.floor(minutes / 60)
          minutes = minutes - (hours * 60)
          humanized_effort = humanized_effort +  "#{hours}#{unit} "
        # minutes
        if minutes >= 0
          unit = "m"
          show_minutes = true

          if (minutes == 0) && ((days > 0) || (hours > 0))
              show_minutes = false


          if show_minutes
            humanized_effort = humanized_effort +  "#{minutes}#{unit}"
        return humanized_effort
      else
        return "0m"
    else
      return "0m"

  humanizeHours: (hours)->
    humanized_effort = ""


    if hours?
      if !isNaN(hours)
        # days





        minutes = parseInt ( (hours - Math.floor(hours)) * 60 )



        hoursFromMinutes = Math.floor( minutes / 60 )

        minutes = minutes - (hoursFromMinutes * 60)

        hours = Math.floor(hours) + hoursFromMinutes

        #days = hours / @days()

        #unit = "h"





        if minutes > 0
          minuteText = "#{minutes}m"
        else
          minuteText = ""

        if hours > 0
          hoursText = "#{hours}h"

        else
          if minutes == 0
            hoursText = "0h"
          else
            hoursText = ""
        #hours = hours - (hours * 60)
        humanized_effort =  "#{hoursText}#{minuteText} "






        return humanized_effort
      else
        return "0h"
    else
      return "0h"

module.exports = new HumanEffort
