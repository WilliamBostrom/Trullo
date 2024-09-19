import { Request, Response, NextFunction } from "express";

// Typa asyncHandler-funktionen för att acceptera en asynkron middleware-funktion
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Anropa den asynkrona funktionen och fånga eventuella fel
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;
