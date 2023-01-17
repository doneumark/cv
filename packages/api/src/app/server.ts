/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';
import AuthRouter from './routers/AuthRouter';
import UserRouter from './routers/UserRouter';
import ProfileRouter from './routers/ProfileRouter';
import EducationRouter from './routers/EducationRouter';
import ExperienceRouter from './routers/ExperienceRouter';
import ProjectRouter from './routers/ProjectRouter';
import VolunteerWorkRouter from './routers/VolunteerWorkRouter';
import JobRouter from './routers/JobRouter';
import CvRouter from './routers/CvRouter';
import { addAuthToApp } from './services/auth';

export const run = () => {
	const app = express();

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

	app.use('/api', AuthRouter);
	app.use('/api/user', UserRouter);
	app.use('/api/profile', ProfileRouter);
	app.use('/api/projects', ProjectRouter);
	app.use('/api/educations', EducationRouter);
	app.use('/api/experiences', ExperienceRouter);
	app.use('/api/volunteer-works', VolunteerWorkRouter);
	app.use('/api/jobs', JobRouter);
	app.use('/api/cvs', CvRouter);

	const port = process.env.port || 3333;
	const server = app.listen(port, () => {
		console.log(`Listening at http://localhost:${port}/api`);
	});

	server.on('error', console.error);
};
