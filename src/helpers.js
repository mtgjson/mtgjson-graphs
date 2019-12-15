import { Chart } from 'chart.js';
// Configuration for Chart.js
import chartConfig from './data/chart-config';

// https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
export const stringsToColors = (strs = [], seed = 5) => {
  return strs.map(str => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << seed) - hash);
      hash = hash & hash;
    }
    let rgb = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 255;
      rgb[i] = value;
    }
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  });
};

// Generate a Chart.js graph
export const generatePieChart = (graphData, seed) => {
  const ctx = document.getElementById('graph-container');
  const config = chartConfig();
  const data = {};

  // Alphabetize the data keys for consistent labeling
  Object.keys(graphData).sort().forEach((key) => {
    data[key] = graphData[key];
  });

  // Massage our data a bit for Chart.js
  for (let object in data) {
    const { type, value } = data[object];

    config.data.labels.push(type);
    config.data.datasets[0].data.push(value);
  }

  // Assign unique colors to each piece of the pie chart
  config.data.datasets[0].backgroundColor = stringsToColors(config.data.labels, seed);
  // Assign a label to render for the data
  config.options.title.text = `${config.data.labels.length} Card Types`;

  return new Chart(ctx, config);
};
