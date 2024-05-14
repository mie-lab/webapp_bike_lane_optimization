import Chart from "chart.js/auto";

export function createPieChartComplexity(complexity,compareComplexity, isOpenComplexity,compare,canvasBike,canvasCar,canvasCompareBike,canvasCompareCar){
    
        if (isOpenComplexity) {

            
            // Bike pie chart
            createSinglePieChart(Object.keys(complexity.bike),
                Object.values(complexity.bike).map(value => value * 100),
                canvasBike);
            
            // Car pie chart
               createSinglePieChart(Object.keys(complexity.car),
                Object.values(complexity.car).map(value => value * 100),
                canvasCar);


            if (compare) {
                // Bike pie chart
                createSinglePieChart(Object.keys(compareComplexity.bike),
                    Object.values(compareComplexity.bike).map(value => value * 100),
                    canvasCompareBike);
                
                // Car pie chart
                createSinglePieChart(Object.keys(compareComplexity.car),
                    Object.values(compareComplexity.car).map(value => value * 100),
                    canvasCompareCar);
            }
        }

};

function createSinglePieChart(labels,dataset,canvas){
    let ctx = canvas.getContext("2d");

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
                
                },
            ],
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                display: true,
                position: "bottom",
                },
            },
            },
        });


};

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
};

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
                    label: "Data",
                    data: dataValues,
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
};


export function createDoughnutChart(labels, dataset, colors, canvas, chartTitle) {
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
                  label: "Distances in km",
                  backgroundColor: colors,
                  data: dataset,
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
                  size: 18,
                },
              }
            },
          },
    });
}





