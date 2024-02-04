// Import necessary modules
import express, { Request, Response } from 'express';
import passport from 'passport';
import { ensureAuthenticated } from '../middleware/authentication';
import { searchById, searchForId } from '../utils/mongoUtils';
import UserModel from '../models/user';
import CommentModel from '../models/comment';
import ReviewModel from '../models/review';

// Create an Express router
const router = express.Router();

// Define Google authentication route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Define Google authentication callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// Get users profile data
router.get(
  '/profile',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const id = (req.user as any)._id;

    if (id) {
      const user_data = await searchById(UserModel, id);

      return res.json(user_data);
    } else {
      return res.status(401).json({ message: 'Not Authorized' });
    }
  }
);

// Get users profile data
router.delete(
  '/profile',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const id = (req.user as any)._id;

    if (id) {
      const user_data = await UserModel.findByIdAndDelete(id);

      if (user_data) {
        console.log('Deleting all user reivews');
        await ReviewModel.deleteMany({ user_id: id });

        console.log('User DELETED: ', id);
        return res.status(200);
      } else {
        console.log('User profile not found');
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      return res.status(401).json({ message: 'Not Authorized' });
    }
  }
);

// Logout route
router.get('/logout', (req: Request, res: Response, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  //res.redirect('/');
  return res.status(200).json({ message: 'success' });
});

// Get users comments
router.get(
  '/comments',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const id = (req.user as any)._id;

    if (id) {
      const user_comments = await searchForId(id, CommentModel, 'user_id');

      return res.json(user_comments);
    } else {
      return res.status(401).json({ message: 'Not Authorized' });
    }
  }
);

export { router as auth_router };
