// Getting references from index html file for the metadata

var PanelData = d3.select("#sample-metadata");

// Using function to fetch the metada route to select the sample data
// from app.py

function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then((values) => {
      
    // Use `.html("") to clear any existing metadata
    PanelData.html("");

    // Using `Object.entries` and 'for each' to add 
    //each key and value pair to the PanelData
    //append the fetch data to the h6 element
    
    Object.entries(values).forEach(([key, val]) => {
      PanelData.append("h6").text(`${key}: ${val}`);
      console.log(key,val);
    });

    
  });
}
// Using d3 json to build the bubble and pie charts
// from app.y sample route and use constant variables to build the charts

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((values) => {
    const otu_ids = values.otu_ids;
    const otu_labels = values.otu_labels;
    const sample_values = values.sample_values;
    console.log(otu_ids,otu_labels,sample_values);

    // Bubble Chart
    var bubbleChartLayout = {
      title: 'Belly Button BioDiversity Bubble Chart',
      height: 700,
      width: 1200,
      showlegend: true,
      hoverinfo: "otu_labels",
               
    };
    var bubbleChartData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Rainbow"
        }
      }
    ];


   //Using plotly.plot selecting the bubble elment and passing
   //the bubble chart data and the bubble chart layout for that selected sample
    Plotly.plot("bubble", bubbleChartData, bubbleChartLayout);

    // Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    //Using piechart data and layout to plot the pie chart
    //using sample values, otu_ids, otu_lables
  var pieChartLayout = {
      title: "Belly Button BioDiversity Pie Chart",
      height: 600,
      width: 800
    };
  var pieChartData = [
      {
        // using slice to get the first 10 sample values
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hoverinfo: "otu_labels.slice(0, 10)",
        type: "pie"
      }
    ]; 
   //Using plotly.plot selecting the pie elment and passing
   //the pie chart data and the pie chart layout for that selected sample
    Plotly.plot("pie", pieChartData, pieChartLayout);
  });
}
// This code is given in the starter code 
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
