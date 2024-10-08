const express = require("express");
const ProductModel = require("../model/Product");
const { default: axios } = require("axios");
const router = express.Router();

router.get("/seed", async (req, res) => {
  try {
    const getDataUrl = process.env.SEED_DATA_URL;
    const response = await fetch(getDataUrl);
    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    const save = await ProductModel.insertMany(data);
    res.status(201).json({ message: "Data add successfully", save });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const { search = "", page = 1, pageSize = 5, month } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    if (!search) {
      const startDate = new Date(`${month} 1, 2022`);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);

      query.dateOfSale = { $gte: startDate, $lt: endDate };
    }

    if (!isNaN(Number(search))) {
      query.$or.push({ price: Number(search) });
    }

    const totalCount = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    const products = await ProductModel.find(query)
      .skip(Number((page - 1) * pageSize))
      .limit(Number(pageSize));

    res.status(200).json({ data: products, totalPages });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/statistics", async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(`${month} 1, 2022`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const totalSale = await ProductModel.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await ProductModel.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: true,
    });
    const totalNotSoldItems = await ProductModel.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: false,
    });
    res.status(200).json({
      totalSale: totalSale[0]?.totalAmount || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/bar-chart", async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(`${month} 1, 2022`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const priceRanges = [
      {
        range: "0-100",
        min: 0,
        max: 100,
      },
      {
        range: "101-200",
        min: 101,
        max: 200,
      },
      {
        range: "201-300",
        min: 201,
        max: 300,
      },
      {
        range: "301-400",
        min: 301,
        max: 400,
      },
      {
        range: "401-500",
        min: 401,
        max: 500,
      },
      {
        range: "501-600",
        min: 501,
        max: 600,
      },
      {
        range: "601-700",
        min: 601,
        max: 700,
      },
      {
        range: "701-800",
        min: 701,
        max: 800,
      },
      {
        range: "801-900",
        min: 801,
        max: 900,
      },
      {
        range: "901-above",
        min: 901,
        max: 9999999999,
      },
    ];
    const result = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await ProductModel.countDocuments({
          dateOfSale: { $gte: startDate, $lt: endDate },
          price: { $gte: range.min, $lte: range.max },
        });
        return { range: range.range, count };
      })
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/pie-chart", async (req, res) => {
  try {
    const { month } = req.query;
    const startDate = new Date(`${month} 1, 2022`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const categories = await ProductModel.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/combined-data", async (req, res) => {
  try {
    const transactions = await axios.get("http://localhost:3000/transactions", {
      params: req.query,
    });
    const statistics = await axios.get("http://localhost:3000/statistics", {
      params: req.query,
    });
    const barChart = await axios.get("http://localhost:3000/bar-chart", {
      params: req.query,
    });
    const pieChart = await axios.get("http://localhost:3000/pie-chart", {
      params: req.query,
    });

    res.status(200).json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
