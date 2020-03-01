var HumanEffort;

HumanEffort = (function() {
  class HumanEffort {
    day() {
      return this.hours_per_day * 60;
    }

    week() {
      return this.days_per_week * this.day();
    }

    month() {
      return this.weeks_per_month * this.week();
    }

    year() {
      return this.weeks_per_year * this.week();
    }

    parseMinutes(string) {
      var i, j, mLen, nLen, numbers, options, regex, sum, unit;
      options = {
        minutes: 1,
        hours: 60,
        days: this.day(),
        weeks: this.week(),
        months: this.month(),
        years: this.year()
      };
      // error trap items not passed in by an input field
      if (Object.isNumber(string)) {
        string = `${string}`;
      }
      if (string != null) {
        for (unit in this.units) {
          i = 0;
          mLen = this.units[unit].patterns.length;
          while (i < mLen) {
            regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + this.units[unit].patterns[i] + "s?(?=\\s|\\d|\\b))", "gi");
            string = string.replace(regex, function(str, p1, p2) {
              return " " + (p1 * options[unit]).toString() + " ";
            });
            i++;
          }
        }
        sum = 0;
        // replaces non-word chars (excluding '.') with whitespace
        // trim L/R whitespace, replace known join words with ''
        numbers = string.replace(/(?!\.)\W+/g, " ").replace(/^\s+|\s+$|(?:and|plus|with)\s?/g, "").split(" ");
        j = 0;
        nLen = numbers.length;
        while (j < nLen) {
          if (numbers[j] && isFinite(numbers[j])) {
            sum += parseFloat(numbers[j]);
          } else if (numbers[j] == null) {
            // Unable to parse: a falsey value
            0;
          } else {
            0;
          }
          j++;
        }
        return sum;
      } else {
        return 0;
      }
    }

    parseHours(string, toMinutes) {
      var i, j, mLen, nLen, numbers, options, regex, sum, unit;
      options = {
        minutes: 1 / 60,
        hours: 1,
        days: this.day() / 60,
        weeks: this.week() / 60,
        months: this.month() / 60,
        years: this.year() / 60
      };
      // error trap items not passed in by an input field
      if (Object.isNumber(string)) {
        string = `${string}`;
      }
      if (string != null) {
        for (unit in this.units) {
          i = 0;
          mLen = this.units[unit].patterns.length;
          while (i < mLen) {
            regex = new RegExp("((?:\\d+\\.\\d+)|\\d+)\\s?(" + this.units[unit].patterns[i] + "s?(?=\\s|\\d|\\b))", "gi");
            string = string.replace(regex, function(str, p1, p2) {
              return " " + (p1 * options[unit]).toString() + " ";
            });
            i++;
          }
        }
        sum = 0;
        // replaces non-word chars (excluding '.') with whitespace
        // trim L/R whitespace, replace known join words with ''
        numbers = string.replace(/(?!\.)\W+/g, " ").replace(/^\s+|\s+$|(?:and|plus|with)\s?/g, "").split(" ");
        j = 0;
        nLen = numbers.length;
        while (j < nLen) {
          if (numbers[j] && isFinite(numbers[j])) {
            sum += parseFloat(numbers[j]);
          } else if (numbers[j] == null) {
            // Unable to parse: a falsey value
            0;
          } else {
            0;
          }
          j++;
        }
        if (toMinutes != null) {
          return sum * 60;
        } else {
          return sum;
        }
      } else {
        return 0;
      }
    }

    // ## Humanize

      // Humanize returns effort in person days and hours only.

      // start_at_hours sets the output to use hours instead of days
    humanizeMinutes(minutes, start_at_hours) {
      var days, hours, humanized_effort, show_minutes, unit;
      humanized_effort = "";
      start_at_hours = start_at_hours || false;
      if (minutes != null) {
        minutes = parseInt(minutes);
        if (!isNaN(minutes)) {
          if (!start_at_hours) {
            if (minutes >= this.day()) {
              unit = "d";
              days = Math.floor(minutes / this.day());
              minutes = minutes - (days * this.day());
              humanized_effort = humanized_effort + `${days}${unit} `;
            }
          }
          // hours
          if (minutes >= 60) {
            unit = "h";
            hours = Math.floor(minutes / 60);
            minutes = minutes - (hours * 60);
            humanized_effort = humanized_effort + `${hours}${unit} `;
          }
          // minutes
          if (minutes >= 0) {
            unit = "m";
            show_minutes = true;
            if ((minutes === 0) && ((days > 0) || (hours > 0))) {
              show_minutes = false;
            }
            if (show_minutes) {
              humanized_effort = humanized_effort + `${minutes}${unit}`;
            }
          }
          return humanized_effort;
        } else {
          return "0m";
        }
      } else {
        return "0m";
      }
    }

    humanizeHours(hours) {
      var hoursFromMinutes, hoursText, humanized_effort, minuteText, minutes;
      humanized_effort = "";
      if (hours != null) {
        if (!isNaN(hours)) {
          // days
          minutes = parseInt((hours - Math.floor(hours)) * 60);
          hoursFromMinutes = Math.floor(minutes / 60);
          minutes = minutes - (hoursFromMinutes * 60);
          hours = Math.floor(hours) + hoursFromMinutes;
          //days = hours / @days()

          //unit = "h"
          if (minutes > 0) {
            minuteText = `${minutes}m`;
          } else {
            minuteText = "";
          }
          if (hours > 0) {
            hoursText = `${hours}h`;
          } else {
            if (minutes === 0) {
              hoursText = "0h";
            } else {
              hoursText = "";
            }
          }
          //hours = hours - (hours * 60)
          humanized_effort = `${hoursText}${minuteText} `;
          return humanized_effort;
        } else {
          return "0h";
        }
      } else {
        return "0h";
      }
    }

  };

  HumanEffort.prototype.hours_per_day = 8;

  HumanEffort.prototype.days_per_week = 5;

  HumanEffort.prototype.weeks_per_month = 4;

  HumanEffort.prototype.weeks_per_year = 52;

  HumanEffort.prototype.units = {
    minutes: {
      patterns: ["minute", "min", "m(?!s)"],
      formats: {
        chrono: ":",
        micro: "m",
        short: "min",
        long: "minute"
      }
    },
    hours: {
      patterns: ["hour", "hr", "h", ":"],
      formats: {
        chrono: ":",
        micro: "h",
        short: "hr",
        long: "hour"
      }
    },
    days: {
      patterns: ["day", "dy", "d"],
      formats: {
        chrono: ":",
        micro: "d",
        short: "day",
        long: "day"
      }
    },
    weeks: {
      patterns: ["week", "wk", "w"],
      formats: {
        chrono: ":",
        micro: "w",
        short: "wk",
        long: "week"
      }
    },
    months: {
      patterns: ["month", "mon", "mo", "mth"],
      formats: {
        chrono: ":",
        micro: "mo",
        short: "mth",
        long: "month"
      }
    },
    years: {
      patterns: ["year", "yr", "y"],
      formats: {
        chrono: ":",
        micro: "y",
        short: "yr",
        long: "year"
      }
    }
  };

  return HumanEffort;

}).call(this);

module.exports = new HumanEffort();
