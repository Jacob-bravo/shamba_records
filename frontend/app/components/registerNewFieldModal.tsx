"use client";

import { X, Upload } from "lucide-react";
import { useState } from "react";

interface RegisterNewFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegisterNewFieldModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterNewFieldModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    cropType: "",
    plantingDate: "",
    acres: "",
    location: "",
    boundaryData: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const agents = [
    { id: "69e61799202bf83d82a6f88d",in:"JD", name: "John Doe", color: "bg-blue-100 text-blue-700" },
    { id: "69e61798202bf83d82a6f889",in:"SR", name: "Sarah Reed", color: "bg-amber-100 text-amber-700" },
    { id: "69e61799202bf83d82a6f88b",in:"MK", name: "Mike Kade", color: "bg-emerald-100 text-emerald-700" },
  ];

  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const toggleAgent = (id: string) => {
    if (selectedAgents.includes(id)) {
      setSelectedAgents(selectedAgents.filter((agentId) => agentId !== id));
    } else {
      setSelectedAgents([...selectedAgents, id]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.cropType ||
      !formData.plantingDate ||
      !formData.acres ||
      !formData.location
    ) {
      setError("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/fields`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            cropType: formData.cropType,
            plantingDate: formData.plantingDate,
            acres: parseFloat(formData.acres),
            location: formData.location,
            assignedAgents: selectedAgents[0],
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        alert("Field registered successfully!");
        if (onSuccess) onSuccess();
        onClose();

        setFormData({
          name: "",
          cropType: "",
          plantingDate: "",
          acres: "",
          location: "",
          boundaryData: "",
        });
        setSelectedAgents([]);
      } else {
        setError(result.message || "Failed to create field");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-[#204e2b] text-white px-8 py-6 flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-semibold"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Register New Field
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Define land boundaries and crop allocation
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-2xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-8">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Field Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#525a4f] font-medium mb-2">
              FIELD NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. West Perimeter 04"
              className="w-full bg-[#f1f4fa] border-0 focus:ring-2 focus:ring-[#204e2b] rounded-2xl px-5 py-4 text-[#181c20]"
            />
          </div>

          {/* Crop Variety + Planting Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#525a4f] font-medium mb-2">
                CROP VARIETY
              </label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleInputChange}
                className="w-full bg-[#f1f4fa] border-0 focus:ring-2 focus:ring-[#204e2b] rounded-2xl px-5 py-4 text-[#181c20]"
              >
                <option value="">Select Type</option>
                <option value="Winter Wheat">Winter Wheat</option>
                <option value="Corn">Corn</option>
                <option value="Soybean">Soybean</option>
                <option value="Apples">Apples</option>
                <option value="Barley">Barley</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#525a4f] font-medium mb-2">
                PLANTING DATE
              </label>
              <input
                type="date"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleInputChange}
                className="w-full bg-[#f1f4fa] border-0 focus:ring-2 focus:ring-[#204e2b] rounded-2xl px-5 py-4 text-[#181c20]"
              />
            </div>
          </div>

          {/* Acres + Location */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#525a4f] font-medium mb-2">
                ACRES
              </label>
              <input
                type="number"
                name="acres"
                value={formData.acres}
                onChange={handleInputChange}
                placeholder="e.g. 42.5"
                className="w-full bg-[#f1f4fa] border-0 focus:ring-2 focus:ring-[#204e2b] rounded-2xl px-5 py-4 text-[#181c20]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#525a4f] font-medium mb-2">
                LOCATION
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Willamette Valley, OR"
                className="w-full bg-[#f1f4fa] border-0 focus:ring-2 focus:ring-[#204e2b] rounded-2xl px-5 py-4 text-[#181c20]"
              />
            </div>
          </div>

          {/* Assign Lead Agent */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#525a4f] font-medium mb-3">
              ASSIGN LEAD AGENT
            </label>
            <div className="flex flex-wrap gap-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`px-5 py-2.5 rounded-3xl text-sm font-medium transition-all flex items-center gap-x-2 ${
                    selectedAgents.includes(agent.id)
                      ? "bg-[#204e2b] text-white shadow-sm"
                      : `${agent.color} hover:bg-white hover:shadow-sm`
                  }`}
                >
                  <span className="font-mono text-xs">{agent.in}</span>
                  {agent.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#f1f4fa] px-8 py-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3.5 text-sm font-medium text-[#181c20] hover:bg-[#f1f4fa] rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3.5 bg-[#204e2b] hover:bg-[#386641] text-white font-medium rounded-2xl transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Creating..." : "Confirm Creation"}
          </button>
        </div>
      </div>
    </div>
  );
}
