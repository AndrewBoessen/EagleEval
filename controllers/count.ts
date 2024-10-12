import { Model, Document } from 'mongoose';

/**
 * Counts the number of documents in a given Mongoose model's collection.
 * @param model - The Mongoose model to count documents for.
 * @returns A promise that resolves to the count of documents.
 * @throws {Error} If there's an error during the counting process.
 */
export async function countDocumentsInCollection<T extends Document>(model: Model<T>): Promise<number> {
  if (!(model && model.countDocuments && typeof model.countDocuments === 'function')) {
    throw new Error('Invalid Mongoose model provided');
  }

  try {
    const count = await model.countDocuments();
    return count;
  } catch (error) {
    console.error(`Error counting documents in ${model.modelName} collection:`, error);
    throw error;
  }
}
