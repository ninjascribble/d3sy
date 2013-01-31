var XYZ = XYZ || {};

(function() {

    var ONE_HOUR         = 60 * 60 * 1000
      , HOURS_PER_DAY    = 24
      , HOURS_PER_WEEK   = 24 * 7
      , DAYS_PER_WEEK    = 7
      , WEEKS_PER_PERIOD = 12
      , MONTHS_PER_YEAR   = 12;

    var currentDate = new Date('12/31/2011 23:00').getTime()
      , state = {

        'social-reach': {
            data: { hourly: [], daily: [], weekly: [], monthly: [] },
            templates: [
                { label: 'facebook',   value: 100 },
                { label: 'foursquare', value:  20 },
                { label: 'twitter',    value:  50 }
            ]
        },

        'foot-traffic': {
            data: { hourly: [], daily: [], weekly: [], monthly: [] },
            templates: [
                { value: 500 }
            ]
        },

        'revenue': {
            data: { hourly: [], daily: [], weekly: [], monthly: [] },
            templates: [
                { label: 'net',   value: 100000 },
                { label: 'gross', value:  60000 }
            ]
        },

        'top-products': {
            data: { hourly: [], daily: [], weekly: [], monthly: [] },
            templates: [
                { label: 'appliances',  value: 25000 },
                { label: 'clothing',    value: 10000 },
                { label: 'electronics', value: 50000 },
                { label: 'food',        value: 15000 }
            ]
        },

        'pick-ups': {
            data: { hourly: [], daily: [], weekly: [], monthly: [] },
            templates: [
                { value: 30 }
            ]
        },

        'promotions': {
            data: { hourly: [], daily: [], weekly: [], monthly: [] },
            templates: [
                { label: 'sales',       value: 40000 },
                { label: 'promotions',  value: 10000 }
            ]
        },

        'returns': {
            data: { hourly: [], daily: [], weekly: [], monthly: [] },
            templates: [
                { label: 'XBox 360',               value: 20 },
                { label: 'Microsoft Surface',      value: 20 },
                { label: 'Contoso Knives',         value: 30 },
                { label: 'Contoso Women\'s Jeans', value: 80 },
                { label: '2% Milk',                value: 40 },
                { label: 'Cookies',                value: 30 },
                { label: 'Contoso Microwave Oven', value: 50 },
                { label: 'Contoso Chicken Strips', value: 60 },
                { label: 'Cheese',                 value: 90 },
                { label: 'Contoso Gloves',         value: 40 },
                { label: 'Contoso Hair Dryer',     value: 30 }
            ]
        }

    };

    function step() {
        currentDate += ONE_HOUR;
        for (var key in state) {
            updateState(state[key]);
        }
    }

    function random(baseValue) {
        return baseValue * (1 + (Math.random() - .5) / 5) << 0;
    }

    function clone(obj) {
        var result = JSON.parse( JSON.stringify(obj) );
        if (result.date) {
            result.date = new Date(result.date);
        }
        return result;
    }

    function createEntry(date, templates) {

        var result = { date: date, values: [], ct: 0 }
          , i = 0
          , len = templates.length
          , temp;

        for (i; i < len; i++) {
            temp = templates[i];
            temp.value = random(temp.value);
            result.values.push(temp)
        }

        return result;
    }

    function addValue(entry, values) {

        var result = entry
          , i = 0
          , len = values.length
          , temp;

        for (i; i < len; i++) {
            result.values[i].value += values[i].value;
        }

        entry.ct++;

        return result;
    }

    function updateState(state) {

        var model      = state.data
          , curday     = model.daily[ model.daily.length - 1 ]
          , curweek    = model.weekly[ model.weekly.length - 1 ]
          , curmonth   = model.monthly[ model.monthly.length - 1 ]
          , date       = new Date(currentDate)
          , templates  = clone(state.templates)
          , values;

        // Update hours
        model.hourly.push(createEntry(date, templates));
        if (model.hourly.length > HOURS_PER_DAY) {
            model.hourly.shift();
        }

        curhour = model.hourly[ model.hourly.length - 1 ];
        newvalues = curhour.values;

        // Update days
        if (curday && date.getDate() == curday.date.getDate()) {
            curday = addValue(curday, newvalues);
        }
        else {
            model.daily.push( clone(curhour) );
        }
        if (model.daily.length > DAYS_PER_WEEK) {
            model.daily.shift();
        }

        // Update weeks
        if (curweek && curweek.ct < HOURS_PER_WEEK) {
            curweek = addValue(curweek, newvalues);
        }
        else {
            model.weekly.push( clone(curhour) );
        }
        if (model.weekly.length > WEEKS_PER_PERIOD) {
            model.weekly.shift();
        }

        // Update months
        if (curmonth && date.getMonth() == curday.date.getMonth()) {
            curmonth = addValue(curmonth, newvalues);
        }
        else {
            model.monthly.push( clone(curhour) );
        }
        if (model.monthly.length > MONTHS_PER_YEAR) {
            model.monthly.shift();
        }
    }

  XYZ.step = step;
  XYZ.model = {};

  for (var key in state) {
    XYZ.model[key] = state[key].data;
  }

})();
