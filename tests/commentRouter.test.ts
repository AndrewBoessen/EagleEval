jest.mock('../middleware/authentication');
jest.mock('../utils/mongoUtils');
jest.mock('../controllers/comments');

import request from 'supertest';
import express, { Application } from 'express';
import { comment_router } from '../routes/comments'; // Update with the correct path
import { Types } from 'mongoose';
import * as constants from './constants';

const app: Application = express();
app.use(comment_router);

describe('Comment Router Tests', () => {
  // Test GET /prof
  describe('GET /prof', () => {
    it('should return comments for a professor', async () => {
      const response = await request(app).get(
        '/prof?id=82493b0b18c55ace59aa4825'
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      // Add more assertions based on your expected response format
    });

    it('should return an error if no professor id is provided', async () => {
      const response = await request(app).get('/prof');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Query string must include id of professor');
    });
  });

  // Test POST /prof
  describe('POST /prof', () => {
    it('should create a new comment', async () => {
      const response = await request(app)
        .post('/prof')
        .set({
          authorization: constants.VALID_TOKEN,
        })
        .send({
          user_id: constants.VALID_USER_ID,
          message: 'Test comment',
          wouldTakeAgain: true,
          professor_id: new Types.ObjectId('82493b0b18c55ace59aa4825'),
          course_id: new Types.ObjectId('82493b0b18c55ace59aa4825'),
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Comment created successfully',
      });
    });

    it('should return validation errors if request body is invalid', async () => {
      const response = await request(app)
        .post('/prof')
        .set({
          authorization: constants.VALID_TOKEN,
        })
        .send({
          // Invalid request body
        });

      expect(response.status).toBe(400);
      // Add more assertions based on your expected validation error response
    });
  });

  // Test DELETE /prof/:id
  describe('DELETE /prof/:id', () => {
    it('should delete a comment', async () => {
      const response = await request(app)
        .delete(`/prof/${constants.VALID_COMMENT_ID}`)
        .set({
          authorization: constants.VALID_TOKEN,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Comment deleted successfully',
      });
    });

    it('should return an error if the comment does not exist', async () => {
      const response = await request(app)
        .delete(`/prof/${constants.INVALID_COMMENT_ID}`)
        .set({
          authorization: constants.VALID_TOKEN,
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Comment not found' });
    });
  });
});
