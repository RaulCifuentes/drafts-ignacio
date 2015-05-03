/**
 * Created by rcifuentes on 5/2/2015.
 */
var chart = c3.generate({
    bindto: '#c3-donut-chart',
    data: {
        columns: [
            ['SING', 38],
            ['SIC', 29],
            ['SEA', 27],
            ['SEM', 6],

        ],
        type: 'donut'
    },
    donut: {
        title: "1768 MWts",
        width: 10
    }
});
