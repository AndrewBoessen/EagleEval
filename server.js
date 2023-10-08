import { getReviews } from "./fetchReviews.js";
import { getDrillDown } from "./fetchDrillDown.js";
import { processNewData } from "./syncData.js";
import { getAllProfData, getMcasDeps } from "./syncMCAS.js";
import { updateCollection } from "./updateMongo.js";
import { courseSchema } from "./courseSchema.js";
import { profSchema } from "./profSchema.js";
import {
  findOrCreateAndUpdateCourse,
  findOrCreateAndUpdateProf,
} from "./mongoUtils.js";
import { connectToDatabase, closeDatabaseConnection } from "./mongo.js";
import "log-timestamp";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import { body, matchedData, validationResult } from "express-validator";
import { ConsoleLogger } from "@angular/compiler-cli";

const app = express();

// handling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Middleware to connect to MongoDB when the server starts
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// handle parsing post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// route to fetching review data from api for a certain query
app.post(
  "/api/fetch/reviews",
  body("fetch_query").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Query string from body (Class code or professor name)
      let query = data.fetch_query;
      console.log("Processing response for query: " + query);

      // Wait for response from bc reviews
      let fetch_response = await getReviews(query);

      console.log("Successfully fetched reviews for: " + data.fetch_query);
      return res.send(fetch_response);
    }

    console.error(
      req.body.fetch_query
        ? "Error for query: " + req.body.fetch_query
        : "Error: empty fetch query"
    );
    res.send("Invalid body params: fetch_query must not be empty");
  }
);

app.post(
  "/api/fetch/drilldown",
  body("code").trim().notEmpty().escape(),
  body("prof").trim().notEmpty().escape(),
  async (req, res) => {
    let result = validationResult(req);

    // Validate input has no errors
    if (result.isEmpty()) {
      let data = matchedData(req);

      // Query params from body (Class code or professor name)
      let code = data.code;
      let prof = data.prof;
      console.log(`Processing response for query: ${code}, ${prof}`);

      // Wait for response from bc reviews
      let fetch_response = await getDrillDown(code, prof);

      console.log(`Successfully fetched drilldown data for: ${code}, ${prof}`);
      return res.send(fetch_response);
    }

    console.error(
      req.body.code && req.body.prof
        ? `Error for query: ${req.body.code}, ${req.body.prof}`
        : "Error: empty body params"
    );
    res.send("Invalid body params: code and prof must not be empty");
  }
);

app.get("/api/fetch/courseData", async (req, res) => {
  console.log("Fetching course data from BC database");

  // wait for response from BC Course Database
  let newData = await processNewData();

  console.log("Successfully fetched course data from BC");

  res.send(newData);
});

app.get("/api/fetch/mcas/deps", async (req, res) => {
  console.log("Fetching MCAS Department URLs");

  // wait for response form bc website
  let departments = await getMcasDeps();

  console.log("Successfully fetched MCAS departments");

  res.send(departments);
});

app.get("/api/fetch/mcas/profs", async (req, res) => {
  console.log("Fethcing MCAS professor data");

  // wait for response from BC site scraper
  let profData = await getAllProfData();
  console.log("Finished collecting MCAS prof data");

  res.send(profData);
});

app.post("/api/update/courses", async (req, res) => {
  const Course = new mongoose.model("Course", courseSchema);

  console.log("Updating mongo with new course data");

  // Fetch data from BC Course database
  console.log("Fetching new course data from BC");
  let newData = await processNewData();
  console.log("Completed fetching course data");

  // Update mongodb with new course data
  console.log("Starting updating of course database");
  let newCourses = await updateCollection(
    newData,
    Course,
    findOrCreateAndUpdateCourse
  );
  console.log("Finished updating course database");

  res.send(
    `Successfully updated course database. Added ${newCourses} new courses`
  );
});

app.post("/api/update/mcas/profs", async (req, res) => {
  const Professor = new mongoose.model("Professor", profSchema);

  console.log("Updating mongo with MCAS data");

  console.log("Getting prof data from BC website");
  let newProfData = await getAllProfData();
  console.log("Completed fetching MCAS prof data");

  console.log("Starting updating professor data for MCAS");
  let newProfs = await updateCollection(
    newProfData,
    Professor,
    findOrCreateAndUpdateProf
  );
  console.log("Finished updating prof databse for MCAS");

  res.send(
    `Successfully updated MCAS professor databse. Added ${newProfs} new professors`
  );
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
