/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/linkedin', async (req, res) => {
	try {
		const { username } = req.query;
		if (!username) {
			throw new Error('Username is required');
		}

		const response = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
			params: { url: `https://www.linkedin.com/in/${username}` },
			headers: { Authorization: 'Bearer 8UUJZwy4522bmjMzXRK7Rg' },
		});

		const { data } = response;
		res.status(200).send(data);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
