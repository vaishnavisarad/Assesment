import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

export default function CreateGraph() {

  const [filteredData, setFilteredData] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [frequency, setFrequency] = useState("");
  
  const [mongodata, setMongoData] = useState([{}]);

useEffect(() => {
  fetch("http://localhost:5000/data")
    .then((response) => response.json())  // return the result of response.json()
    .then((data) => {
      setMongoData(data);  // handle the result in the next then()
    })
}, []);

  // Filter data based on start time and frequency
useEffect(() => {
  const startTimeDate = new Date(startTime);
  const filteredData = mongodata.filter((item) => {
  const itemTime = new Date(item.ts);
});

    setFilteredData(filteredData);
  }, [mongodata, startTime, frequency]);

  console.log(mongodata);
  return <div>CreateGraph</div>;
}
