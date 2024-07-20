import { Router, Request } from "express";
import multer from "multer";
import path from "path";

import { AuthController } from "../controllers";
import { authenticateJwt, validateBodyParams } from "../middlewares";

const storage = multer.diskStorage({
  destination: "public/Images",
  filename: function (req: Request, file, cb) {
    // Generate a unique filename
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"));
    }
  },
});

const router = Router();
const authController: AuthController = new AuthController();

router.post("/register", authController.register);

router.get("/authenticate", authenticateJwt, authController.authenticate);

// router.post("/getStoreProducts", authController.getStoreProducts);

router.post("/login", authController.login);

export { router as auth };
