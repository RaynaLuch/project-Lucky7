import {
  logoutUser,
  registerUser,
  loginUser,
  refreshUsersSession,
} from '../services/auth.js';

import { UserCollection } from '../db/models/user.js';

const ONE_DAY = 24 * 60 * 60 * 1000;

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully register user!',
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
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
  const { sessionId, refreshToken } = req.body;
  if (!sessionId || !refreshToken) {
    return res
      .status(400)
      .json({ status: 400, message: 'sessionId & refreshToken required' });
  }
  const session = await refreshUsersSession({ sessionId, refreshToken });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
