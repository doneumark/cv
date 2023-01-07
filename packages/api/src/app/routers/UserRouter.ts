import * as express from 'express';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const UserRouter = express.Router();

UserRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const profile = await prisma.user.findUnique({
			where: { id: req.user.id },
		});

		res.status(200).send(profile);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserRouter.post('/linkedin', authenticate, async (req: AuthRequest, res) => {
	try {
		const { linkedinUsername } = req.user;
		if (!linkedinUsername) {
			throw new Error('Linkedin username is required');
		}

		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
		});

		await user.syncFromLinkedin();

		res.status(200).send();
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default UserRouter;
