import * as express from 'express';
import { UserProject } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedUserProjectData = (data: UserProject) => {
	const {
		title, description, endsAtDay, endsAtMonth,
		endsAtYear, startsAtDay, startsAtMonth, startsAtYear,
	} = data;
	return {
		title,
		description,
		endsAtDay,
		endsAtMonth,
		endsAtYear,
		startsAtDay,
		startsAtMonth,
		startsAtYear,
	};
};

const UserProjectRouter = express.Router();

UserProjectRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedUserProjectData(req.body);

		const newProject = await prisma.userProject.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(newProject);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserProjectRouter.get('/:userProjectId', authenticate, async (req: AuthRequest, res) => {
	const { userProjectId } = req.params;

	try {
		const project = await prisma.userProject.findUnique({
			where: {
				id: userProjectId,
			},
		});

		if (!project || project.userId !== req.user.id) {
			throw new Error('Project not found');
		}

		res.status(200).send(project);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserProjectRouter.post('/:userProjectId', authenticate, async (req: AuthRequest, res) => {
	const { userProjectId } = req.params;

	try {
		const project = await prisma.userProject.findUnique({
			where: {
				id: userProjectId,
			},
		});

		if (!project || project.userId !== req.user.id) {
			throw new Error('Project not found');
		}

		const permittedData = getPermittedUserProjectData(project);

		const duplicatedProject = await prisma.userProject.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(duplicatedProject);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserProjectRouter.put('/:userProjectId', authenticate, async (req: AuthRequest, res) => {
	const { userProjectId } = req.params;

	try {
		const project = await prisma.userProject.findUnique({
			where: {
				id: userProjectId,
			},
		});

		if (!project || project.userId !== req.user.id) {
			throw new Error('Project not found');
		}

		const permittedData = getPermittedUserProjectData(req.body);

		const updatedProject = await prisma.userProject.update({
			where: {
				id: userProjectId,
			},
			data: permittedData,
		});

		res.status(200).send(updatedProject);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

UserProjectRouter.delete('/:userProjectId', authenticate, async (req: AuthRequest, res) => {
	const { userProjectId } = req.params;

	try {
		const project = await prisma.userProject.findUnique({
			where: {
				id: userProjectId,
			},
		});

		if (!project || project.userId !== req.user.id) {
			throw new Error('Project not found');
		}

		const deletedProject = await prisma.userProject.delete({
			where: {
				id: userProjectId,
			},
		});

		res.status(200).send(deletedProject);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default UserProjectRouter;
