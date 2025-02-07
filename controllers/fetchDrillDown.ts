import HtmlTableToJson from '../utils/HtmlTableToJson';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
// Import fetch utils
import {
  removeKeysFromArray,
  cleanKeysAndRemoveNonASCII,
} from '../utils/fetchUtils';
import { IDrilldown } from '../models/drilldown';
import { IReview } from '../models/review';
import { searchById } from '../utils/mongoUtils';
import ReviewModel from '../models/review';
import { checkAndSetUndefinedIfString } from '../utils/fetchUtils';

interface RequestBody {
  strUiCultureIn: string;
  datasourceId: string;
  blockId: string;
  subjectColId: string;
  subjectValue: string;
  detailValue: string;
  gridId: string;
  pageActuelle: number;
  strOrderBy: [string, string, string, string];
  strFilter: [string, string, string, string];
  sortCallbackFunc: string;
  userid: string;
  pageSize: string;
}

/**
 * Generates the request body for the API call.
 *
 * @param code - The code parameter.
 * @param instructor - The instructor parameter.
 * @returns A JSON string representing the request body.
 */
const genBody = (code: string, instructor: string): string => {
  const body: RequestBody = {
    strUiCultureIn: 'en',
    datasourceId: '890',
    blockId: '30',
    subjectColId: '2',
    subjectValue: code,
    detailValue: instructor,
    gridId: 'fbvGridDrilldown',
    pageActuelle: 1,
    strOrderBy: ['col_19', 'desc', code, instructor],
    strFilter: ['', '', 'ddlFbvColumnSelector', ''],
    sortCallbackFunc: '__getFbvGridDrilldownData',
    userid: '',
    pageSize: '1000',
  };

  // Convert the body object to a JSON string.
  return JSON.stringify(body);
};

/**
 * Retrieves more detailed data for each review entry.
 *
 * @param review_id - The id of the parent review document.
 * @returns A Promise that resolves to the detailed data or null if no data is found.
 */
export const getDrillDown = async (
  review_id: Types.ObjectId
): Promise<IDrilldown | null> => {
  // Get search parames from mongo docs
  const parent_review: IReview | null = await searchById(
    ReviewModel,
    review_id
  );

  if (parent_review) {
    var semester: string = parent_review.semester;
    var prof: string = parent_review.prof;
    var course: string = parent_review.code;
  } else {
    console.log('Review id not found when getting drilldown for ' + review_id);
    return null;
  }
  // Data values to exclude in output
  const uneeded_keys: string[] = [
    'learningobjectivesclear(c)',
    'effectivecreatingunderstandingofdifficultsubjectmatter/practices(i)',
    'instructorreturnedassignments(i)',
    'timelyfeedback(i)',
    'meaningfulfeedback(i)',
    'seminaraworthwhileexperience(i)',
    'seminarasamethodtoadvisefreshmen(i)',
    'asanacademicadvisor(i)',
    'asacourseinstructor(i)',
    'readingsanddiscussionswereinterestinganduseful(i)',
    'waytolearnaboutclassmates(i)',
    'learningapplicablebeyondcourse(c)',
    'motivatedmetodomybestwork(i)',
    'instructorenthusiastic(i)',
    'coursefollowedsyllabus(c)',
    'instructorrespectfulofstudents(i)',
    'workrequired(c)',
    'courseoverall(c)',
    'instructoroverall(i)',
  ];

  // Send a POST request to the specified URL with the generated request body and headers.
  const response = await fetch(
    'https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid',
    {
      method: 'post',
      body: genBody(course, prof),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    }
  );

  // Parse the JSON response from the API.
  const rawData: any = await response.json();

  // Extract the HTML table data from the response.
  const reviews_json = HtmlTableToJson.parse(String(rawData['d'][0]));
  let json_objects = reviews_json.results[0];

  // Check if no results are returned
  if (Object.keys(json_objects[0]).length <= 1) {
    console.log('No data found for ' + course + ' ' + prof);
    return null;
  }

  // Clean JSON keys
  let clean_json = cleanKeysAndRemoveNonASCII(json_objects);

  // Remove uneeded keys in json
  let result = removeKeysFromArray(clean_json, uneeded_keys);

  // Find correct review data by matching semester
  for (const document of result) {
    if (document.semester === semester) {
      let new_document: any = {};
      new_document.review_id = review_id;

      new_document.coursewellorganized = checkAndSetUndefinedIfString(
        document['coursewellorganized(c)']
      );
      new_document.courseintellectuallychallenging =
        checkAndSetUndefinedIfString(
          document['courseintellectuallychallenging(c)']
        );
      new_document.effortavghoursweekly = checkAndSetUndefinedIfString(
        document['effortavghoursweeklyc']
      );
      new_document.attendancenecessary = checkAndSetUndefinedIfString(
        document['attendancenecessary(c)']
      );
      new_document.assignmentshelpful = checkAndSetUndefinedIfString(
        document['assignmentshelpful(c)']
      );
      new_document.instructorprepared = checkAndSetUndefinedIfString(
        document['instructorprepared(i)']
      );
      new_document.instructorclearexplanations = checkAndSetUndefinedIfString(
        document['instructorclearexplanations(i)']
      );
      new_document.availableforhelpoutsideofclass =
        checkAndSetUndefinedIfString(
          document['availableforhelpoutsideofclass(i)']
        );
      new_document.stimulatedinterestinthesubjectmatter =
        checkAndSetUndefinedIfString(
          document['stimulatedinterestinthesubjectmatter(i)']
        );

      return <IDrilldown>new_document;
    }
  }

  return null;
};
