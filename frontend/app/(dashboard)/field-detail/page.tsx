"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Droplet } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Loader from "@/app/components/loader";

function FieldDetailsContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const fieldId = searchParams.get("id");
  const [field, setField] = useState<any>(null);
  const [observationHistory, setobservationHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [observations, setObservations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!fieldId) {
      setError("No field ID provided in URL");
      setLoading(false);
      return;
    }

    const fetchFieldDetail = async () => {
      try {
        const res = await fetch(
          `https://shamba-records-xcxg.onrender.com/api/auth/fields/${fieldId}`,
        );
        const result = await res.json();

        if (result.success) {
          setField(result.data);
          setSelectedStage(result.data.currentStage || "GROWING");
        } else {
          setError(result.message || "Field not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load field details.");
      } finally {
        setLoading(false);
      }
    };
    const fetchObservationHistory = async () => {
      try {
        const res = await fetch(
          `https://shamba-records-xcxg.onrender.com/api/auth//fetch-updates/${fieldId}`,
        );
        const result = await res.json();

        if (result.success) {
          setobservationHistory(result.data || []);
        } else {
          setError(result.message || "Failed to load your observations");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchFieldDetail();
    fetchObservationHistory();
  }, [fieldId]);

  const handleDirectUpdate = async () => {
    if (!fieldId || !selectedStage || !observations) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `https://shamba-records-xcxg.onrender.com/api/auth/updates/${fieldId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentname: user?.name,
            stage: selectedStage,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (error || !field)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "Field not found"}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f7f9ff] font-sans">
      <main className="pt-2 pb-12 px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* LEFT - Large Field Image + Status */}
            <div className="col-span-8">
              <div className="relative rounded-3xl overflow-hidden h-[420px] mb-6">
                <img
                  src={
                    field.imageUrl || "https://picsum.photos/id/1028/1200/800"
                  }
                  alt={field.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-5 py-2 rounded-3xl flex items-center gap-x-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Active Crop: {field.cropType}
                </div>

                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-5 py-2 rounded-3xl flex items-center gap-x-2 text-sm">
                  <Droplet className="w-4 h-4" />
                  Soil Moisture: 68%
                </div>

                <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg">
                  <p
                    className="text-black text-4xl font-semibold"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {field.name}
                  </p>
                  <p className="text-black text-lg mt-1 opacity-80">
                    {field.acres} Acres • {field.location}
                  </p>
                </div>
              </div>

              {/* Update Field Status - With Observation Notes */}
              <div className="bg-white rounded-3xl p-8">
                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Update Field Status
                </h2>

                <div className="grid grid-cols-4 gap-3 mb-8">
                  {[
                    "PLANTED",
                    "GROWING",
  
                    "HARVESTED",
                    "AT RISK",
                    "IN PROGRESS",
                  ].map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setSelectedStage(stage)}
                      className={`py-4 rounded-2xl text-sm font-medium border transition-all ${
                        selectedStage === stage
                          ? "border-[#204e2b] bg-[#204e2b] text-white"
                          : "border-[#f1f4fa] hover:border-[#c1c9be]"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>

                {/* Observation Notes Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#525a4f] mb-3">
                    OBSERVATIONS / NOTES
                  </label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Enter notes on soil condition, pest sightings, weather impacts, or any observations..."
                    className="w-full h-32 bg-[#f7f9ff] border border-transparent focus:border-[#204e2b] rounded-3xl p-5 resize-y focus:outline-none text-[#181c20]"
                  />
                </div>

                <button
                  onClick={handleDirectUpdate}
                  disabled={isSubmitting}
                  className="w-full bg-[#204e2b] hover:bg-[#386641] text-white py-4 rounded-2xl font-medium text-base transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting Update..." : "Submit Update"}
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-4 space-y-6">
              {/* Current Stage & Metrics */}
              <div className="bg-white rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#525a4f]">
                      CURRENT STAGE
                    </p>
                    <p
                      className="text-3xl font-semibold text-[#204e2b]"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      {field.currentStage}
                    </p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-3xl text-sm font-medium">
                    WEEK 14
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#525a4f]">HEALTH INDEX</p>
                    <p
                      className="text-4xl font-semibold text-[#181c20]"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      0.92
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#525a4f]">EST. YIELD</p>
                    <p
                      className="text-4xl font-semibold text-[#181c20]"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      184
                    </p>
                    <p className="text-sm text-[#525a4f]">bu/ac</p>
                  </div>
                </div>
              </div>

              {/* Smart Alert */}
              <div className="bg-[#204e2b] text-white rounded-3xl p-8">
                <p className="font-medium text-lg mb-4">Smart Alert</p>
                <p className="text-sm opacity-90 leading-relaxed">
                  Satellite imagery detected low nitrogen levels in the
                  southwest quadrant 48 hours ago. Consider adjustment.
                </p>
                <button className="mt-6 bg-white/20 hover:bg-white/30 transition-colors w-full py-3 rounded-2xl text-sm font-medium">
                  ACKNOWLEDGE
                </button>
              </div>
              {/* Observation History - POPULATED */}
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="font-semibold text-lg"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    Observation History
                  </h3>
                </div>
                {observationHistory.length > 0 ? (
                  <div className="space-y-8">
                    {observationHistory.map((update: any) => (
                      <div
                        key={update._id}
                        className="border-l-4 border-[#204e2b] pl-5"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">
                              {update.agentname || "Agent Update"}
                            </p>
                            <p className="text-xs text-[#525a4f]">
                              {new Date(update.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-3xl">
                            {update.stage}
                          </div>
                        </div>
                        <p className="text-sm text-[#181c20] leading-relaxed">
                          {update.observations}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#525a4f] text-center py-12">
                    No updates yet. Click "Submit Update" to add the first
                    observation.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default function FieldDetail() {
  return (
    <Suspense
      fallback={
       <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <FieldDetailsContent />
    </Suspense>
  );
}
