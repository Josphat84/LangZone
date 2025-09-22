"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle2, Clock, MessageCircle, Mail, User, Filter, Trash2, Eye } from "lucide-react";

interface Feedback {
  id: number;
  name: string;
  email: string;
  type: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

export default function AdminFeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    let query = supabase.from("feedback").select("*").order("created_at", { ascending: false });
    if (filterType) query = query.eq("type", filterType);
    if (filterStatus === "resolved") query = query.eq("resolved", true);
    if (filterStatus === "pending") query = query.eq("resolved", false);

    const { data, error } = await query;
    if (error) console.error(error.message);
    else setFeedbacks(data as Feedback[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();

    const subscription = supabase
      .channel("public:feedback")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "feedback" }, (payload) =>
        setFeedbacks((prev) => [payload.new as Feedback, ...prev])
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [filterType, filterStatus]);

  const markResolved = async (id: number) => {
    const { error } = await supabase.from("feedback").update({ resolved: true }).eq("id", id);
    if (!error) fetchFeedbacks();
  };

  const markSelectedResolved = async () => {
    if (!selectedIds.length) return;
    await supabase.from("feedback").update({ resolved: true }).in("id", selectedIds);
    setSelectedIds([]);
    fetchFeedbacks();
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    await supabase.from("feedback").delete().in("id", selectedIds);
    setSelectedIds([]);
    fetchFeedbacks();
  };

  const filteredFeedbacks = feedbacks.filter(
    (fb) =>
      fb.name?.toLowerCase().includes(search.toLowerCase()) ||
      fb.email?.toLowerCase().includes(search.toLowerCase()) ||
      fb.message.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredFeedbacks.length ? [] : filteredFeedbacks.map((fb) => fb.id));
  };

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter((fb) => !fb.resolved).length,
    resolved: feedbacks.filter((fb) => fb.resolved).length,
    complaints: feedbacks.filter((fb) => fb.type === "Complaint").length,
  };

  const getTypeIcon = (type: string) => (type === "Complaint" ? "🚨" : type === "Suggestion" ? "💡" : "⭐");

  const getTypeColor = (type: string) =>
    type === "Complaint"
      ? "bg-red-100 text-red-800 border-red-200"
      : type === "Suggestion"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📝 Feedback Management
          </h1>
          <p className="text-gray-600 text-lg">Manage and respond to customer feedback</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total", value: stats.total, icon: <MessageCircle className="h-6 w-6 text-white" />, color: "bg-blue-500" },
            { label: "Pending", value: stats.pending, icon: <Clock className="h-6 w-6 text-white" />, color: "bg-orange-500" },
            { label: "Resolved", value: stats.resolved, icon: <CheckCircle2 className="h-6 w-6 text-white" />, color: "bg-green-500" },
            { label: "Complaints", value: stats.complaints, icon: <span className="text-white text-xl">🚨</span>, color: "bg-red-500" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${stat.color} rounded-full flex items-center justify-center`}>{stat.icon}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-0 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <Select onValueChange={(value) => setFilterType(value === "all" ? null : value)}>
                <SelectTrigger className="w-full sm:w-48 border-0 bg-white/50 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Complaint">🚨 Complaints</SelectItem>
                  <SelectItem value="Suggestion">💡 Suggestions</SelectItem>
                  <SelectItem value="Experience">⭐ Experience</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setFilterStatus} defaultValue="all">
                <SelectTrigger className="w-full sm:w-48 border-0 bg-white/50 backdrop-blur-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">🕐 Pending</SelectItem>
                  <SelectItem value="resolved">✅ Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex gap-2 mt-2 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={markSelectedResolved}
                  className="bg-green-500/10 text-green-700 border-green-300 hover:bg-green-500/20"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Resolve ({selectedIds.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={deleteSelected}
                  className="bg-red-500/10 text-red-700 border-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedIds.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback List */}
        {loading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <p className="text-center text-gray-600 text-lg mt-12">No feedback found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFeedbacks.map((fb) => (
              <Card
                key={fb.id}
                className={`bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 p-4 rounded-lg ${
                  fb.resolved ? "opacity-75" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {fb.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{fb.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">{fb.email || "No email"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`${fb.resolved ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"} px-3 py-1`}>
                      {fb.resolved ? "✅ Resolved" : "🕐 Pending"}
                    </Badge>
                    <Badge className={`${getTypeColor(fb.type)} px-3 py-1`}>
                      <span className="mr-1">{getTypeIcon(fb.type)}</span>
                      {fb.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{fb.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(fb.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {!fb.resolved && (
                    <Button
                      size="sm"
                      onClick={() => markResolved(fb.id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
