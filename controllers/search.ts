import CourseModel from '../models/course';
import ProfessorModel from '../models/professor';

export interface AutocompleteSearchResult {
  _id: string;
  name?: string;
  title?: string;
  code?: string;
  score: number;
}

// Autocomplete search for courses
export async function autocompleteCourseSearch(
  query: string
): Promise<AutocompleteSearchResult[]> {
  const agg: any[] = [
    {
      $search: {
        index: 'searchCourses',
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: 'title',
                tokenOrder: 'any',
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
            {
              autocomplete: {
                query: query,
                path: 'code',
                tokenOrder: 'any',
                fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
              },
            },
            {
              text: {
                query: query,
                path: ['title', 'code'],
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        code: 1,
        score: { $meta: 'searchScore' },
      },
    },
  ];

  return await CourseModel.aggregate<AutocompleteSearchResult>(agg);
}

// Autocomplete search for professors
export async function autocompleteProfSearch(
  query: string
): Promise<AutocompleteSearchResult[]> {
  const agg: any[] = [
    {
      $search: {
        index: 'searchProfs',
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: 'name',
                tokenOrder: 'any',
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
            {
              text: {
                query: query,
                path: 'name',
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 5,
    },
    {
      $project: { _id: 1, name: 1, score: { $meta: 'searchScore' } },
    },
  ];

  return await ProfessorModel.aggregate<AutocompleteSearchResult>(agg);
}
