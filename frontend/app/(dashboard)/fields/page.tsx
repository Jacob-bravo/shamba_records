"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, MapPin, Calendar, ArrowRight } from "lucide-react";
import RegisterNewFieldModal from "../../components/registerNewFieldModal";
import FieldUpdateModal from "../../components/fieldUpdateModal";
import Loader from "@/app/components/loader";

function FieldsContent() {
  const router = useRouter();

  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");


  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/fields`,
      );
      const result = await res.json();

      if (result.success) {
        setFields(result.data);
      } else {
        setError(result.message || "Failed to load fields");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const filteredFields = fields.filter(
    (field) =>
      field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.cropType?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRegisterSuccess = () => {
    fetchFields(); 
  };

  const handleViewUpdate = (field: any) => {
    setSelectedField(field);
    setIsUpdateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  const handleFieldDetail = (fieldId: string) => {
    router.push(`/field-detail?id=${fieldId}`);
  };

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="uppercase text-xs tracking-[1px] font-medium text-[#525a4f]">
              FIELD MANAGEMENT
            </span>
            <h1
              className="text-4xl font-semibold text-[#181c20]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              All Fields
            </h1>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-x-2 bg-[#204e2b] text-white px-6 py-3.5 rounded-2xl hover:bg-[#386641] transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Register New Field
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#525a4f]" />
          <input
            type="text"
            placeholder="Search by field name or crop type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#f1f4fa] focus:border-[#204e2b] pl-12 pr-5 py-3.5 rounded-2xl text-sm focus:outline-none"
          />
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <div
              key={field._id || field.id}
              className="bg-white rounded-3xl overflow-hidden hover:shadow-md transition-all"
            >
              <img
                src={field.imageUrl || "https://picsum.photos/id/1015/600/400"}
                alt={field.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="flex items-center gap-2 font-semibold text-xl text-[#181c20] mb-1">
                  {field.name}
                  <ArrowRight onClick={()=>handleFieldDetail(field._id)}/>
                </p>

                <div className="flex items-center gap-x-2 text-sm text-[#525a4f] mb-4">
                  <MapPin className="w-4 h-4" />
                  {field.location}
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <span className="text-[#525a4f]">Crop:</span>
                    <p className="font-medium text-[#181c20]">
                      {field.cropType}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#525a4f]">Planted:</span>
                    <p className="font-medium text-[#181c20] flex items-center gap-x-1">
                      <Calendar className="w-4 h-4" />{" "}
                      {new Date(field.plantingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#525a4f]">Current Stage:</span>
                    <p
                      className={`inline-block px-4 py-1 mt-1 text-xs font-medium rounded-full ${
                        field.currentStage === "GROWING"
                          ? "bg-emerald-100 text-emerald-700"
                          : field.currentStage === "At Risk"
                            ? "bg-amber-100 text-amber-700"
                            : field.currentStage === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {field.currentStage}
                    </p>
                  </div>
                </div>

                {field.assignedTo && (
                  <div className="mt-6 pt-4 border-t border-[#f1f4fa] text-sm">
                    <span className="text-[#525a4f]">Assigned to:</span>
                    <p className="font-medium text-[#181c20]">
                      {field.assignedTo}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleViewUpdate(field)}
                  className="mt-6 w-full border border-[#e5e9e2] hover:bg-[#f7f9ff] py-3 rounded-2xl text-sm font-medium transition-colors text-[#181c20]"
                >
                  Manage Field
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFields.length === 0 && (
          <div className="text-center py-20 text-[#525a4f]">
            No fields found matching your search.
          </div>
        )}
      </div>

      {/* Modals */}
      <RegisterNewFieldModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess} // Refresh list after creating new field
      />

      <FieldUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        field={selectedField}
        isAgent={false} // Admin mode
        onUpdateSuccess={fetchFields} // Refresh list after update
      />
    </div>
  );
}

export default function FieldsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <FieldsContent />
    </Suspense>
  );
}
