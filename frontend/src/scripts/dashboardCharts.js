// dashboardCharts.js
// -----------------
// Description: This file contains functions to create the charts for the dashboard.

import Chart from "chart.js/auto";

export function createPieChartComplexity(
  resultStore,
  compareRunStore,
  isOpenComplexity,
  canvasBike,
  canvasCar,
  canvasCompareBike,
  canvasCompareCar
) {
  let purpleShades = [
    "#da5268", // Original color
    "#DB6668",
    "#da5868",
    "#D3667C",
    "#da5e68",
    "#B74F7C",
    "#da6468",
    "#B7709D",
    "#da6a68",
    "#B77076",
    "#da7668",
    "#da8868",
    "#da8268",
    "#da7c68",
  ];
  let blueShades = [
    "#0d00a3", // Original color
    "#0d4ea3",
    "#0d06a3",
    "#0d48a3",
    "#0d2aa3",
    "#0d0ca3",
    "#0d42a3",
    "#0d12a3",
    "#0d3ca3",
    "#0d18a3",
    "#0d1ea3",
    "#0d24a3",
    "#0d36a3",
    "#0d30a3",
  ];
  let lightGreenShades = [
    "#a7d479", // Original color
    "#d4d4a2",
    "#aed479",
    "#d4d49b",
    "#b5d479",
    "#d4d494",
    "#bcd479",
    "#d4d48d",
    "#c3d479",
    "#d4d486",
    "#cad479",
    "#d1d479",
    "#d4d47f",
    "#d8d479",
  ];
  let darkGreenShades = [
    "#3d7748", // Original color
    "#004824",
    "#367248",
    "#00482d",
    "#2f6d48",
    "#004836",
    "#286848",
    "#00483f",
    "#216348",
    "#004a48",
    "#1a5e48",
    "#054f48",
    "#135948",
    "#0c5448",
  ];

  if (isOpenComplexity) {
    let { dataset, labels } = filter10NodeDegree(resultStore.complexity.bike);
    // Bike pie chart
    createSinglePieChart(
      labels,
      dataset,
      canvasBike,
      "Bike Network",
      purpleShades
    );

    let { dataset: carDataset, labels: carLabels } = filter10NodeDegree(
      resultStore.complexity.car
    );
    // Car pie chart
    createSinglePieChart(
      carLabels,
      carDataset,
      canvasCar,
      "Car Network",
      blueShades
    );

    if (compareRunStore.compare) {
      let { dataset: compareBikeDataset, labels: compareBikeLabels } =
        filter10NodeDegree(compareRunStore.complexity.bike);
      // Bike pie chart
      createSinglePieChart(
        compareBikeLabels,
        compareBikeDataset,
        canvasCompareBike,
        "Bike Network",
        lightGreenShades
      );

      let { dataset: compareCarDataset, labels: compareCarLabels } =
        filter10NodeDegree(compareRunStore.complexity.car);
      // Car pie chart
      createSinglePieChart(
        compareCarLabels,
        compareCarDataset,
        canvasCompareCar,
        "Car Network",
        darkGreenShades
      );
    }
  }
}

function filter10NodeDegree(data) {
  // filters out all to complex intersection percentages that have a higer node degree than 10
  let keys = Object.keys(data);
  let values = Object.values(data);

  let filteredKeys = keys.filter((key) => parseInt(key) <= 10);
  let filteredValues = values.filter(
    (value, index) => parseInt(keys[index]) <= 10
  );

  let dataset = filteredValues.map((value) => (value * 100).toFixed(1));
  let labels = filteredKeys.map((value) => value + " degree intersections");

  return { dataset, labels };
}

function createSinglePieChart(
  labels,
  dataset,
  canvas,
  chartTitle,
  colorShades
) {
  let ctx = canvas.getContext("2d");
  // Set the width of the canvas

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: dataset,
          backgroundColor: colorShades,
          label: "[%] ",
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: chartTitle, // Set your title here
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            fontSize: 5, // Set the font size to your desired value
          },
        },
      },
    },
  });
}

export function createScatterPlot(datasets, canvas) {
  let ctx = canvas.getContext("2d");

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Change in bike travel time [%]",
          },
        },
        y: {
          type: "linear",
          title: {
            display: true,
            text: "Change in car travel time [%]",
          },
        },
      },
    },
  });
}

export function createBarChart(labels, dataValues, colors, canvas) {
  let ctx = canvas.getContext("2d");

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Change in percentage of travel time",
          data: dataValues.map((value) => parseFloat(value.toFixed(1))), // round to 1 decimal
          backgroundColor: colors,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          display: true,
          title: {
            display: true,
            text: "Changes in travel time [%]",
            font: {
              size: 12,
            },
          },
        },
      },
      indexAxis: "y",
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
        },
        legend: {
          display: false,
        },
      },
    },
  });
}

export function createDoughnutChart(
  labels,
  dataset,
  colors,
  canvas,
  chartTitle
) {
  let ctx = canvas.getContext("2d");

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "[km]",
          backgroundColor: colors,
          data: dataset.map((value) => parseFloat(value.toFixed(1))), // round to 1 decimal
        },
      ],
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: "50%",
      plugins: {
        title: {
          display: true,
          text: `${chartTitle}`,
          font: {
            size: 14,
          },
        },
        datalabels: {
          display: true,
          align: "center",
          backgroundColor: "#ccc",
          borderRadius: 3,
          font: {
            size: 14,
          },
        },
      },
    },
  });
}

export function createSingleMetricBarChart(metricLabel, runNames, dataValues, colors, canvas) {
  const ctx = canvas.getContext("2d");

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: runNames, // run names are shown on y-axis
      datasets: [
        {
          label: '',
          data: dataValues.map((value) => parseFloat(value.toFixed(2))), // round to 2 decimals
          backgroundColor: colors,
        },
      ],
    },
    options: {
      indexAxis: "y", // horizontal bars
      responsive: true,
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.raw}`, // Only number
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: "#666",
            font: { size: 12 },
          },
          grid: {
            color: "#eee",
          },
          title: {
            display: true,
            text: metricLabel, // bottom title is the metric name
            font: { size: 14, weight: 'bold' },
            color: "#666",
          },
        },
        y: {
          ticks: {
            color: "#666",
            font: { size: 12 },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

export function createContinousEvalMetricBarChart(metricLabel, runNames, dataValues, canvas, legend = [], metricKey = '') {


  const ctx = canvas.getContext("2d");

  const maxValuesByMetric = {
    bsl: 5,
    bci: 10,
    anp: 0.01,
    weikl: 5,
    porter: 1,
  };
  
  const suggestedMax = maxValuesByMetric[metricKey] || undefined;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: runNames, // run names are shown on y-axis
      datasets: [
        {
          label: '',
          data: dataValues.map(value => 
            parseFloat(value.toFixed(metricKey === 'anp' ? 5 : 2))
          ),
          
          backgroundColor: dataValues.map(value => getColorForValue(value, legend)),

        },
      ],
    },
    options: {
      indexAxis: "y", // horizontal bars
      responsive: true,
      plugins: {
        datalabels: {
          anchor: "center",
          align: "center",
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.raw}`, // Only number
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: suggestedMax,
          ticks: {
            color: "#666",
            font: { size: 12 },
          },
          grid: {
            color: "#eee",
          },
          title: {
            display: true,
            text: metricLabel,
            font: { size: 14, weight: 'bold' },
            color: "#666",
          },
        },
        y: {
          title: {
            display: true,
            text: 'Runs', 
            font: {
              weight: 'bold',
              size: 14
            }
          },
          ticks: {
            color: "#666",
            font: { size: 12 },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

function getColorForValue(value, legend) {
  for (const { label, color } of legend) {
    // Handle range-based labels like "≤ 3", "≥ 4", "0.5 – 0.75"
    if (label.includes('≤')) {
      const max = parseFloat(label.replace('≤', '').trim());
      if (value <= max) return color;
    } else if (label.includes('≥')) {
      const min = parseFloat(label.replace('≥', '').trim());
      if (value >= min) return color;
    } else if (label.includes('–')) {
      const [min, max] = label.split('–').map(n => parseFloat(n.trim()));
      if (value >= min && value <= max) return color;
    } else if (label.includes('<')) {
      const max = parseFloat(label.replace('<', '').trim());
      if (value < max) return color;
    }
  }

  // Default fallback color
  return '#cccccc';
}


