import { Cv } from '@prisma/client';
import prisma from '../prisma';

export interface CvData {
	jobId: string;
	userId: string;
	text: string;
}

export default {
	createCv: async (data: CvData): Promise<Cv> => {
		const createdCv = await prisma.cv.create({ data });
		createdCv.generateText();
		return createdCv;
	},
	updateCv: async (id: string, data: CvData): Promise<Cv> => {
		const updatedCv = await prisma.cv.update({
			where: { id },
			data,
		});

		return updatedCv;
	},
};
