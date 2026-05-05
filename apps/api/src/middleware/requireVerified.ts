import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "@p2p/shared";
import { prisma } from "@p2p/database";

export const requireVerified = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { verificationStatus: true },
  });

  if (!user || user.verificationStatus !== "VERIFIED") {
    throw new ForbiddenError(
      "You must be a verified user to perform this action",
    );
  }

  next();
};
