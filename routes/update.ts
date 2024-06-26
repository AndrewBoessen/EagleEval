import express, { Request, Response } from 'express';
import {
  fetchCourseData,
  updateCourseCollection,
} from '../controllers/syncCourses';
import { ICourse } from '../models/course';
import buildTree from '../controllers/directory/tree';
import Group from '../controllers/directory/group';

export const update_router = express.Router();

update_router.post('/courses', async (req: Request, res: Response) => {
  console.log('Updating course data');

  try {
    const courses: ICourse[] = await fetchCourseData();

    await updateCourseCollection(courses);
  } catch (error) {
    console.error('Error updating course data: ' + error);
    return res.send('Error updating course data');
  }
  console.log('Successfully updated course data');
  return res.send('Successfully updated course data');
});

update_router.post('/profs', async (req: Request, res: Response) => {
  console.log('Updating professor data');

  const rootURL: string =
    'https://services.bc.edu/directorysearch/main/main/main/main/main/departmentPresence!displayInput.action?departmentNumber=050001&tabIndexNumber=1&peopleSearch=&deptSearch=provost&groupEmailSearch=&peopleSearchSelect=Faculty&clientInformation=&peopleSearchFilter=Faculty';
  try {
    const tree: Group = await buildTree(rootURL, 'Provost');

    console.log('Updating mongo with new data');
    await tree.updateMongo();

    return res.send('Successfully updating prof data');
  } catch (error) {
    console.error('Error updating prof data: ' + error);
    return res.send('Error updating professor data');
  }
});
