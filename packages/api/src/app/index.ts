/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';
import prisma from './prisma';
import { signIn, addAuthToApp, AuthRequest } from './services/auth';
import openAi from './services/openAi';

export const run = () => {
	const app = express.default();

	app.set('trust proxy', 1); // trust first proxy

	app.use('/assets', express.static(path.join(__dirname, 'assets')));
	app.use(express.json());

	addAuthToApp(app);

	app.get('/api/ping', async (req, res) => {
		try {
			res.status(200).send('pong');
		} catch (err) {
			res.status(400).send(err.message);
		}
	});

	app.post('/login', async (req: AuthRequest, res, next) => {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				throw new Error('Missing email or password');
			}

			const user = await signIn(req, res, next);
			res.status(200).send(user);
		} catch (err) {
			res.status(400).send(err.message);
		}
	});

	app.post('/api/sync-from-linkedin', async (req: AuthRequest, res) => {
		try {
			const { linkedinUsername } = req.user;
			if (!linkedinUsername) {
				throw new Error('Username is required');
			}

			await req.user.syncFromLinkedin();

			res.status(200).send();
		} catch (err) {
			res.status(400).send(err.message);
		}
	});

	app.post('/api/job', async (req, res) => {
		try {
			const { title, description } = req.body;

			const job = await prisma.job.create({
				data: {
					title,
					description,
					userId: 'asdsa',
				},
			});

			res.status(200).send(job);
		} catch (err) {
			res.status(400).send(err.message);
		}
	});

	app.post('/api/cv', async (req, res) => {
		try {
			const { linkedinData, jobData } = req.body;
			const prompt = `for this job description: ${jobData}\n\nthis is my details in  json format: ${JSON.stringify(
				linkedinData,
			)}\n\nwrite me a CV in html:`;
			// console.log(prompt);
			const completion = await openAi.createCompletion({
				model: 'text-davinci-003',
				prompt,
			// temperature: 0.9,
			});

			res.status(200).send(completion);
		} catch (err) {
			res.status(400).send(err.message);
		}
	});

	const port = process.env.port || 3333;
	const server = app.listen(port, () => {
		console.log(`Listening at http://localhost:${port}/api`);
	});

	server.on('error', console.error);
};
