import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || 'collabboard_secret_jwt_key_2026_assignment02';
export const NODE_ENV = process.env.NODE_ENV || 'development';
