import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: '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',
});

const openAi = new OpenAIApi(configuration);

export default openAi;
