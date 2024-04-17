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

  const fetchDataByFilter = (start, frequency) => {
    fetch(`http://localhost:5000/filter?start=${start}&frequency=${frequency}`)
      .then((response) => response.json())
      .then((data) => {
        setMongoData(data);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
      });
  };

  // useEffect(() => {
  //   const ctx = canvasRef.current.getContext("2d");
    
  //   if (mongodata.length === 0) {
  //     return;
  //   }
    
  //   if (chartRef.current) {
  //     // Destroy existing Chart instance before creating a new one
  //     chartRef.current.destroy();
  //   } 
    
  //   const chartData = mongodata.map(item => ({
  //     x: new Date(item.ts),
  //     y: item.vibration,
  //     machine_status: item.machine_status
  //   }));
    
  //   console.log("Chart data:", chartData);
  //   // const myChart = new Chart(ctx, {
  //     chartRef.current = new Chart(ctx, {
  //     type: "line",
  //     data: {
  //       datasets: [{
  //         label: 'Frequency',
  //         data: chartData,
  //         // borderColor: item => item.machine_status === 0 ? 'yellow' : item.machine_status === 1 ? 'green' : 'red',
  //         borderColor: mongodata.map(item => {
  //           if (item.machine_status === 0) {
  //             return 'yellow';
  //           } else if (item.machine_status === 1) {
  //             return 'green';
  //           } else {
  //             return 'yellow';
  //           }
  //         })
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         x: {
  //           type: 'time',
  //           time: {
  //             displayFormats: {
  //               hour: 'HH:mm:ss'
  //             },
  //             unit: 'hour'
  //           }
  //         },
  //         y: {
  //           beginAtZero: true,
  //           suggestedMax: 600
  //         }
  //       }
  //     }
  //   })
    
  // },[mongodata]);

  useEffect(() => {
    // Check if mongodata is not empty
    if (mongodata.length === 0) {
      return;
    }
  
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      // Destroy existing Chart instance before creating a new one
      chartRef.current.destroy();
    }

    const groupedData = mongodata.reduce((acc, item) => {
      const timestamp = new Date(item.ts).toLocaleTimeString();
      const frequency = item.frequency; // Convert frequency to string for grouping
      
      if (!acc[timestamp]) {
        acc[timestamp] = { };
      }

      if (!acc[timestamp][frequency]) {
        acc[timestamp][frequency] = { totalVibration: 0, machine_status: item.machine_status };
      }

      acc[timestamp][frequency].totalVibration += item.vibration;

      return acc;
    }, {});

    const timestamps = Object.keys(groupedData);
    const frequencies = Object.keys(groupedData[timestamps[0]]); // Get frequencies from the first timestamp

   
    const datasets = frequencies.map((frequency, index) => ({
      label: `${frequency} Hz`,
      data: timestamps.map(timestamp => groupedData[timestamp][frequency].totalVibration),
      backgroundColor: timestamps.map(timestamp => groupedData[timestamp][frequency].machine_status === 0 ? 'yellow' : 'green')
    }));

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: timestamps,
        datasets: datasets
      },
      options: {
        scales: {
          x: {
            stacked: true, // Stacked bars on x-axis
          },
          y: {
            ticks: {
              callback: function(value, index, values) {
                return value + ' Hz'; // Add 'Hz' suffix to frequencies
              }
          }
        }
      }
      }
    });
  }, [mongodata]);
    

  const handleFilterData = () => {
    const start = '2024-01-01T00:00:00Z'; // Replace with your desired start time
    const frequency = 'hour'; // Replace with your desired frequency
    fetchDataByFilter(start, frequency);
  };

  console.log(mongodata);
  return (<>
  <button onClick={handleFilterData}>Filter Data</button>
    <canvas ref={canvasRef} />
  </>);
}
