function buildCharts(country, data) {
    // Check if data is an array or an object
    if (Array.isArray(data)) {
        // Filter data for the selected country
        let selectedCountryData = data.filter(entry => entry.country === country);
        // Extract years and happiness scores
        let years = selectedCountryData.map(entry => entry.year);
        let happinessScores = selectedCountryData.map(entry => entry.happiness_score);
        // Create a bar chart
        let trace = {
            x: years,
            y: happinessScores,
            type: 'bar',
            marker: {
                color: 'skyblue'
            }
        };
        let layout = {
            title: `Happiness Scores Over 9 Years - ${country}`,
            xaxis: {
                title: 'Year'
            },
            yaxis: {
                title: 'Happiness Score'
            }
        };
        Plotly.newPlot('bar', [trace], layout);
    } else if (typeof data === 'object' && data.hasOwnProperty(country)) {
        // If data is an object with properties like data.switzerland
        let selectedCountryData = data[country];
        let years = Object.keys(selectedCountryData);
        let happinessScores = Object.values(selectedCountryData);
        console.log(happinessScores)
        Plotly.newPlot('bar', [trace], layout);
    }
    if (Array.isArray(data)) {
        // Filter data for the selected country
        let selectedCountryData = data.filter(entry => entry.country === country);
        // Extract years and social support
        let years = selectedCountryData.map(entry => entry.year);
        let socialSupport = selectedCountryData.map(entry => entry.social_support);
        // Create a line chart
        let trace = {
            x: years,
            y: socialSupport,
            type: 'line',
            mode: 'lines+markers',
            // text: socialSupport,
            line: {
                color: 'green'
            },
            marker: {
                color: 'darkgreen'
            }
        };
        let layout = {
            title: `Social Support Over 9 Years - ${country}`,
            xaxis: {
                title: 'Year'
            },
            yaxis: {
                title: 'Social Support'
            }
        };
        Plotly.newPlot('line', [trace], layout);
    } else if (typeof data === 'object' && data.hasOwnProperty(country)) {
        // If data is an object with properties like data.switzerland
        let selectedCountryData = data[country];
        let years = Object.keys(selectedCountryData);
        let socialSupport = Object.values(selectedCountryData);
    }
}
function buildLineChart(country, data) {
    // Filter data for the selected country
    let selectedCountryData = data.filter(entry => entry.country === country);
    // Get the canvas element
    let ctxLineChart = document.getElementById('lineChart');
    // Check if there is an existing chart instance
    let existingChart = Chart.getChart(ctxLineChart);
    // Destroy the existing chart if it exists
    if (existingChart) {
        existingChart.destroy();
    }
    // Create a new line chart for GDP and Happiness Score
    let lineChart = new Chart(ctxLineChart, {
        type: 'line',
        data: {
            labels: selectedCountryData.map(entry => entry.year),
            datasets: [
                {
                    label: 'GDP Per Capita',
                    data: selectedCountryData.map(entry => entry.gdp_per_capita),
                    fill: false,
                    borderColor: 'green',
                    borderWidth: 1,
                    yAxisID: 'y',
                },
                {
                    label: 'Happiness Score',
                    data: selectedCountryData.map(entry => entry.happiness_score),
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'GDP Per Capita and Happiness Score'
                    },
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Happiness Score'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Line Chart - GDP vs. Happiness Score - ${country}`,
                    font : {
                        size: 16
                    }
                }
            }
        }
    });
}
function buildRadarChart(country, data) {
    // Filter data for the selected country
    let selectedCountryData = data.filter(entry => entry.country === country);
    // Get the canvas element
    let ctxRadar = document.getElementById('radarChart').getContext('2d');
    // Check if there is an existing chart instance
    let existingChart = Chart.getChart(ctxRadar);
    // Destroy the existing chart if it exists
    if (existingChart) {
        existingChart.destroy();
    }
    // Extract the latest year's metrics
    let latestYearData = selectedCountryData.reduce((acc, entry) => {
        return entry.year > acc.year ? entry : acc;
    }, { year: 0, gdp_per_capita: 0, happiness_score: 0, social_support: 0 });
    console.log('Latest Year Data:', latestYearData);
    // Create the radar chart
    let radarChart = new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['GDP Per Capita', 'Happiness Score', 'Social Support'],
            datasets: [{
                label: `${country} - ${latestYearData.year}`,
                data: [latestYearData.gdp_per_capita, latestYearData.happiness_score, latestYearData.social_support],
                backgroundColor: 'purple',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                r: {
                    max: 10,
                    pointLabels: {
                        fontSize: 14
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `Correlation : GDP, Happiness Score & Social Support - ${country}`,
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}
const URL = "http://127.0.0.1:5000/api/whr";
function buildPanel(country, data) {
    // Find the entry in the dataset that matches the selected country
    let selectedCountryData = data.filter(entry => entry.country === country);
    let result = selectedCountryData[0];
    // Assuming your panel container has an ID 'countryPanel'
    let PANEL = d3.select("#countryPanel");
    PANEL.html("");
    // Display only keys, skipping the first two keys
    let keysToSkip = ['_id', 'country'];
    let displayedKeys = Object.keys(result).filter(key => !keysToSkip.includes(key));
    displayedKeys.forEach(key => {
        let formattedKey = key.replace(/_/g, ' '); // Replace underscores with an empty string
        PANEL.append("h6")
            .style("text-align", "left")
            .style("font-size", "10px")
            .html(`<span style="font-weight: bold;">${formattedKey.toUpperCase()}</span>`);
    });
}
function init() {
    let selector = d3.select("#selDataset");
    d3.json(URL).then(function (data) {
        console.log(data);
        // Extract unique country names using a Set
        let uniqueCountryNames = new Set(data.map(country => country.country));
        let countryNames = Array.from(uniqueCountryNames).sort();
        console.log(countryNames);
        for (let i = 0; i < countryNames.length; i++) {
            let name = countryNames[i];
            selector.append("option").text(name).attr("value", name);
        }
        let firstCountry = countryNames[0];
        buildCharts(firstCountry, data);
        buildLineChart(firstCountry, data);
        buildRadarChart(firstCountry, data);
        buildPanel(firstCountry, data);
    });
}
function optionChanged(newCountry) {
    d3.json(URL).then(function (data) {
        buildCharts(newCountry, data);
        buildLineChart(newCountry, data);
        buildRadarChart(newCountry, data);
        buildPanel(newCountry, data);
    });
}
init();