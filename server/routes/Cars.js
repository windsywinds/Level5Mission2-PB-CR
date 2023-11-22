const express = require("express");
const router = express.Router();
const { Cars } = require("../models");

router.get("/", async (req, res) => {
  const listOfCars = await Cars.findAll();
  res.json(listOfCars);
});

router.post("/", async (req, res) => {
  const car = req.body;
  await Cars.create(car);
  res.json(car);
});
router.post("/getcars", async (req, res) => {
  const color = req.body.data;
  console.log(color);
  const listOfCars = await Cars.findAll({
    where: {
      color: color,
    },
  });

res.json(listOfCars)
  

 
});

module.exports = router;
