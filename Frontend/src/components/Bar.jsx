import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { barApi } from "../utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${barApi}?month=${month}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [month]);

  const chartData = {
    labels: data.map((item) => item.range),
    datasets: [
      {
        label: "Count",
        data: data.map((item) => item.count),
        backgroundColor: "rgb(254, 240 ,138, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h3 className="text-2xl text-left mb-6 font-bold">
        Bar Chart Stats - {month}
      </h3>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
