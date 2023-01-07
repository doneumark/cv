import { User } from '@prisma/client';
import prisma from '../prisma';

export const register = (data) => {
	prisma.user.create({
		data,
	});
};

export const changePassword = (data) => {
	prisma.user.create({
		data,
	});
};
