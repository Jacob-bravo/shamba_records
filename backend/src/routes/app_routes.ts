import { Router } from "express";
import {
  unifiedLogin,
  getDashboardStats,
  getFieldById,
  getFields,
  createField,
  updateField,
  getFieldUpdates,
  createFieldUpdate,
  deleteFieldUpdate,
  deleteField
} from "../controllers/app";

const router = Router();
router.post("/login", unifiedLogin);
router.get("/dashboard/stats", getDashboardStats);
router.get("/fields", getFields);
router.get("/fields/:id", getFieldById);
router.post("/fields", createField);
router.put("/fields/:id", updateField);
router.get("/fetch-updates/:id", getFieldUpdates);
router.post("/updates/:id", createFieldUpdate);
router.delete("/updates/delete/:fieldId", deleteFieldUpdate);
router.delete("/delete-field/:id", deleteField);

export default router;
