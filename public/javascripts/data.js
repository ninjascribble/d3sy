var XYZ = XYZ || {};

(function() {

  var products = ['XBox 360', 'Microsoft Surface', 'Contoso Knives', "Contoso Women's Jeans", '2% Milk', 'Cookies', 'Contoso Microwave Oven', 'Contoso Chicken Strips', 'Cheese', 'Contoso Gloves', 'Contoso Hair Dryer'],
      categories = ['food', 'appliances', 'apparel', 'electronics'],
      categoryProducts = {'food': '2% Milk', 'appliances': 'Contoso Knives', 'electronics': 'Microsoft Surface', 'apparel': "Contoso Women's Jeans"},
      slices = ['foot traffic', 'sales', 'returns']
      baseFacebookRate = 100,
      baseFootTrafficRate = 500,
      baseTwitterRate = 50,
      baseFoursquareRate = 20,
      baseRevenueRate = 20000,
      baseInStorePickupRate = 5,
      basePromotionRate = 5000,
      baseSalesRate = 20000,
      baseProductSalesRate = 100,
      baseReturnsRate = 2;

    var currentDate = new Date('12/31/2011 23:00').getTime()
      , model = { hourly: [], daily: [], weekly: [], monthly: [] };

    function step() {

        currentDate += (1000 * 60 * 60);

        var curhour    = model.hourly[ model.hourly.length - 1 ]
          , curday     = model.daily[ model.daily.length - 1 ]
          , curweek    = model.weekly[ model.weekly.length - 1 ]
          , curmonth   = model.monthly[ model.monthly.length - 1 ]
          , date       = new Date(currentDate)
          , value      = Math.random() * 150 + 50 << 0;

        // Update hours
        model.hourly.push(createEntry(date, value));
        if (model.hourly.length > 24) {
            model.hourly.shift();
        }

        // Update days
        if (curday && date.getDate() == curday.date.getDate()) {
            curday = addValue(curday, value);
        }
        else {
            model.daily.push(createEntry(date, value));
        }
        if (model.daily.length > 7) {
            model.daily.shift();
        }

        // Update weeks
        if (curweek && curweek.ct < 7 * 24) {
            curweek = addValue(curweek, value);
        }
        else {
            model.weekly.push(createEntry(date, value));
        }
        if (model.weekly.length > 12) {
            model.weekly.shift();
        }

        // Update months
        if (curmonth && date.getMonth() == curday.date.getMonth()) {
            curmonth = addValue(curmonth, value);
        }
        else {
            model.monthly.push(createEntry(date, value));
        }
        if (model.monthly.length > 12) {
            model.monthly.shift();
        }
    }

    function createEntry(date, value) {
        return { date: date, value: value, ct: 0 };
    }

    function addValue(entry, value) {
        entry.value += value;
        entry.ct++;
        return entry;
    }

  XYZ.model = model;
  XYZ.step = step;

})();
