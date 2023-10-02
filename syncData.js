/*

Refresh course db with data from bc website

Fall - https://bcweb.bc.edu/aem/coursesfall.json
Summer - https://bcweb.bc.edu/aem/coursessumm.json
Spring - https://bcweb.bc.edu/aem/coursessprg.json

*/

import fetch from "node-fetch";
import { removeKeysFromArray } from "./fetchUtils.js";
import { keyframes } from "@angular/animations";

var COURSE_DATA_URLS = [
  "https://bcweb.bc.edu/aem/coursesfall.json",
  "https://bcweb.bc.edu/aem/coursessumm.json",
  "https://bcweb.bc.edu/aem/coursessprg.json",
];

// Sends get request to get json data
async function fetchJsonFromBC(url) {
  try {
    const response = await fetch(url);

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// Gets json from each url
async function fetchJsonsFromUrls(urlArray) {
  try {
    const promises = urlArray.map((url) => fetchJsonFromBC(url));
    const jsons = await Promise.all(promises);
    return jsons;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function processNewData() {
  const uneeded_keys = [
    "course_is",
    "comments",
    "xlist",
    "coreq",
    "open_close",
  ];
  const id = ["dept_code", "crs_number"];

  const new_json_data = fetchJsonsFromUrls(COURSE_DATA_URLS);

  var parsed_json = [];
  const courses = new Set();

  await new_json_data.then((results) => {
    for (const result of results) {
      let clean_json = removeKeysFromArray(result.payload, uneeded_keys);
      parsed_json.push(clean_json);
    }
  });

  return parsed_json;
}

export async function getNewData() {
  const processed_data = processNewData();
}

for (let i = 0; i < parsed_json.length; i++) {
  for (let j = 0; j < parsed_json[i].length; j++) {
    let curr_id = parsed_json[i][j][id[0]] + parsed_json[i][j][id[1]];
    courses.add(curr_id);
  }
}

return courses;
