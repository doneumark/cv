import bcrypt from 'bcryptjs';

export const generateSalt = (): Promise<string> => bcrypt.genSalt(10);

export const hash = async (text: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	const encrypted = await bcrypt.hash(text, salt);
	return encrypted;
};

// Function to compare hashed password's
export const compare = async (hash: string, pass: string) => bcrypt.compare(hash, pass);
