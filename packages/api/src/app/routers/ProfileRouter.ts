import * as express from 'express';
import { Profile } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedProfileData = (data: Profile) => {
	const {
		headline, occupation, summary,
	} = data;
	return {
		headline,
		occupation,
		summary,
	};
};

const ProfileRouter = express.Router();

ProfileRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	const { profileId } = req.params;

	try {
		const profile = await prisma.profile.findUnique({
			where: {
				id: profileId,
			},
		});

		if (!profile || profile.userId !== req.user.id) {
			throw new Error('Profile not found');
		}

		res.status(200).send(profile);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ProfileRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedProfileData(req.body);

		const newProfile = await prisma.profile.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(newProfile);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ProfileRouter.put('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const profile = await prisma.profile.findUnique({
			where: {
				id: req.user.id,
			},
		});

		if (!profile) {
			throw new Error('Profile not found');
		}

		const permittedData = getPermittedProfileData(req.body);

		const updatedProfile = await prisma.profile.update({
			where: {
				id: profile.id,
			},
			data: permittedData,
		});

		res.status(200).send(updatedProfile);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default ProfileRouter;
