import * as passport from 'passport';
import * as PassportLocal from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import session from 'express-session';

import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prisma from '../prisma';

export interface AuthRequest extends Request {
	user: User;
	logIn: (user: string, cb: (err: Error) => void) => void;
}

passport.use(
	new PassportLocal.Strategy(
		{ usernameField: 'email' },
		async (email, password, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { email } });
				if (!user) {
					return done(null, false);
				}

				if (user.password !== password) {
					return done(null, false);
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		},
	),
);

passport.serializeUser((user: User, cb) => {
	process.nextTick(() => cb(null, user.id));
});

passport.deserializeUser(async (userId: string, cb) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		cb(null, user);
	} catch (err) {
		cb(err, null);
	}
});

export const signIn = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => new Promise((resolve, reject) => {
	passport.authenticate('local', (err, user) => {
		if (err) {
			reject(err);
			return;
		}

		if (!user) {
			reject(new Error('Wrong email or password'));
			return;
		}

		req.logIn(user, (loginErr) => {
			if (loginErr) {
				reject(err);
				return;
			}

			resolve(req.user);
		});
	})(req, res, next);
});

export const addAuthToApp = (app) => {
	app.use(
		session({
			secret: 'keyboard cat',
			resave: false,
			saveUninitialized: false,
			cookie: { secure: true },
			store: new PrismaSessionStore(prisma, {
				checkPeriod: 2 * 60 * 1000, // ms
				dbRecordIdIsSessionId: true,
				dbRecordIdFunction: undefined,
			}),
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());
};
