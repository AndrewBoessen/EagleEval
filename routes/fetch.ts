import express, { Request, Response } from 'express';
import { getReviews } from '../controllers/fetchReviews';
import { getDrillDown } from '../controllers/fetchDrillDown';
import ReviewModel, { IReview } from '../models/review';
import DrilldownModel, { IDrilldown } from '../models/drilldown';
import ProfessorModel from '../models/professor';
import CourseModel from '../models/course';
import { searchById, searchForId } from '../utils/mongoUtils';
import { countDocumentsInCollection } from '../controllers/count';
import { async } from '@angular/core/testing';

const fetch_router = express.Router();

// Reusable function for handling database searches
const handleDatabaseSearch = async (
  res: Response,
  model: any,
  id: any,
  field: string
) => {
  if (!id) {
    return res.send('Query params must include "id"');
  }

  console.log(`Searching database for ${field} id: ${id}`);

  const data = await searchById(model, id);

  if (data) {
    console.log(`Successfully got ${field} data for id: ${id}`);
    return res.json(data);
  } else {
    console.log(`No ${field} found for id: ${id}`);
    return res.json(null);
  }
};

// Reviews Route
fetch_router.get('/reviews', async (req: Request, res: Response) => {
  const query = (req.query['search'] as string) || null;

  if (query) {
    console.log('Searching for', query);

    const fetchResponse: IReview[] | null = await getReviews(query);

    if (fetchResponse) {
      console.log('Successfully fetched reviews for', query);
      return res.json(fetchResponse);
    } else {
      return res.send('No reviews found');
    }
  } else {
    return res.send('Query string must not be empty');
  }
});

// Drilldown Route
fetch_router.get('/drilldown', async (req: Request, res: Response) => {
  const reviewId = req.query['id'] as any | null;

  if (reviewId) {
    console.log(`Searching for drilldown: ID - ${reviewId}`);

    const fetchResponse: IDrilldown | null = await getDrillDown(reviewId);

    if (fetchResponse) {
      console.log(`Successfully got data for drilldown: ID - ${reviewId}`);
      return res.json(fetchResponse);
    } else {
      console.log(`No data for drilldown: ID - ${reviewId}`);
      return res.send('No data for review id');
    }
  } else {
    return res.send('Query string must include parent review id');
  }
});

// Count Professor Route
fetch_router.get('/database/prof/count', async (req: Request, res: Response) => {
  try {
    const count = await countDocumentsInCollection(ProfessorModel);
    res.json({ count: count })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while counting professors' })
  }
});

// Count Courses Route
fetch_router.get('/database/course/count', async (req: Request, res: Response) => {
  try {
    const count = await countDocumentsInCollection(CourseModel);
    res.json({ count: count })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while counting courses' })
  }
});

// Count Reviews Route
fetch_router.get('/database/reviews/count', async (req: Request, res: Response) => {
  try {
    const count = await countDocumentsInCollection(ReviewModel);
    res.json({ count: count })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while counting reviews' });
  }
});

// Database Routes
fetch_router.get('/database/prof', async (req: Request, res: Response) => {
  return handleDatabaseSearch(res, ProfessorModel, req.query['id'], 'prof');
});

fetch_router.get('/database/course', async (req: Request, res: Response) => {
  return handleDatabaseSearch(res, CourseModel, req.query['id'], 'course');
});

fetch_router.get(
  '/database/review/prof',
  async (req: Request, res: Response) => {
    const id = req.query['id'] as any;
    return searchForIdHandler(res, id, ReviewModel, 'professor_id');
  }
);

fetch_router.get(
  '/database/review/course',
  async (req: Request, res: Response) => {
    const id = req.query['id'] as any;
    return searchForIdHandler(res, id, ReviewModel, 'course_id');
  }
);

fetch_router.get('/database/drilldown', async (req: Request, res: Response) => {
  const id = req.query['id'] as any;
  return searchForIdHandler(res, id, DrilldownModel, 'review_id');
});

// Reusable function for handling review/course/professor search by ID
const searchForIdHandler = async (
  res: Response,
  id: any,
  model: any,
  field: string
) => {
  if (id) {
    const reviews: IReview[] | null = await searchForId(
      id,
      model,
      <keyof IReview>field
    );
    return res.json(reviews);
  } else {
    return res.send('Query params must include "id"');
  }
};

export { fetch_router };
