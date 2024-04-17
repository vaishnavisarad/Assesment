import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import 'chartjs-adapter-date-fns';

export default function CreateGraph() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null); // Store reference to the Chart instance
  const [mongodata, setMongoData] = useState([{}]);

  useEffect(() => {
    fetch("http://localhost:5000/data")
      .then((response) => response.json())  // return the result of response.json()
      .then((data) => {
        setMongoData(data);  // handle the result in the next then()
      })
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (mongodata.length === 0) {
      return;
    }

    if (chartRef.current) {
      // Destroy existing Chart instance before creating a new one
      chartRef.current.destroy();
    } 

    const chartData = mongodata.map(item => ({
      x: new Date(item.ts),
      y: item.frequency,
      machine_status: item.machine_status
    }));
    
    // const myChart = new Chart(ctx, {
      chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [{
          label: 'Frequency',
          data: chartData,
          // borderColor: item => item.machine_status === 0 ? 'yellow' : item.machine_status === 1 ? 'green' : 'red',
          borderColor: item => {
            if (item.machine_status === 1) {
              return 'yellow';
            } else if (item.machine_status === 0) {
              return 'green';
            } else {
              return 'red';
            }
          }
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: {
                hour: 'HH:mm:ss'
              },
              unit: 'hour'
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 600
          }
        }
      }
    })
    
  },[mongodata])

  return (<>
    <canvas ref={canvasRef} />
    {/* <div>log</div> */}
  </>);
}
