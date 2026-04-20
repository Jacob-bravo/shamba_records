"use client";

import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";
import Loader from "@/app/components/loader";

interface DashboardData {
  stats: {
    totalFields: number;
    activeFields: number;
    atRisk: number;
    harvested: number;
  };
  lifecycleDistribution: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  recentUpdates: any[];
  activeAgents: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/dashboard/stats`,
        );
        const result = await res.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to load dashboard");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/dashboard/stats`,
      );
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUpdate = async (updateId: any) => {
    if (!confirm("Delete this observation?")) return;
    console.log(updateId)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/updates/delete/${updateId._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await res.json();

      if (result.success) {
        alert("Observation deleted successfully");
        window.location.reload();
      } else {
        alert(result.message || "Failed to delete");
      }
    } catch (err) {
      alert("Failed to delete observation");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center">
       <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9ff] flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalFields: 0,
    activeFields: 0,
    atRisk: 0,
    harvested: 0,
  };
  const lifecycle = data?.lifecycleDistribution || [];
  const recentUpdates = data?.recentUpdates || [];
  const activeAgents = data?.activeAgents || [];

  return (
    <div className="min-h-screen bg-[#f7f9ff] font-sans">
      <main className="pt-2 pb-12 px-8 min-h-screen">
        {/* OPERATIONAL OVERVIEW */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="uppercase text-xs tracking-[1px] font-medium text-[#525a4f]">
              Operational Overview
            </span>
            <h1
              className="text-4xl font-semibold text-[#181c20]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Farm Performance
            </h1>
          </div>
          <button
            className="flex items-center gap-x-2 bg-[#204e2b] text-white px-6 py-3.5 rounded-2xl hover:bg-[#386641] transition-all font-medium text-sm"
            onClick={() => fetchDashboardData()}
          >
            <Plus className="w-5 h-5" />
            New Field Scan
          </button>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#525a4f]">Total Fields</p>
                <p
                  className="text-5xl font-semibold text-[#181c20] mt-2"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {stats.totalFields || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">
                📊
              </div>
            </div>
            <div className="mt-6 flex items-center gap-x-2 text-emerald-600 text-sm font-medium">
              <span>+12%</span>
              <span className="text-[#525a4f]">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#525a4f]">Active Fields</p>
                <p
                  className="text-5xl font-semibold text-[#181c20] mt-2"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {stats.activeFields || 0}
                </p>
                <p className="text-emerald-600 text-sm mt-1">Stable</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                🚜
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#525a4f]">At-Risk</p>
                <p
                  className="text-5xl font-semibold text-amber-700 mt-2"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {stats.atRisk || 0}
                </p>
                <p className="text-amber-600 text-sm mt-1">Needs Action</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">
                ⚠️
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-[#525a4f]">Harvested</p>
                <p
                  className="text-5xl font-semibold text-[#181c20] mt-2"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {stats.harvested || 0}
                </p>
                <p className="text-blue-600 text-sm mt-1">Completed</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                ✅
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Field Lifecycle Distribution */}
          <div className="col-span-7 bg-white rounded-3xl p-8">
            <h2
              className="text-xl font-semibold mb-8"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Field Lifecycle Distribution
            </h2>

            <div className="space-y-8">
              {lifecycle.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-[#525a4f]">
                      {item.count} Fields • {item.percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-[#f1f4fa] rounded-3xl overflow-hidden">
                    <div
                      className="h-3 bg-[#204e2b] rounded-3xl"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Active Field Agents */}
          <div className="col-span-5 bg-white rounded-3xl p-8">
            <h2
              className="text-xl font-semibold mb-6"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Active Field Agents
            </h2>
            <div className="space-y-6">
              {activeAgents.length > 0 ? (
                activeAgents.map((agent: any, index: number) => (
                  <div key={index} className="flex items-center gap-x-4">
                    <img
                      src={agent.avatar || "https://i.pravatar.cc/64?img=12"}
                      alt={agent.name}
                      className="w-11 h-11 rounded-2xl"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-[#525a4f]">
                        Monitoring Zone • {agent.assignedFields || 0} fields
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                ))
              ) : (
                <p className="text-[#525a4f]">No active agents found.</p>
              )}
            </div>
          </div>
          {/* Recent Field Updates */}
          <div className="col-span-7 bg-white rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Recent Field Updates
              </h2>
              <a
                href="#"
                className="text-[#204e2b] text-sm font-medium flex items-center gap-x-1 hover:underline"
              ></a>
            </div>

            <div className="space-y-4">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((update: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-x-4 p-4 rounded-2xl hover:bg-[#f7f9ff] transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                      👷‍♂️
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {update.field?.name || "Field Update"}
                      </p>
                      <p className="text-sm text-[#525a4f]">
                        {update.observations?.substring(0, 80)}...
                      </p>
                    </div>
                    <div className="text-xs px-4 py-1 bg-emerald-100 text-emerald-700 rounded-3xl">
                      STABLE
                    </div>
                    <span className="text-xs text-[#525a4f]">
                      {update.createdAt
                        ? new Date(update.createdAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                    <button onClick={() => handleDeleteUpdate(update)}>
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[#525a4f] py-8 text-center">
                  No recent updates available.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
