import * as express from 'express';
import { authenticate, AuthRequest } from '../services/auth';
import openAi from '../services/openAi';

const CvRouter = express.Router();

CvRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const { linkedinData, jobData } = req.body;
		const prompt = `for this job description: ${jobData}\n\nthis is my details in  json format: ${JSON.stringify(
			linkedinData,
		)}\n\nwrite me a CV in html:`;
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

export default CvRouter;
