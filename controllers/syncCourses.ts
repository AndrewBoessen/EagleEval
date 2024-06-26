/*
Refresh course db with data from bc website

Fall - https://bcweb.bc.edu/aem/coursesfall.json
Summer - https://bcweb.bc.edu/aem/coursessumm.json
Spring - https://bcweb.bc.edu/aem/coursessprg.json
*/

import fetch from 'node-fetch';
import {
  removeKeysFromArray,
  removeDuplicateObjects,
} from '../utils/fetchUtils';
import Course, { ICourse } from '../models/course';
import { findAndUpdateDocument } from '../utils/mongoUtils';

const COURSE_DATA_URLS: string[] = [
  'https://bcweb.bc.edu/aem/coursesfall.json',
  'https://bcweb.bc.edu/aem/coursessumm.json',
  'https://bcweb.bc.edu/aem/coursessprg.json',
];

/**
 * Sends a GET request to the specified URL to fetch JSON data.
 *
 * @param {string} url - The URL to fetch JSON data from.
 * @returns {Promise<any>} - A Promise that resolves to the fetched JSON data.
 */
async function fetchJsonFromBC(url: string): Promise<any> {
  try {
    const response = await fetch(url);

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Fetches JSON data from multiple URLs concurrently.
 *
 * @param {string[]} urlArray - An array of URLs to fetch JSON data from.
 * @returns {Promise<any[]>} - A Promise that resolves to an array of fetched JSON data.
 */
async function fetchJsonsFromUrls(urlArray: string[]): Promise<any[]> {
  try {
    const promises = urlArray.map((url) => fetchJsonFromBC(url));
    const jsons = await Promise.all(promises);
    return jsons;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Processes new course data from the BC website.
 *
 * @returns {Promise<ICourse[]>} - A Promise that resolves to an array of parsed and cleaned JSON data.
 */
export async function fetchCourseData(): Promise<ICourse[]> {
  const uneeded_keys: string[] = [
    'course_id',
    'dept_code',
    'crs_number',
    'crs_desc',
    'comments',
    'xlist',
    'coreq',
    'open_close',
    'instructors',
    'room_schedule',
    'student_level',
    'section',
    'dept_name',
    'freq',
    'prereq',
    'term',
    'core_list',
    'credits',
  ];

  const new_json_data = fetchJsonsFromUrls(COURSE_DATA_URLS);

  let courses: ICourse[] = [];

  console.log('Getting course data from BC site');

  await new_json_data.then((results) => {
    for (const result of results) {
      for (const course of result.payload) {
        course.code = course.course_id.substring(0, 8);
        course.description = course.crs_desc;
      }
      let clean_json = removeKeysFromArray(result.payload, uneeded_keys);
      let trimmed_json = removeDuplicateObjects(clean_json);
      courses = courses.concat(<ICourse[]>trimmed_json);
    }
  });
  return courses;
}

/**
 * Update course collection in database
 *
 * @param {[ICourse[]]} - Array of new course data
 * @returns {Promise<void>}
 */
export async function updateCourseCollection(
  courseData: ICourse[]
): Promise<void> {
  let promises: Promise<ICourse>[] = [];

  // loop through each course
  for (const course of courseData) {
    const filter: Record<string, string> = {
      code: course.code,
    };

    promises.push(
      <Promise<ICourse>>findAndUpdateDocument(Course, filter, course)
    );
  }
  console.log('Updating course data in mongoDB');
  await Promise.all(promises);
}
