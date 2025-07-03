import { Request, Response } from 'express';
import { identifyService } from '../services/contactService';

export const identifyContact = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;
    const result = await identifyService(email, phoneNumber);
    res.status(200).json({ contact: result });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};