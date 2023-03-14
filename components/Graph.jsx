import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { eulerMethod } from "../Lib/eulerMethod";

function Graph(props) {
  const [chartData, setChartData] = useState([]);
  const [graph, setGraph] = useState(null);
  const myGraph = useRef();

  useEffect(() => {
    if (props.data && props.data.length !== 0) {
      let start = 0;
      for (let i = 0; i < props.data.length; i++) {
        const element = props.data[i];
        if (element.x == 0) {
          start = i;
        }
      }
      generateData(props.data.slice(start, -1));
    }
    console.log(props.data);
  }, [props]);

  const generateData = (point, type) => {
    // const chart = myGraph.current.chartInstance;
    const DATA_COUNT = point.length;
    const labels = [];
    point.forEach((element) => {
      labels.push(element.x);
    });
    const data1 = {
      labels: labels,
      datasets: [
        {
          label: "Velocity",
          data: eulerMethod(point),
          fill: false,
          tension: 0.4,
          borderColor: "rgba(237, 178, 69, 1)",
          // backgroundColor: "rgba(237, 178, 69, 0.5)",
          // pointStyle: "circle",
          // pointRadius: 5,
          // pointHoverRadius: 8,
        },
      ],
    };
    const newChartData = [];
    newChartData.push(data1);
    const data2 = {
      labels: labels,
      datasets: [
        {
          label: "Acceleration",
          data: point,
          fill: false,
          tension: 0.4,
          borderColor: "rgba(236, 72, 69, 1)",
          // backgroundColor: "rgba(236, 72, 69, 0.5)",
          // pointStyle: "circle",
          // pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    };
    newChartData.push(data2);
    setChartData(newChartData);
  };

  const onClick = (event) => {
    const ctx = myGraph.current;
    const point = ctx.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      true
    );
    console.log(point);
  };

  return (
    <>
      {chartData.length > 0 && (
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "500px",
            }}
          >
            <Line
              data={chartData.at(1)}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || "";

                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed.y !== null) {
                          label += context.parsed.y + " m²/s";
                        }
                        return label;
                      },
                    },
                  },
                },
                layout: {
                  padding: {
                    top: "100px",
                  },
                },
                maintainAspectRatio: false,
                scale: {
                  yAxes: [
                    {
                      scaleLabel: {
                        display: true,
                        labelString: "probability",
                      },
                      beginAtZero: true,
                    },
                  ],
                },
              }}
              onClick={onClick}
              ref={myGraph}
            />
          </div>
          {props.showV === true && (
            <div
              style={{
                width: "100%",
                height: "500px",
              }}
            >
              <Line
                data={chartData.at(0)}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          let label = context.dataset.label || "";

                          if (label) {
                            label += ": ";
                          }
                          if (context.parsed.y !== null) {
                            label += context.parsed.y + " m/s";
                          }
                          return label;
                        },
                      },
                    },
                  },
                  layout: {
                    padding: {
                      top: "100px",
                    },
                    scale: {
                      yAxes: [
                        {
                          scaleLabel: {
                            display: true,
                            labelString: "probability",
                          },
                          beginAtZero: true,
                        },
                      ],
                    },
                  },
                  maintainAspectRatio: false,
                }}
                onClick={onClick}
                ref={myGraph}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Graph;
