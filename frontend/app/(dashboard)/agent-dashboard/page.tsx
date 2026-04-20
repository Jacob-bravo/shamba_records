// app/(dashboard)/agent-dashboard/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/app/components/loader';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [assignedFields, setAssignedFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch assigned fields
  useEffect(() => {
    if (!user || user.role !== 'AGENT') {
      setLoading(false);
      return;
    }

    const fetchAssignedFields = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/fields?role=agent&userId=${user.id}`);
        const result = await res.json();

        if (result.success) {
          setAssignedFields(result.data || []);
        } else {
          setError(result.message || "Failed to load your fields");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedFields();
  }, [user]);

  // Filter fields based on search term (real-time)
  const filteredFields = useMemo(() => {
    if (!searchTerm.trim()) return assignedFields;

    const term = searchTerm.toLowerCase().trim();

    return assignedFields.filter((field) => 
      field.name?.toLowerCase().includes(term) ||
      field.cropType?.toLowerCase().includes(term) ||
      field.location?.toLowerCase().includes(term)
    );
  }, [assignedFields, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center">
       <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9ff] text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <span className="uppercase text-xs tracking-[1px] font-medium text-[#525a4f]">AGENT OVERVIEW</span>
          <h1 
            className="text-4xl font-semibold text-[#181c20] mt-1" 
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Assigned Territories
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT - Assigned Fields */}
          <div className="col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#181c20]" style={{ fontFamily: 'var(--font-manrope)' }}>
                Active Fields
              </h2>
              <div className="bg-[#f1f4fa] px-4 py-1.5 text-xs font-medium rounded-3xl text-[#525a4f]">
                {filteredFields.length} Assigned
              </div>
            </div>

            {/* Search Input - Connected to filtering */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#525a4f]" />
              <input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#f1f4fa] focus:border-[#204e2b] pl-12 pr-5 py-3.5 rounded-2xl text-sm focus:outline-none"
              />
            </div>

            {/* Field Cards */}
            {filteredFields.length > 0 ? (
              filteredFields.map((field: any) => (
                <div key={field._id || field.id} className="bg-white rounded-3xl p-5 flex gap-5 mb-4 hover:shadow-sm transition-all">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={field.imageUrl || "https://picsum.photos/id/1015/300/300"} 
                      alt={field.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg text-[#181c20]">{field.name}</p>
                        <p className="text-sm text-[#525a4f] flex items-center gap-x-1 mt-1">
                          <MapPin className="w-4 h-4" /> {field.location} • {field.acres} Acres
                        </p>
                      </div>

                      <div className={`px-4 py-1 text-xs font-medium rounded-full ${
                        field.currentStage === 'HARVESTED' || field.currentStage === 'Completed' 
                          ? 'bg-blue-100 text-blue-700' 
                          : field.currentStage === 'At Risk' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {field.currentStage}
                      </div>
                    </div>

                    {/* Extra Info */}
                    <div className="mt-4 flex items-center gap-x-6 text-sm">
                      <div>
                        <span className="text-[#525a4f]">Crop:</span>
                        <p className="font-medium text-[#181c20]">{field.cropType}</p>
                      </div>
                      <div>
                        <span className="text-[#525a4f]">Planted:</span>
                        <p className="font-medium text-[#181c20]">
                          {new Date(field.plantingDate).toLocaleDateString('en-GB', { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    {/* View Field Button */}
                    <div className="mt-6">
                      <Link 
                        href={`/field-detail?id=${field._id || field.id}`}
                        className="block w-full bg-[#204e2b] hover:bg-[#386641] text-white py-3 rounded-2xl text-sm font-medium text-center transition-colors"
                      >
                        View Field
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-[#525a4f]">
                {searchTerm ? "No matching fields found." : "No fields assigned to you yet."}
              </p>
            )}
          </div>

          {/* RIGHT COLUMN - Alerts + Map */}
          <div className="col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#181c20]" style={{ fontFamily: 'var(--font-manrope)' }}>Field Alerts</h2>
                <div className="text-[#204e2b]">🔊</div>
              </div>

              <div className="pl-5 border-l-4 border-red-500 mb-6">
                <p className="font-medium text-red-600">❗ Frost Warning</p>
                <p className="text-sm text-[#181c20] mt-1">
                  Temperature expected to drop below 32°F in Sector A tomorrow night.
                </p>
              </div>

              <div className="pl-5 border-l-4 border-amber-500 mb-6">
                <p className="font-medium text-amber-600">🕒 Submission Deadline</p>
                <p className="text-sm text-[#181c20] mt-1">
                  Monthly soil reports for all assigned fields are due by Friday 5 P.M.
                </p>
              </div>

              <button className="mt-8 w-full border border-[#c1c9be] hover:bg-[#f7f9ff] py-3.5 rounded-2xl text-sm font-medium transition-colors">
                View All Messages
              </button>
            </div>

            {/* Territory Map */}
            <div className="bg-white rounded-3xl overflow-hidden relative">
              <img 
                src="https://picsum.photos/id/1016/800/520" 
                alt="Territory Map" 
                className="w-full h-[380px] object-cover" 
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1 rounded-3xl text-xs font-medium flex items-center gap-x-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                LIVE GPS
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="font-semibold text-lg">Territory Map</p>
                <p className="text-sm opacity-75">Tap to view live satellite telemetry</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}