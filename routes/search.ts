import express, { Request, Response } from 'express';
import {
  AutocompleteSearchResult,
  autocompleteCourseSearch,
  autocompleteProfSearch,
} from '../controllers/search';

const search_router = express.Router();


// ==========================================
// DISABLE ALL ROUTES IN THIS ROUTER
// ==========================================

search_router.use((req: Request, res: Response) => {
  return res.status(410).json({
    error: 'Gone',
    message: 'The professor and class search routes are no longer available.'
  });
});


const handleSearch = async (
  req: Request,
  res: Response,
  searchFunction: (query: string) => Promise<AutocompleteSearchResult[]>,
  type: string
) => {
  try {
    const query = (req.query['name'] as string) || null;

    if (query) {
      console.log(`Searching for ${type}: ${query}`);
      const searchResults = await searchFunction(query);

      console.log(`Found search results for ${query}`);
      return res.json(searchResults);
    } else {
      return res.send(`Query parameter "name" must not be empty for ${type}`);
    }
  } catch (error) {
    console.log(`Error searching for ${type}: ${error}`);
    return res.send(`Error searching for ${type}`);
  }
};

search_router.get('/profs', async (req, res) => {
  await handleSearch(req, res, autocompleteProfSearch, 'professor');
});

search_router.get('/courses', async (req, res) => {
  await handleSearch(req, res, autocompleteCourseSearch, 'course');
});

export { search_router };
