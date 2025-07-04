import createHttpError from 'http-errors';

import { SessionsCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

const extractToken = (req) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) return null;

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;

  return token;
};

export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next(createHttpError(401, 'Authorization token required'));
    }

    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, 'Access token expired'));
    }

    const user = await UserCollection.findById(session.userId);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, 'Authentication error'));
  }
};

export const identifyUser = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) return next();

    if (new Date() > new Date(session.accessTokenValidUntil)) return next();

    const user = await UserCollection.findById(session.userId);
    if (!user) return next();

    req.user = user;
    next();
  } catch {
    next();
  }
};
