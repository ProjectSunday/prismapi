import { randomBytes } from 'crypto'

export const generateToken = () => {
	return randomBytes(16).toString('hex');
}
