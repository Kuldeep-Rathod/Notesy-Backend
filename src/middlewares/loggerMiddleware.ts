import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger.js';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    log(`${req.method} ${req.originalUrl}`);
    next();
};

export default loggerMiddleware;
