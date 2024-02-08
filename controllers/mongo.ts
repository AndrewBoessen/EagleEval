import mongoose, { ConnectOptions } from 'mongoose';
import { config } from '../config/mongoConfig';

// Access MongoDB username and password
const username: string | undefined = config.mongodb.username;
const password: string | undefined = config.mongodb.password;
const databaseURL: string | undefined = config.mongodb.databaseURL;

// Check if environment variables are defined
if (
  username === undefined ||
  password === undefined ||
  databaseURL === undefined
) {
  const undefinedVariables: string[] = [];
  if (username === undefined) undefinedVariables.push('username');
  if (password === undefined) undefinedVariables.push('password');
  if (databaseURL === undefined) undefinedVariables.push('databaseURL');

  throw new Error(
    `The following MongoDB environment variable(s) are undefined: ${undefinedVariables.join(
      ', '
    )}.`
  );
}

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} A Promise that resolves when the connection is successful.
 */
export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(
      databaseURL as string,
      {
        user: username,
        pass: password,
        dbName: 'prod',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

/**
 * Closes the connection to the MongoDB database.
 * @returns {Promise<void>} A Promise that resolves when the connection is closed.
 */
export async function closeDatabaseConnection(): Promise<void> {
  console.log('Mongoose connection closing.');
  // Close the Mongoose connection
  await mongoose.connection.close();
}
