;(function() {
var data = {
    client: {

        id: '123456789',
        
        name: {
            first: 'John',
            last:  'Doe',
            mi:    'E'
        },

        contact: {
            home:     '206-555-1212',
            mobile:   '404-666-1212',
            business: '404-777-2323x12',
            email:    'johnedoe@live.com'
        },

        family: [
            { name: { first: 'Kathy', last: 'Doe', mi: null }, relationship: 'spouse' },
            { name: { first: 'Jim',   last: 'Doe', mi: 'E'  }, relationship: 'child' },
            { name: { first: 'Sara',  last: 'Doe', mi: null }, relationship: 'child' }
        ],

        interests: [
            'John and Kathy coach youth sport teams',
            'John is an avid golfer and on the board of Bushwood Country Club'
        ],

        portfolio: [
            { 
                account_type: 'taxable',
                allocations: [
                    { category: 'real estate',  value: 619000 },
                    { category: 'fixed assets', value: 726000 },
                    { category: 'equity',       value: 34147 },
                    { category: 'cash',         value: 706000 }
                ]
            },
            { 
                account_type: 'ira',
                allocations: [
                    { category: 'real estate',  value: 619000 },
                    { category: 'fixed assets', value: 726000 },
                    { category: 'equity',       value: 34147 },
                    { category: 'cash',         value: 706000 }
                ]
            },
            { 
                account_type: '401k',
                allocations: [
                    { category: 'real estate',  value: 619000 },
                    { category: 'fixed assets', value: 726000 },
                    { category: 'equity',       value: 34147 },
                    { category: 'cash',         value: 706000 }
                ]
            }
        ],

        retirement: []
    }
}
}());
