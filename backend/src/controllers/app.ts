// controllers/auth.controller.ts
import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response.util";
import { comparePassword } from "../utils/hash.util";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service";
import User from "../models/user";
import Field from "../models/field";
import FieldUpdate from "../models/fieldupdate";
import FieldAssignment from "../models/fieldassignment";

export const unifiedLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, "Email and password are required", 400);
      return;
    }

    const lowerEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: lowerEmail }).select("+password");

    if (!user) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    if (user.role === "ADMIN" && user.isActive === false) {
      sendError(res, "Your account has been deactivated", 403);
      return;
    }


    const isMatch = await comparePassword(password, user.password!); 
    if (!isMatch) {
      sendError(res, "Invalid email or password", 401);
      return;
    }


    user.lastLoginAt = new Date();
    await user.save();

    const payload: any = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || null,
    };

    const redirectUrl =
      user.role === "ADMIN" ? "/dashboard" : "/agent-dashboard";

    sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: userResponse,
        redirectUrl,
      },
      "Login successful",
      200,
    );
  } catch (err: any) {
    console.error("Login Error:", err);
    sendError(res, "Login failed. Please try again.", 500);
  }
};
export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {

    const totalFields = await Field.countDocuments();

    const activeFields = await Field.countDocuments({
      currentStage: { $in: ["GROWING", "READY"] },
    });

    const atRiskFields = await Field.countDocuments({
      currentStage: "AT RISK",
    });

    const harvestedFields = await Field.countDocuments({
      currentStage: "HARVESTED",
    });


    const plantedCount = await Field.countDocuments({
      currentStage: "PLANTED",
    });
    const growingCount = await Field.countDocuments({
      currentStage: "GROWING",
    });
    const readyCount = await Field.countDocuments({ currentStage: "HARVESTED" });
    const harvestedCount = harvestedFields;

    const lifecycleDistribution = [
      {
        stage: "Planted",
        count: plantedCount,
        percentage: Math.round((plantedCount / totalFields) * 100) || 0,
      },
      {
        stage: "Growing",
        count: growingCount,
        percentage: Math.round((growingCount / totalFields) * 100) || 0,
      },
      {
        stage: "Ready for Harvest",
        count: readyCount,
        percentage: Math.round((readyCount / totalFields) * 100) || 0,
      },
    ];

    const recentUpdates = await FieldUpdate.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("field", "name")
      .populate("user", "name");

    const activeAgents = await User.find({ role: "AGENT" })
      .select("name avatar")
      .limit(5);

    const agentsWithCount = await Promise.all(
      activeAgents.map(async (agent) => {
        const assignedCount = await FieldAssignment.countDocuments({
          user: agent._id,
        });
        return {
          ...agent.toObject(),
          assignedFields: assignedCount,
        };
      }),
    );

    sendSuccess(res, {
      stats: {
        totalFields,
        activeFields,
        atRisk: atRiskFields,
        harvested: harvestedFields,
      },
      lifecycleDistribution,
      recentUpdates,
      activeAgents: agentsWithCount,
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    sendError(res, "Failed to fetch dashboard statistics", 500);
  }
};
export const getFields = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, userId } = req.query;

    let fields;

    if (role === "agent" && userId) {

      const assignments = await FieldAssignment.find({ user: userId }).populate(
        "field",
      );
      fields = assignments.map((assignment: any) => assignment.field);
    } else {

      fields = await Field.find({}).sort({ createdAt: -1 });
    }

    sendSuccess(res, fields, "Fields fetched successfully");
  } catch (error: any) {
    console.error("Get Fields Error:", error);
    sendError(res, "Failed to fetch fields", 500);
  }
};
export const createField = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      cropType,
      plantingDate,
      acres,
      location,
      assignedAgents,
      ...rest
    } = req.body;

    if (!name || !cropType || !plantingDate || !acres || !location) {
      sendError(
        res,
        "Name, cropType, plantingDate, acres, and location are required",
        400,
      );
      return;
    }

    const newField = await Field.create({
      name,
      cropType,
      plantingDate: new Date(plantingDate),
      acres,
      location,
      ...rest,
    });
    await FieldAssignment.create({
      field: newField._id,
      user: assignedAgents,
      assignedAt: new Date(),
    });
    sendSuccess(res, newField._id, "Field created successfully", 201);
  } catch (error: any) {
    console.error("Create Field Error:", error);
    sendError(res, error.message || "Failed to create field", 500);
  }
};
export const getFieldById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      sendError(res, "Field not found", 404);
      return;
    }

    sendSuccess(res, field, "Field fetched successfully");
  } catch (error: any) {
    console.error("Get Field Error:", error);
    sendError(res, "Failed to fetch field", 500);
  }
};
export const updateField = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updatedField = await Field.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedField) {
      sendError(res, "Field not found", 404);
      return;
    }

    sendSuccess(res, updatedField, "Field updated successfully");
  } catch (error: any) {
    console.error("Update Field Error:", error);
    sendError(res, error.message || "Failed to update field", 500);
  }
};
export const getFieldUpdates = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const updates = await FieldUpdate.find({ field: id })
      .sort({ createdAt: -1 })
      .populate("user", "name avatar")
      .populate("field", "name");

    sendSuccess(res, updates, "Field updates fetched successfully");
  } catch (error: any) {
    console.error("Get Field Updates Error:", error);
    sendError(res, "Failed to fetch field updates", 500);
  }
};
export const createFieldUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { stage, observations, userId, agentname } = req.body;

    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    const newUpdate = await FieldUpdate.create({
      field: id,
      user: userId,
      agentname,
      stage: stage || undefined,
      observations: observations || undefined,
    });

    if (stage) {
      await Field.findByIdAndUpdate(id, { currentStage: stage });
    }

    sendSuccess(res, newUpdate, "Observation note added successfully", 201);
  } catch (error: any) {
    console.error("Create Field Update Error:", error);
    sendError(res, error.message || "Failed to add observation", 500);
  }
};
export const deleteFieldUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fieldId } = req.params;
    if (!fieldId) {
      sendError(res, "Field ID is required", 400);
      return;
    }

    const result = await FieldUpdate.findByIdAndDelete(fieldId);

    if (!result) {
      sendSuccess(res, null, "No updates found to delete", 200);
      return;
    }

    sendSuccess(res, null, "Observation Deleted");
  } catch (error: any) {
    console.error("Delete  Update Error:", error);
    sendError(
      res,
      error.message || "Failed to delete observation history",
      500,
    );
  }
};
export const deleteField = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendError(res, "Field ID is required", 400);
      return;
    }
    const field = await Field.findById(id);
    if (!field) {
      sendError(res, "Field not found", 404);
      return;
    }
    await Field.findByIdAndDelete(id);
    await FieldAssignment.deleteMany({ field: id });
    await FieldUpdate.deleteMany({ field: id });

    sendSuccess(res, null, "Field and all related data deleted successfully");
  } catch (error: any) {
    console.error("Delete Field Error:", error);
    sendError(res, error.message || "Failed to delete field", 500);
  }
};
