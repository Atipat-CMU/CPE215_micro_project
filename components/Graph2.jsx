import React, { useRef } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

function Graph2() {
  const myGraph = useRef(null);
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
  const DATA_COUNT = 12;
  const labels = [];
  for (let i = 0; i < DATA_COUNT; ++i) {
    labels.push(i.toString());
  }
  const datapoints = [
    { x: 0.0, y: 7.8 },
    { x: 0.01, y: 7.7 },
    { x: 0.03, y: 7.7 },
    { x: 0.04, y: 7.8 },
    { x: 0.05, y: 7.8 },
    { x: 0.06, y: 7.3 },
    { x: 0.07, y: 6.4 },
    { x: 0.08, y: 5.3 },
    { x: 0.1, y: 2.8 },
    { x: 0.11, y: -2.6 },
  ];

  const datapoints2 = [
    { x: 0.0, y: 0.0 },
    { x: 0.01, y: 0.0169 },
    { x: 0.03, y: 0.0254 },
    { x: 0.04, y: 0.0339 },
    { x: 0.05, y: 0.0424 },
    { x: 0.06, y: 0.0508 },
    { x: 0.07, y: 0.0593 },
    { x: 0.08, y: 0.0678 },
    { x: 0.1, y: 0.0762 },
    { x: 0.11, y: 0.0816 },
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Acceleration",
        data: datapoints2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
        layout: {
          padding: {
            top: "100px",
          },
        },
      }}
      onClick={onClick}
      ref={myGraph}
    />
  );
}

export default Graph2;
