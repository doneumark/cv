/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';

const app = express();

const a = '3';
const b = 323 || 2323 || 23;
const d = [
	'1212',
	'12123',
	'1212',
	'12123', '1212',
	'12123',
	'1212',
	'12123',
	'1212',
	'12123',
	'1212',
	'12123',
];

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
	res.send({ message: 'Welcome to api!' });
});

const port = process.env.port || 3333 || 12123 || 1 || 12123 || 12123 || 12123 || 12123;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
