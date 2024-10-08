import React, { useEffect, useState } from "react";
import { statisticsApi } from "../utils/constants";

const Statistics = ({ month }) => {
  const [data, setData] = useState({});
  const fetchData = async () => {
    const response = await fetch(`${statisticsApi}?month=${month}`);
    const dataResponse = await response.json();
    setData(dataResponse);
    console.log(data);
  };
  useEffect(() => {
    fetchData();
  }, [month]);

  return (
    <div className="my-10">
      <h3 className="text-2xl text-left mb-6  font-bold">
        Statistics - {month}
      </h3>
      <div className="border shadow-md   p-10 rounded-md bg-yellow-200">
        <div className="flex justify-between">
          <p> Total Sale </p>
          <p> {data?.totalSale}</p>
        </div>

        <div className="flex justify-between">
          <p> Total Sold Items </p>
          <p>{data?.totalSoldItems}</p>
        </div>

        <div className="flex justify-between">
          <p>Total Not Sold Items </p>
          <p>{data?.totalNotSoldItems}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
