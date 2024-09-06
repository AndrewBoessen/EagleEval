import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import ProfessorModel from '../models/professor';
import {
  searchById,
  findDocumentIdByFilter,
  searchForId,
} from '../utils/mongoUtils';
import { body, param, validationResult } from 'express-validator';
import { Types } from 'mongoose';
import rmp from '../controllers/RateMyProfessor';
import CommentModel, { IComment } from '../models/comment';
import CourseModel from '../models/course';
import { createComment, deleteCommentById } from '../controllers/comments';
import { ensureAuthenticated } from '../middleware/authentication';

const BC_SCHOOL_ID = 'U2Nob29sLTEyMg==';

const comment_router = express.Router();

comment_router.use(bodyParser.json());
comment_router.use(bodyParser.urlencoded({ extended: true }));

async function convertToIComment(
  jsonData: any[],
  prof_id: Types.ObjectId
): Promise<IComment[]> {
  const convertedData: IComment[] = await Promise.all(
    jsonData.map(async (item) => {
      const commentNode = item.node;

      const filter = {
        code: {
          $regex: new RegExp(commentNode.class, 'i'),
        },
      };

      const course_id = await findDocumentIdByFilter(CourseModel, filter);
      return <any>{
        user_id: null,
        message: commentNode.comment,
        createdAt: new Date(commentNode.date),
        wouldTakeAgain: commentNode.wouldTakeAgain ? true : false,
        professor_id: prof_id,
        course_id: course_id,
      };
    })
  );

  return convertedData;
}

// Router endpoint for retrieving comments for a professor
comment_router.get('/prof', async (req: Request, res: Response) => {
  // Extract professor id from the query string
  const prof_id: any = req.query['id'];

  if (prof_id) {
    // Retrieve professor name from MongoDB using the provided professor id
    const prof_name = (
      await searchById(ProfessorModel, <Types.ObjectId>prof_id)
    )?.name;

    if (prof_name) {
      // Log the intention to search RMP for comments on the professor
      console.log(`Searching for comments on ${prof_name}`);

      // Search RMP for the professor's information and get RMP professor id and name
      const searchResult = await rmp.searchTeacher(prof_name, BC_SCHOOL_ID);
      const rmp_prof_id: string | undefined = searchResult[0]?.id;
      const rmp_prof_first_name: string | undefined =
        searchResult[0]?.firstName;
      const rmp_prof_last_name: string | undefined = searchResult[0]?.lastName;

      if (rmp_prof_id && rmp_prof_first_name && rmp_prof_last_name) {
        // Check if both first name and last name are included in prof_name
        const profNameLower = prof_name.toLowerCase();

        if (
          profNameLower.includes(rmp_prof_first_name.toLowerCase()) &&
          profNameLower.includes(rmp_prof_last_name.toLowerCase())
        ) {
          console.log(
            `Match found: RMP ID ${rmp_prof_id} for ${rmp_prof_first_name} ${rmp_prof_last_name}`
          );

          // Retrieve comments from RMP using the RMP professor id
          const comments: any = await rmp.getTeacher(rmp_prof_id);

          // Convert RMP comments to the desired format
          const convertedComments: any[] | null = await convertToIComment(
            comments.ratings.edges,
            prof_id
          );

          const userComments: any[] | null = await searchForId(
            prof_id,
            CommentModel,
            'professor_id'
          );

          const allComments = (convertedComments ?? []).concat(
            userComments ?? []
          );
          // Send the converted comments as JSON response
          return res.json(allComments);
        } else {
          console.log(
            `Name mismatch: RMP returned ${rmp_prof_first_name} ${rmp_prof_last_name}, but searched for ${prof_name}`
          );
          // Fallback to user comments only
          const userComments: any[] | null = await searchForId(
            prof_id,
            CommentModel,
            'professor_id'
          );

          return userComments ? res.json(userComments) : res.json(null);
        }
      } else {
        console.log(`No matching professor found for ${prof_name}`);
        // Fallback to user comments only
        const userComments: any[] | null = await searchForId(
          prof_id,
          CommentModel,
          'professor_id'
        );

        return userComments ? res.json(userComments) : res.json(null);
      }
    } else {
      // Log that the provided professor id does not exist in MongoDB
      console.log('Invalid prof id, does not exist in MongoDB');
      return res.json(null);
    }
  } else {
    // Return an error message if the professor id is not provided in the query string
    return res.send('Query string must include id of professor');
  }
});

// Reouter endpoint for create a new comment
comment_router.post(
  '/prof',
  ensureAuthenticated,
  [
    body('user_id').isMongoId(),
    body('message').isString(),
    body('wouldTakeAgain').isBoolean(),
    body('professor_id').isMongoId(),
    body('course_id').exists(),
  ],
  async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { user_id, message, wouldTakeAgain, professor_id, course_id } =
        req.body;

      const new_comment: IComment | null = await createComment(
        user_id,
        message,
        wouldTakeAgain,
        professor_id,
        course_id
      );
      if (new_comment != null) {
        return res
          .status(201)
          .json({ message: 'Comment created successfully' });
      } else {
        return res.status(400).json({ errors: 'Error creating review' });
      }
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Example route for deleting a comment by ID
comment_router.delete(
  '/prof/:id',
  ensureAuthenticated,
  [param('id').isMongoId()],
  async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId: Types.ObjectId = (req.user as any)?._id;

      const commentId: Types.ObjectId = req.params['id'] as any;

      const commentToDelete = await searchById(CommentModel, commentId);
      if (commentToDelete?.user_id?.toString() != userId.toString()) {
        return res
          .status(401)
          .json({ message: 'Not authorized to delete this comment' });
      }

      const deletedComment = await deleteCommentById(commentId);

      // Check if the comment exists
      if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

export { comment_router };
