// scrape.js - Scrapes review data from BC db
import express from "express";
import { body, matchedData, validationResult } from "express-validator";

import { scrapeDrilldown, scrapeProfessors } from "../controllers/scrapeAPI.js";

export const scrape_router = express.Router();

// Scrape review for professors
// Loops through all professor reviews
scrape_router.post("/reviews", async (req, res) => {
  let result = validationResult(req);

  if (result.isEmpty()) {
    await scrapeProfessors();

    return res.send("Scraped professor reviews");
  }

  res.send("Invalid body params");
});

scrape_router.post("/drilldown", async (req, res) => {
  let result = validationResult(req);

  if (result.isEmpty()) {
    await scrapeDrilldown();

    return res.send("Scraped drilldown reviews");
  }

  res.send("Invalid body params");
});
