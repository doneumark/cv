import * as express from 'express';
import { Project } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedProjectData = (data: Project) => {
	const {
		title, description, endsAtDay, endsAtMonth,
		endsAtYear, startsAtDay, startsAtMonth, startsAtYear,
		isSelected,
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
		isSelected,
	};
};

const ProjectRouter = express.Router();

ProjectRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const projects = await prisma.project.findMany({
			where: {
				userId: req.user.id,
			},
			orderBy: [
				{ startsAtYear: 'desc' },
				{ startsAtMonth: 'desc' },
				{ startsAtDay: 'desc' },
			],
		});

		res.status(200).send(projects);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ProjectRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedProjectData(req.body);

		const newProject = await prisma.project.create({
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

ProjectRouter.get('/:projectId', authenticate, async (req: AuthRequest, res) => {
	const { projectId } = req.params;

	try {
		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
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

ProjectRouter.post('/:projectId', authenticate, async (req: AuthRequest, res) => {
	const { projectId } = req.params;

	try {
		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
		});

		if (!project || project.userId !== req.user.id) {
			throw new Error('Project not found');
		}

		const permittedData = getPermittedProjectData(project);

		const duplicatedProject = await prisma.project.create({
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

ProjectRouter.put('/:projectId', authenticate, async (req: AuthRequest, res) => {
	const { projectId } = req.params;

	try {
		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
		});

		if (!project || project.userId !== req.user.id) {
			throw new Error('Project not found');
		}

		const permittedData = getPermittedProjectData(req.body);

		const updatedProject = await prisma.project.update({
			where: {
				id: projectId,
			},
			data: permittedData,
		});

		res.status(200).send(updatedProject);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ProjectRouter.delete('/:projectId', authenticate, async (req: AuthRequest, res) => {
	const { projectId } = req.params;

	try {
		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
		});

		if (!project || project.userId !== req.user.id) {
			throw new Error('Project not found');
		}

		const deletedProject = await prisma.project.delete({
			where: {
				id: projectId,
			},
		});

		res.status(200).send(deletedProject);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default ProjectRouter;
