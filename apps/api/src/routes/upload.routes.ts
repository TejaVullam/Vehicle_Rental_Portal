import { Router, Request, Response } from "express";
import { upload } from "../middleware/upload";
import { requireAuth } from "../middleware/requireAuth";
import { requireVerified } from "../middleware/requireVerified";

const router: Router = Router();

// Endpoint for uploading single or multiple vehicle images
// We require users to be authenticated and verified before they can upload vehicle images
router.post(
  "/",
  requireAuth,
  requireVerified,
  upload.array("media", 5),
  (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const files = req.files as Express.Multer.File[];

    // Assuming the API is running on localhost:3001
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const uploadedFiles = files.map((file) => ({
      url: `${baseUrl}/uploads/${file.filename}`,
      type: file.mimetype,
      filename: file.filename,
    }));

    res.status(201).json({
      success: true,
      data: uploadedFiles,
    });
  },
);

export { router as uploadRouter };
