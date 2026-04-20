"use client";

import { X, Calendar } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface FieldUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: any;
  isAgent: boolean;
  onUpdateSuccess?: () => void;
}

export default function FieldUpdateModal({
  isOpen,
  onClose,
  field,
  isAgent,
  onUpdateSuccess,
}: FieldUpdateModalProps) {
  const [currentStage, setCurrentStage] = useState(
    field?.currentStage || "GROWING",
  );
  const [observations, setObservations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const stages = ["PLANTED", "GROWING", "HARVESTED", "AT RISK", "IN PROGRESS"];

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!field?._id) {
      setError("Field ID is missing");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/fields/${field._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentStage,
            observations: observations.trim() || undefined,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        if (onUpdateSuccess) onUpdateSuccess();
        handleDirectUpdate();
        onClose();
      } else {
        setError(result.message || "Failed to update field");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDirectUpdate = async () => {
    if (!field?._id || !currentStage || !observations) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/updates/${field?._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentname: user?.name,
            stage: currentStage,
            observations: observations,
            userId: user?.id,
          }),
        },
      );

      const result = await res.json();
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.message || "Failed to update");
      }
    } catch (err) {
      alert("Failed to submit update");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteField = async (fieldId: string, fieldName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${fieldName}"?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-field/${fieldId}`,
        {
          method: "DELETE",
        },
      );

      const result = await res.json();

      if (result.success) {
        alert("Field deleted successfully");
        window.location.reload();
      } else {
        alert(result.message || "Failed to delete field");
      }
    } catch (err) {
      alert("Failed to delete field");
    }
  };

  if (!isOpen || !field) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#204e2b] text-white px-8 py-6 flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-semibold"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Field Update
            </h2>
            <p className="text-white/80 mt-1">{field.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-2xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Current Info */}
          <div className="grid grid-cols-3 gap-6 bg-[#f7f9ff] p-6 rounded-2xl">
            <div>
              <p className="text-xs text-[#525a4f]">CROP</p>
              <p className="font-medium text-[#181c20]">{field.cropType}</p>
            </div>
            <div>
              <p className="text-xs text-[#525a4f]">PLANTED</p>
              <p className="font-medium text-[#181c20] flex items-center gap-x-1">
                <Calendar className="w-4 h-4" />{" "}
                {formatDate(field.plantingDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#525a4f]">ACRES</p>
              <p className="font-medium text-[#181c20]">{field.acres}</p>
            </div>
          </div>

          {/* Stage Selection */}
          <div>
            <label className="block text-sm font-medium text-[#525a4f] mb-3">
              CURRENT STAGE
            </label>
            <div className="grid grid-cols-4 gap-3">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setCurrentStage(stage)}
                  className={`py-4 rounded-2xl text-sm font-medium border transition-all ${
                    currentStage === stage
                      ? "bg-[#204e2b] text-white border-[#204e2b]"
                      : "border-[#f1f4fa] hover:border-[#c1c9be] text-[#181c20]"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-sm font-medium text-[#525a4f] mb-3">
              {isAgent ? "OBSERVATIONS / NOTES" : "ADD UPDATE NOTE"}
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Enter notes on soil condition, pest sightings, weather impacts, or any observations..."
              className="w-full h-32 bg-[#f7f9ff] border border-transparent focus:border-[#204e2b] rounded-3xl p-5 resize-y focus:outline-none text-[#181c20]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#f1f4fa] px-8 py-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3.5 text-sm font-medium text-[#181c20] hover:bg-[#f1f4fa] rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteField(field._id, field.name)}
            className="px-10 py-3.5 bg-[#204e2b] hover:bg-[#386641] text-white font-medium rounded-2xl transition-all disabled:opacity-70"
          >
            Delete Field
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3.5 bg-[#204e2b] hover:bg-[#386641] text-white font-medium rounded-2xl transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
