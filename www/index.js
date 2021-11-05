/* global $ */
var presets = [{
    name: '',
    url: ''
}, {
    name: '----- Global ------'
}, {
    name: 'Africa',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/BlankMap-Africa.svg'
}, {
    name: 'Europe',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/BlankMap-Europe.svg'
}, {
    name: 'World',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg'
}, {
    name: '----- Countries ------'
}, {
    name: 'Australia',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Australia_states_blank.svg'
}, {
    name: 'Belgium',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Belgium_Provinces_map-blank.svg'
}, {
    name: 'Brazil',
    url: 'https://www.clker.com/cliparts/O/m/Y/9/h/X/mapa-brasil-rio-de-janeiro.svg'
}, {
    name: 'Canada',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Canada_blank_map.svg'
}, {
    name: 'Germany',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Karte_Bundesrepublik_Deutschland.svg'
}, {
    name: 'France',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Carte_vierge_d%C3%A9partements_fran%C3%A7ais_avec_DOM.svg'
}, {
    name: 'Netherlands',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Carte_des_Pays-Bas_%28netherlands%29_without_names.svg'
}, {
    name: 'Norway',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Norwegian_parliamentary_election_2009_map_KrF_reps.svg'
}, {
    name: 'Poland',
    url: 'https://www.highcharts.com/maps/maps/Poland.svg'
}, {
    name: 'South-America',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Southamerica_blank.svg'
}, {
    name: 'Spain',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Provinces_of_Spain.svg'
}, {
    name: 'Sweden',
    url: 'https://www.highcharts.com/maps/maps/Sweden.svg'
}, {
    name: 'USA-states',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Blank_US_Map.svg'
}, {
    name: 'USA-counties',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/USA_Counties_with_FIPS_and_names.svg'
}, {
    name: '----- Regions ------'
}, {
    name: 'Sogn-og-Fjordane-Norway',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/NO_1417_Vik.svg'
}];


let $preset;

var chart,
    file,
    $current;

function runPreset(index) {
    var preset = presets[index];

    $preset[0].selectedIndex = index;

    if (preset && preset.url) {
        $('#load')[0].value = preset.url;
        location.hash = '#' + preset.url;
        runChart();
    }
}

function runChart() {
    drawMap('Highcharts map from SVG', $('#load')[0].value);
}



// Some maps, like USA and France, have separator lines in between paths. We want to
// identify those and assign to a separate series
function identifyLines(data, key) {
    var lines = [],
        i,
        point;

    for (i = 0; i < data.length; i++) {
        point = data[i];
        if (!point.hasFill) {
            lines.push(data.splice(i, 1)[0]);
            i -= 1;
        }
    }
    return lines;
}

function drawMap(key, file) {
    location.hash = '#' + file;
    var start = +new Date();
    if (chart) {
        chart = chart.destroy();
    }
    $('#container').html('');
    file = file || maps[key];
    Highcharts.data({
        svg: file,
        complete: function (options) {

            console.log('Loading and parsing map:', new Date() - start, 'ms');
            start = +new Date();

            var data = options.series[0].data,
                lines = identifyLines(data, key);

            // For the sake of the demo, add some random values
            $.each(data, function (i, point) {
                data[i] = {
                    y: Math.round(Math.random() * 100),
                    path: point.path,
                    name: point.name,
                    hasFill: point.hasFill
                };
            });

            // Merge the options from the Data module with our own settings
            options = Highcharts.merge(options, {
                chart : {
                    renderTo : 'container',
                    borderWidth : 1,
                    events: {
                        load: function () {
                            console.log('Generating chart:', new Date() - start, 'ms');
                        }
                    }
                },

                title: {
                    text: key
                },

                legend: {
                    enabled: false
                },

                mapNavigation: {
                    enabled: true
                },

                plotOptions: {
                    map: {
                        name: 'Random',
                        colorRange: {
                            from: '#cedae8',
                            to: '#1a416d'
                        },
                        dataLabels: {
                            //enabled: true,
                            format: '{point.name}',
                            backgroundColor: 'rgba(255,255,255,0.4)'
                        },
                        tooltip: {
                            valueSuffix: '%'
                        },
                        states: {
                            hover: {
                                color: '#bada55'
                            }
                        }
                    }
                }
            });

            // Add separator lines
            if (lines && lines.length) {
                options.series.push({
                    type: 'mapline',
                    enableMouseTracking: false,
                    showInLegend: false,
                    data: lines
                });
            }



            // View data
            var output = [];
            $.each(options.series, function (i, series) {
                var data = [];
                var mapData = [];

                output[i] = {};

                $.each(series.data, function (j, point) {
                    if (!output[i].type) {
                        if (point.hasFill) {
                            output[i].type = 'map';
                        } else {
                            output[i].type = 'mapline';
                        }
                    }
                    output[i].joinBy = 'id';

                    mapData[j] = {
                        id: 'id' + j,
                        name: point.name,
                        path: point.path
                    };
                    data[j] = {
                        id: 'id' + j,
                        y: j
                    }
                });
                output[i].mapData = Highcharts.Data.prototype.pathToString(mapData)
                output[i].data = data;
            });

            output = JSON.stringify(output, null, '  ');
            $('#view-data')
                .html('View Highcharts Maps config (' + Highcharts.numberFormat(
                    output.length / 1024, 1, '.') + ' kB)')
                .click(function () {
                    if (chart) {
                        chart = chart.destroy();
                    }
                    $('#container').html(
                        '<pre>' + output + '</pre>'
                    );
                });



            // Create the map
            chart = new Highcharts.Map(options);
        }
    });



    // Mark the current map
    if ($current) {
        $current.removeClass('current');
    }
    if (key) {
        $current = $('#' + key + '_');
        $current.addClass('current');
    }

    // View SVG
    $('#view-svg')[0].href = file;


}

window.addEventListener('DOMContentLoaded', () => {
    $preset = $('#preset')
        .change(function () {
            runPreset($preset[0].selectedIndex);
        });

    // Build the links
    for (var i = 0; i < presets.length; i++) {
        $('<option>' + presets[i].name + '</option>')
            .appendTo($preset);

    }


    if (location.hash) {
        for (var i = 0; i < presets.length; i++) {
            if (location.hash === '#' + presets[i].url) {
                runPreset(i);
            }
        }
        if (i === presets.length) {
            $('#load')[0].value = location.hash.replace(/^#/, '');
            runChart('Online file');
        }
    }

    $('#load-submit').click(runChart);
});
