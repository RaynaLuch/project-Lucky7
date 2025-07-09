import {
  logoutUser,
  registerUser,
  loginUser,
  refreshUsersSession,
  createSession,
} from '../services/auth.js';

import { UserCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

const ONE_DAY = 24 * 60 * 60 * 1000;

export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    const session = await SessionsCollection.create({
      userId: user._id,
      ...createSession(),
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered user!',
      data: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        sessionId: session._id,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  const user = await UserCollection.findById(session.userId);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      sessionId: session._id,
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.body;
    if (!sessionId || !refreshToken) {
      return res
        .status(400)
        .json({ status: 400, message: 'sessionId & refreshToken required' });
    }

    const session = await refreshUsersSession({ sessionId, refreshToken });

    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const user = await UserCollection.findById(session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
