import React, { useEffect, useState } from "react";
import { transactionsApi } from "../utils/constants";
import Statistics from "./Statistics";
import BarChart from "./Bar";

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("March");

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery, selectedMonth]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${transactionsApi}?page=${currentPage}&search=${searchQuery}&month=${selectedMonth}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await response.json();
      setData(json.data);
      setTotalPages(json.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const months = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "Mar", label: "March" },
    { value: "Apr", label: "April" },
    { value: "May", label: "May" },
    { value: "Jun", label: "June" },
    { value: "Jul", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <div className="flex justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
            className="border border-gray-300 px-4 rounded-full w-1/2 outline-none shadow-sm"
          />
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
              setSearchQuery("");
            }}
            className="border border-gray-300 p-2 rounded ml-2 outline-none"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-auto border border-gray-300 shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-6 text-left">Id</th>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Date of Sale</th>
                <th className="py-3 px-6 text-left">Sold</th>
                <th className="py-3 px-6 text-left">Image</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-normal">
              {data.length > 0 ? (
                data.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="py-3 px-6">{transaction.id}</td>
                    <td className="py-3 px-6">{transaction.title}</td>
                    <td className="py-3 px-6">
                      {transaction.description.length > 50
                        ? `${transaction.description.substring(0, 50)}...`
                        : transaction.description}
                    </td>
                    <td className="py-3 px-6">{transaction.price}</td>
                    <td className="py-3 px-6">
                      {new Date(transaction.dateOfSale).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      {transaction.sold ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-6">
                      <img
                        src={transaction.image}
                        alt={transaction.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-3 px-6 text-center">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
        <Statistics month={selectedMonth} />
        <BarChart month={selectedMonth} />
      </div>
    </div>
  );
};

export default Table;
