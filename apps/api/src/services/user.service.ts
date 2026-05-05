import { prisma } from "@p2p/database";
import { UpdateProfileInput, VerifyProfileInput } from "@p2p/types";
import { NotFoundError } from "@p2p/shared";

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  static async updateProfile(userId: string, _data: UpdateProfileInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        // Placeholder: In a real app, update firstName/lastName from _data
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verificationStatus: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  static async verifyProfile(userId: string, _data: VerifyProfileInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    // In a real app, we'd store the documentUrl securely and maybe trigger a manual review.
    // Here we just transition status to PENDING.
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "PENDING",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verificationStatus: true,
      },
    });

    return updatedUser;
  }

  static async getPublicProfile(targetId: string) {
    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        firstName: true,
        role: true,
        verificationStatus: true,
        createdAt: true,
        // Public profile excludes email, lastName (or just exposes initial), etc.
      },
    });

    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}
