/*
 * Calculate relative times
 */
var timeAgo = (function() {

    var
        timeout,
        interval = 1000,
        els = [],
        init, count, add, parseTime, calculateTimeDifferenceInSeconds, calculateTimeDifference, now;

    init = function(){
        if (!!timeout) return;
        count();
    };

    add = function($el) {
        $el.data('time', parseTime($el.data('datetime')));
        els.push($el);
    };

    count = function() {
        var counter, len, $el, time, difference;

        for (counter = 0, len = els.length; counter < len; counter++) {
            $el = els[counter];
            time = $el.data('time');
            difference = calculateTimeDifference(time);
            $el.text(difference);
        }

        timeout = setTimeout(count, interval);
    };

    parseTime = function(time) {
        time = $.trim(time);
        time = time.replace(/\.\d\d\d+/, "");
        time = time.replace(/-/, "/").replace(/-/, "/");
        time = time.replace(/T/, " ").replace(/Z/, " UTC");
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2");
        return new Date(time);
    };

    calculateTimeDifferenceInSeconds = function(time) {
      var timeDifference;
      timeDifference = new Date().getTime() - time.getTime();
      return Math.round((Math.abs(timeDifference) / 1000));
    };

    calculateTimeDifference = function(time) {
      var sec, min;
      sec = calculateTimeDifferenceInSeconds(time);
      min = Math.round(sec / 60);

      if (sec < 60) {
        return sec + "s";
      } else if (min <= 60) {
        return min + "m";
      } else if (min <= 1439) {
        return (Math.round(min / 60)) + "h";
      } else if (min <= 43199) {
        return (Math.round(min / 1440)) + "d";
      } else if (min <= 525599) {
        return (Math.round(min / 43200)) + "months";
      } else {
        return (Math.round(min / 525600)) + " years";
      }
    };

    now = function() {
      if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function() {
            function pad(n) { return n < 10 ? '0' + n : n; }
            return this.getUTCFullYear() + '-' +
                pad(this.getUTCMonth() + 1) + '-' +
                pad(this.getUTCDate()) + 'T' +
                pad(this.getUTCHours()) + ':' +
                pad(this.getUTCMinutes()) + ':' +
                pad(this.getUTCSeconds()) + 'Z';
        };
      }
      return new Date().toISOString();
    };

    return {
        init : init,
        add  : add,
        now  : now
    };
})();
