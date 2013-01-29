var XYZ = XYZ || {};

(function() {
  var regions = ['west'],
      storesPerRegion = [1, 1],
      scoreRange = [1, 5],
      products = ['XBox 360', 'Microsoft Surface', 'Contoso Knives', "Contoso Women's Jeans", '2% Milk', 'Cookies', 'Contoso Microwave Oven', 'Contoso Chicken Strips', 'Cheese', 'Contoso Gloves', 'Contoso Hair Dryer'],
      categories = ['food', 'appliances', 'apparel', 'electronics'],
      categoryProducts = {'food': '2% Milk', 'appliances': 'Contoso Knives', 'electronics': 'Microsoft Surface', 'apparel': "Contoso Women's Jeans"},
      baseFacebookRate = 100,
      baseFootTrafficRate = 500,
      baseTwitterRate = 50,
      baseFoursquareRate = 20,
      baseRevenueRate = 20000,
      baseInStorePickupRate = 5,
      basePromotionRate = 5000,
      baseSalesRate = 20000,
      baseProductSalesRate = 100,
      baseReturnsRate = 2,
      promotionRange = [4, 8],
      lowInventoryRange = [3, 11],
      storeHours = [0, 23],
      returnCount = 8,
      data = [],
      cities = ['Bellevue', 'Redmond', 'Kirkland', 'Seattle', 'Portland', 'New York', 'New Orleans', 'Chicago', 'San Francisco', 'Los Angeles']
      comments = [
        {
          'content': 'volutpat enim accumsan sit lobortis',
          'context': 'Facebook',
          'impact': {
            'comments': Math.round(Math.random() * 100),
            'likes': Math.round(Math.random() * 100)
          }
        },
        {
          'content': 'volutpat enim accumsan sit lobortis',
          'context': 'Facebook',
          'impact': {
            'comments': Math.round(Math.random() * 100),
            'likes': Math.round(Math.random() * 100)
          }
        },
        {
          'content': 'volutpat enim accumsan sit lobortis',
          'context': 'Facebook',
          'impact': {
            'comments': Math.round(Math.random() * 100),
            'likes': Math.round(Math.random() * 100)
          }
        },
        {
          'content': 'volutpat enim accumsan sit lobortis',
          'context': 'Twitter',
          'impact': {
            'retweets': Math.round(Math.random() * 100),
            'replies': Math.round(Math.random() * 100)
          }
        },
        {
          'content': 'volutpat enim accumsan sit lobortis',
          'context': 'Twitter',
          'impact': {
            'retweets': Math.round(Math.random() * 100),
            'replies': Math.round(Math.random() * 100)
          }
        }
      ]

  function generateData(hourlyBase) {
    var current = hourlyBase * (1 + ((Math.random() - 0.5) / 5)),
        date = new Date(),
        day = generateTimescale(storeHours[0], storeHours[1], current),
        week = generateTimescale(date.getDay() - 7, date.getDay() - 1, sumTimescale(day)),
        month = generateTimescale(Math.floor(date.getDate() / 7) - 4, Math.floor(date.getDate() / 7) - 1, sumTimescale(week)),
        year = generateTimescale(date.getMonth() - 12, date.getMonth() - 1, sumTimescale(month));
    return {'current': current, 'past': {'day': day, 'week': week, 'month': month, 'year': year}};
  }

    // Fill data from start to end with 20% variance at each step.
    function generateTimescale(start, end, baseValue) {
      var data = [{'time': start, 'value': baseValue * (1 + ((Math.random() - 0.5) / 5))}],
          range = end - start;
      for (var i = 1; i <= range; i++) {
        data.push({'time': i + start, 'value': data[i - 1].value * (1 + ((Math.random() - 0.5) / 5))});
      }
      return data;
    }

  function sumTimescale(data) {
    var total = 0;
    for (var i = 0; i < data.length; i++) total += data[i].value;
    return total;
  }

  function shuffle(a) {
      for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
      return a;
  }
  
  function makeData() {

    data = [];

    for (var r = 0; r < regions.length; r++) {
      var region = regions[r],
          storeCount = Math.round(Math.random() * (storesPerRegion[1] - storesPerRegion[0]) + storesPerRegion[0]),
          regionCities = shuffle(cities.slice(0));
      for (var s = 0; s < storeCount; s++) {
        var city = regionCities.pop();
        var storeInfo = {
          'name': city,
          'photo': 'images/store_' + s + '.png',
          'address': {'street': '42 Street Dr.', 'city': city, 'state': 'WA'},
          'phone': '206-555-1000',
          'contact': {'name': 'Boss Manager', 'phone': '206-555-4242', 'email': 'manager@contoso.com'},
          'description': 'Esse ipsum aliquip facilisi eum ipsum, volutpat enim accumsan sit lobortis, volutpat esse vel augue. Volutpat, commodo ea aliquip elit praesent, wisi zzril eu eros ut.'
        }

        data.push({
          'id': region + '_' + s,
          'region': region,
          'storeInfo': storeInfo,
          'sentiment': Math.random() * (scoreRange[1] - scoreRange[0]) + scoreRange[1],
          'socialReach': {
            'facebook': generateData(baseFacebookRate),
            'twitter': generateData(baseTwitterRate),
            'foursquare': generateData(baseFoursquareRate),
            'featured': shuffle(comments).slice(Math.round(Math.random() * 2))
          },
          'footTraffic': generateData(baseFootTrafficRate),
          'revenue': {
            'actual': generateData(baseRevenueRate),
            'forecasted': generateData(baseRevenueRate),
          },
          'topProducts': (function() {
            var topProducts = {};
            for (var i = 0; i < categories.length; i++) {
              topProducts[categories[i]] = {'product': categoryProducts[categories[i]], 'data': generateData(baseProductSalesRate)}
            }
            return topProducts;
          })(),
          'inStorePickup': (function() {
            var pickups = {};
            for (var i = 0; i < categories.length; i++) {
              pickups[categories[i]] = generateData(baseInStorePickupRate);
            }
            return pickups;
          })(),
          'promotions': {
            'promotions': generateData(basePromotionRate),
            'sales': generateData(baseSalesRate),
            'products': (function(){
              var promotionProducts = shuffle(products).slice(0, Math.round(Math.random() * (promotionRange[1] - promotionRange[0])) + promotionRange[0]),
                  promotions = [];
              for (var i = 0; i < promotionProducts.length; i++) {
                var available = Math.round(Math.random() * 1000),
                    redeemed = Math.round(Math.random() * available);
                promotions.push({
                  'promotion': promotionProducts[i] + ' SALE',
                  'available': available,
                  'redeemed': redeemed,
                  'budget': available * 100,
                  'sales': available * 100
                });
              }
              return promotions;
            })()
          },
          'lowInventory': (function(){
            var lowProducts = shuffle(products).slice(0, Math.round(Math.random() * (lowInventoryRange[1] - lowInventoryRange[0])) + lowInventoryRange[0]),
                inventory = [];
            for (var i = 0; i < lowProducts.length; i++) {
              var remaining = Math.round() * 50;
              inventory.push({
                'product': lowProducts[i],
                'qty': remaining,
                'timeLeftEstimate': remaining * 20 * 60 //Time in seconds
              });
            }
            return inventory;
          })(),
          'returns': (function(){
            var returnedProducts = shuffle(products).slice(0, 8),
                returns = [];
            for (var i = 0; i < returnedProducts.length; i++) {
              returns.push({
                'product': returnedProducts[i],
                'returns': generateData(baseReturnsRate)
              })
            }
            return returns;
          })()
        });
      }
    }
    return data;
  }

  XYZ.data = makeData();
  XYZ.makeData = makeData;
  XYZ.generateData = generateData;
  XYZ.generateTimescale = generateTimescale;
})();
