import { User } from '@prisma/client';
import prisma from '../prisma';

export const createUser = (userData: User) => prisma.user.create({
	data: userData,
});
