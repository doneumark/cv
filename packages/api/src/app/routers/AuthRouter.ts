import * as express from 'express';
import { signIn, authenticate } from '../services/auth';
import prisma from '../prisma';

const AuthRouter = express.Router();

AuthRouter.post('/signup', async (req, res) => {
	try {
		const user = await prisma.user.create({
			data: req.body,
		});

		req.login(user, (err) => {
			if (err) {
				res.status(400).send(err.message);
				return;
			}

			res.status(200).send(user);
		});
	} catch (err) {
		res.status(400).send(err.message);
	}
});

AuthRouter.post('/login', signIn, (req, res) => {
	try {
		res.status(200).send(req.user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

AuthRouter.get('/me', authenticate, async (req, res) => {
	try {
		res.status(200).send(req.user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

AuthRouter.post('/logout', authenticate, (req, res) => {
	try {
		req.logout((err) => {
			if (err) {
				res.status(400).send(err.message);
				return;
			}

			res.status(200).send();
		});
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default AuthRouter;
