import 'log-timestamp';
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import crypto from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config/googleConfig';
import session from 'express-session';
import UserModel from './models/user';

// Import routes and middleware
import { fetch_router } from './routes/fetch';
import { update_router } from './routes/update';
import { search_router } from './routes/search';
import { scrape_router } from './routes/scrape';
import { auth_router } from './routes/auth';
import { comment_router } from 'routes/comments';

import {
  createMongooseConnection,
  closeMongooseConnection,
} from './middleware/mongoConnection';
import { handleCors } from './middleware/cors';
import contentSecurityPolicy from 'middleware/contentPolicy';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare namespace Express {
  interface User {
    id?: string;
  }
}

// Get env varialbes
const CLIENT_ID: string | undefined = config.OAuthCreds.id;
const CLIENT_SECRET: string | undefined = config.OAuthCreds.secret;
const SESSION_SECRET: string | undefined = config.OAuthCreds.session;

// Check if environment variables are defined
if (
  CLIENT_ID === undefined ||
  CLIENT_SECRET === undefined ||
  SESSION_SECRET === undefined
) {
  const undefinedVariables: string[] = [];
  if (CLIENT_ID === undefined) undefinedVariables.push('id');
  if (CLIENT_SECRET === undefined) undefinedVariables.push('secret');
  if (SESSION_SECRET === undefined) undefinedVariables.push('session_secret');

  throw new Error(
    `The following Google OAuth2.0 environment variable(s) are undefined: ${undefinedVariables.join(
      ', '
    )}.`
  );
}

// Express application
const app = express();
const private_api = express();

// Configure session middleware
app.use(
  session({
    secret: SESSION_SECRET, // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Configure Passport for Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ googleId: profile.id });

      // If user doesn't exist creates a new user. (similar to sign up)
      if (!user) {
        const newUser = await UserModel.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
        });
        if (newUser) {
          done(null, newUser);
        }
      } else {
        done(null, user);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Sets the `script-src` directive to
// "'self' 'nonce-e33...'" (or similar)
app.use((req, res, next) => {
  res.locals['cspNonce'] = crypto.randomBytes(32).toString('hex');
  next();
});

// Helmet to protect from expolits
app.use(helmet());
app.use(contentSecurityPolicy());

// Block ddos attempts
const limiter = rateLimit({
  windowMs: 1 * 60 * 100,
  max: 200,
});
app.use(limiter);

// Handling CORS
app.use(handleCors);

// Handle parsing post body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create link to Angular build directory
const distDir = path.join(__dirname, '/dist/eagle-eval');
app.use(express.static(distDir));

// Add routes for fetch
app.use('/api/fetch', fetch_router);

// Add routes for updating mongodb
private_api.use('/api/update', update_router);

// Add routes for searching database
app.use('/api/search', search_router);

// Add routes for scraping review
private_api.use('/api/scrape', scrape_router);

// Add routes for google auth (OAuth2.0)
app.use('/auth', auth_router);

// Add routes for rmp comments
app.use('/api/comments', comment_router);

const port = process.env['PORT'] || 80;
const privatePort = 8080;

app.listen(port, () => {
  createMongooseConnection();
  console.log(`Server listening on port ${port}`);
  // Create process listener to close connection on exit
  closeMongooseConnection();
});

// Private routes only accessible locally
private_api.listen(privatePort, () => {
  createMongooseConnection();
  console.log(`Private API listening on port ${privatePort}`);
  // Create process listener to close connection on exit
  closeMongooseConnection();
});
