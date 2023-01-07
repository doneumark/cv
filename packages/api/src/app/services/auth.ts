import * as passport from 'passport';
import * as PassportLocal from 'passport-local';
import { Request } from 'express';
import * as session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { User } from '@prisma/client';
import prisma from '../prisma';

export interface LogInRequest extends Request {
	logIn: (user: string, cb: (err: Error) => void) => void;
}

export interface AuthRequest extends Request {
	user: User,
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

				if (!user.comparePassword(password)) {
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
	process.nextTick(() => cb(null, { id: user.id }));
});

passport.deserializeUser(async (user: { id: string }, cb) => {
	try {
		const foundUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		cb(null, foundUser);
	} catch (err) {
		cb(err, null);
	}
});

export const signIn = passport.authenticate('local');

export const authenticate = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
		return;
	}

	res.status(401).send('Unauthorized');
};

export const addAuthToApp = (app) => {
	app.use(session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		// cookie: { secure: true },
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000, // ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	}));
	app.use(passport.initialize());
	app.use(passport.session());
};
