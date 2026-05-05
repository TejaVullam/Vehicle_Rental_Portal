export {}; // Make this a module

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      id?: string; // from pino-http
    }
  }
}
