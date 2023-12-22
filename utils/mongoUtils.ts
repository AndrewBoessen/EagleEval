import { Document, Model, Types } from 'mongoose';

/**
 * Finds and updates (upserts) a document based on the provided condition.
 *
 * @template T - The type of the Mongoose document.
 * @param {Model<T>} model - The Mongoose model.
 * @param {any} condition - The condition to find the document.
 * @param {any} updateData - The data to update the document with.
 * @returns {Promise<T | null>} - A Promise that resolves to the updated document or null if not found.
 */
export async function findAndUpdateDocument<T extends Document>(
  model: Model<T>,
  condition: any,
  updateData: any
): Promise<T | null> {
  try {
    // Find and update (upsert) the document
    const updatedDocument = await model.findOneAndUpdate(
      condition,
      updateData,
      { new: true, upsert: true } // Set upsert option to true
    );

    return updatedDocument;
  } catch (error) {
    // Handle errors appropriately
    console.error('Error finding and updating document:', error);
    throw error;
  }
}

/**
 * Searches for documents in the database based on a specified parameter field and value.
 *
 * @template T - The type of the Mongoose document.
 * @template P - The type of the parameter used for searching.
 * @param {string} id - The ID to search for in the specified parameter field.
 * @param {Model<T>} model - The Mongoose model.
 * @param {P} parameter - The parameter field to search in.
 * @returns {Promise<T[]>} - A Promise that resolves to an array of documents matching the search criteria.
 */
export async function searchForId<T extends Document, P extends keyof T>(
  id: string,
  model: Model<T>,
  parameter: P
): Promise<T[] | null> {
  try {
    // Verify if the provided ID is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }

    // Find documents in the database that match the provided ID in the specified parameter field
    const query: { [P in keyof T]?: any } = {};
    query[parameter] = id;

    const results = await model.find(query);
    return results;
  } catch (error) {
    // Handle errors, you might want to log the error or perform some other action
    console.error('Error searching by ID:', error);
    throw error;
  }
}

/**
 * Searches for a document by its ID.
 *
 * @template T - The type of the Mongoose document.
 * @param {Model<T>} model - The Mongoose model.
 * @param {string} id - The ID of the document to search for.
 * @returns {Promise<T | null>} - A Promise that resolves to the found document or null if not found.
 */
export async function searchById<T extends Document>(
  model: Model<T>,
  id: string
): Promise<T | null> {
  if (!Types.ObjectId.isValid(id)) {
    console.error('Invalid ID: ', id);
    return null;
  }

  const result = await model.findById(id).exec();

  if (!result) {
    return null;
  }

  return result;
}
