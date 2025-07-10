import { Router } from "express";
import postRoutes from "./postRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);

export default router;
