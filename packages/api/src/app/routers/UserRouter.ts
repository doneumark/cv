import * as express from 'express';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const UserRouter = express.Router();

UserRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
		});

		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserRouter.get('/counts', authenticate, async (req: AuthRequest, res) => {
	try {
		const userCounts = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: {
				_count: {
					select: {
						educations: true,
						experiences: true,
						projects: true,
						volunteerWorks: true,
						jobs: true,
					},
				},
			},
		});

		res.status(200).send(userCounts._count);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserRouter.put('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const {
			email, fullName, password, linkedinUsername,
		} = req.body;

		const user = await prisma.user.update({
			where: { id: req.user.id },
			data: {
				email,
				fullName,
				password,
				linkedinUsername,
			},
		});

		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserRouter.post('/linkedin', authenticate, async (req: AuthRequest, res) => {
	try {
		const { linkedinUsername } = req.body;
		if (!linkedinUsername) {
			throw new Error('Linkedin username is required');
		}

		const user = await prisma.user.update({
			where: { id: req.user.id },
			data: {
				linkedinUsername,
			},
		});

		await user.syncFromLinkedin();
		res.status(200).send();
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default UserRouter;
