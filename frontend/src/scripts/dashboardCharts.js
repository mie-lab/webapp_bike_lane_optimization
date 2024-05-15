import Chart from "chart.js/auto";

export function createPieChartComplexity(resultStore,compareRunStore,isOpenComplexity,canvasBike,canvasCar,canvasCompareBike,canvasCompareCar){
  let purpleShades = [
    '#da5268', // Original color
    '#daa068',
    '#da5868', 
    '#da9a68', 
    '#da5e68', 
    '#da9468', 
    '#da6468',
    '#da8e68', 
    '#da6a68', 
    '#da7068', 
    '#da7668',
    '#da8868', 
    '#da8268', 
    '#da7c68',
     
    
    
     
  ];
  let blueShades = [
    '#0d00a3', // Original color
    '#0d4ea3', 
    '#0d06a3',
    '#0d48a3', 
    '#0d2aa3',
    '#0d0ca3', 
    '#0d42a3', 
    '#0d12a3', 
    '#0d3ca3',
    '#0d18a3', 
    '#0d1ea3', 
    '#0d24a3',
    '#0d36a3',  
    '#0d30a3', 
      
    
  ];
    let lightGreenShades = [
      '#a7d479', // Original color
      '#d4d4a2', 
      '#aed479', 
      '#d4d49b', 
      '#b5d479',
      '#d4d494', 
      '#bcd479', 
      '#d4d48d', 
      '#c3d479',
      '#d4d486',  
      '#cad479', 
      '#d1d479',
      '#d4d47f', 
      '#d8d479',  
    ];
    let darkGreenShades = [
      '#3d7748', // Original color
      '#004824',
      '#367248', 
      '#00482d', 
      '#2f6d48', 
      '#004836', 
      '#286848',
      '#00483f', 
      '#216348', 
      '#004a48', 
      '#1a5e48', 
      '#054f48',
      '#135948', 
      '#0c5448',   
      
    ];

        if (isOpenComplexity) {
          
            // Bike pie chart
            createSinglePieChart(Object.keys(resultStore.complexity.bike).map(value => value +" degree intersections"),
                Object.values(resultStore.complexity.bike).map(value => value * 100),
                canvasBike,
                "Bike Complexity",
                purpleShades);
            
            // Car pie chart
               createSinglePieChart(Object.keys(resultStore.complexity.car).map(value => value +" degree intersections"),
                Object.values(resultStore.complexity.car).map(value => value * 100),
                canvasCar,
                "Car Complexity",
                blueShades);


            if (compareRunStore.compare) {
                // Bike pie chart
                createSinglePieChart(Object.keys(compareRunStore.complexity.bike).map(value => value +" degree intersections"),
                    Object.values(compareRunStore.complexity.bike).map(value => value * 100),
                    canvasCompareBike,
                    "Bike Complexity",
                    lightGreenShades);
                
                // Car pie chart
                createSinglePieChart(Object.keys(compareRunStore.complexity.car).map(value => value +" degree intersections"),
                    Object.values(compareRunStore.complexity.car).map(value => value * 100),
                    canvasCompareCar,
                    "Car Complexity",
                    darkGreenShades);
            }
        }

};

function createSinglePieChart(labels,dataset,canvas,chartTitle,colorShades){
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
                    label: "Change in percentage of travel time",
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
                  label: "[km]",
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
                  size: 14,

                },
              }
            },
          },
    });
}





