'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle2, Clock, MessageCircle, AlertTriangle, Star, Lightbulb, X, Sun, Moon, LayoutGrid, List } from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { IBM_Plex_Sans } from "next/font/google";
import { format } from "date-fns";

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
});

interface Feedback {
    id: number;
    name: string;
    email: string;
    type: string;
    message: string;
    resolved: boolean;
    partially_solved?: boolean;
    created_at: string;
}

export default function AdminFeedbackDashboard() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        const savedMode = localStorage.getItem("theme");
        if (savedMode) {
            setIsDarkMode(savedMode === "dark");
        } else {
            setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const fetchFeedbacks = async () => {
        setLoading(true);
        let query = supabase.from("feedback").select("*").order("created_at", { ascending: false });
        if (filterType) query = query.eq("type", filterType);
        if (filterStatus === "resolved") query = query.eq("resolved", true);
        if (filterStatus === "pending") query = query.eq("resolved", false);
        if (filterStatus === "partially_solved") query = query.eq("partially_solved", true);

        const { data, error } = await query;
        if (error) console.error(error.message);
        else setFeedbacks(data as Feedback[]);
        setLoading(false);
    };

    const clearFilters = () => {
        setFilterType(null);
        setFilterStatus("all");
    };

    useEffect(() => {
        fetchFeedbacks();
        const subscription = supabase
            .channel("public:feedback")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "feedback" }, (payload) =>
                setFeedbacks((prev) => [payload.new as Feedback, ...prev])
            )
            .subscribe();
        return () => {
            supabase.removeChannel(subscription);
        };
    }, [filterType, filterStatus]);

    const markResolved = async (id: number) => {
        await supabase.from("feedback").update({ resolved: true, partially_solved: false }).eq("id", id);
        fetchFeedbacks();
    };

    const markPartiallySolved = async (id: number) => {
        await supabase.from("feedback").update({ partially_solved: true, resolved: false }).eq("id", id);
        fetchFeedbacks();
    };

    const markSelectedResolved = async () => {
        if (!selectedIds.length) return;
        await supabase.from("feedback").update({ resolved: true, partially_solved: false }).in("id", selectedIds);
        setSelectedIds([]);
        fetchFeedbacks();
    };

    const markSelectedPartiallySolved = async () => {
        if (!selectedIds.length) return;
        await supabase.from("feedback").update({ partially_solved: true, resolved: false }).in("id", selectedIds);
        setSelectedIds([]);
        fetchFeedbacks();
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const filteredFeedbacks = feedbacks.filter(
        (fb) =>
            fb.name?.toLowerCase().includes(search.toLowerCase()) ||
            fb.email?.toLowerCase().includes(search.toLowerCase()) ||
            fb.message.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: feedbacks.length,
        pending: feedbacks.filter((fb) => !fb.resolved && !fb.partially_solved).length,
        partiallySolved: feedbacks.filter((fb) => fb.partially_solved).length,
        resolved: feedbacks.filter((fb) => fb.resolved).length,
        complaints: feedbacks.filter((fb) => fb.type === "Complaint").length,
    };

    const getTypeIcon = (type: string) =>
        type === "Complaint" ? <AlertTriangle className="h-4 w-4" /> :
            type === "Suggestion" ? <Lightbulb className="h-4 w-4" /> :
                <Star className="h-4 w-4" />;

    const getTypeBadgeClasses = (type: string) => {
        if (type === "Complaint") {
            return isDarkMode ? "bg-rose-900 text-rose-300 shadow-rose-950/20" : "bg-rose-100 text-rose-800 shadow-rose-200/50";
        }
        if (type === "Suggestion") {
            return isDarkMode ? "bg-cyan-900 text-cyan-300 shadow-cyan-950/20" : "bg-cyan-100 text-cyan-800 shadow-cyan-200/50";
        }
        return isDarkMode ? "bg-fuchsia-900 text-fuchsia-300 shadow-fuchsia-950/20" : "bg-fuchsia-100 text-fuchsia-800 shadow-fuchsia-200/50";
    };

    const getStatusBadgeClasses = (resolved: boolean, partially_solved?: boolean) => {
        if (resolved) {
            return isDarkMode ? "bg-green-900 text-green-300 shadow-green-950/20" : "bg-green-100 text-green-800 shadow-green-200/50";
        }
        if (partially_solved) {
            return isDarkMode ? "bg-amber-900 text-amber-300 shadow-amber-950/20" : "bg-amber-100 text-amber-800 shadow-amber-200/50";
        }
        return isDarkMode ? "bg-rose-900 text-rose-300 shadow-rose-950/20" : "bg-rose-100 text-rose-800 shadow-rose-200/50";
    };

    const getActionButtonClasses = (action: string) => {
        if (action === "resolve") {
            return isDarkMode ? "bg-blue-800 text-blue-200 shadow-blue-950/20 hover:bg-blue-700 active:bg-blue-900" : "bg-blue-600 text-white shadow-blue-200/50 hover:bg-blue-700 active:bg-blue-800";
        }
        if (action === "partial") {
            return isDarkMode ? "bg-amber-800 text-amber-200 shadow-amber-950/20 hover:bg-amber-700 active:bg-amber-900" : "bg-amber-600 text-white shadow-amber-200/50 hover:bg-amber-700 active:bg-amber-800";
        }
    };

    const statusData = [
        { name: "Pending", value: stats.pending },
        { name: "Partially Solved", value: stats.partiallySolved },
        { name: "Resolved", value: stats.resolved },
    ];
    const statusColors = ["#f43f5e", "#f59e0b", "#22c55e"]; // Rose, Amber, Green

    const typeColors = ["#f43f5e", "#06b6d4", "#d946ef"]; // Rose, Cyan, Fuchsia
    const typeCounts = ["Complaint", "Suggestion", "Experience"].map(type => ({
        type,
        count: feedbacks.filter(fb => fb.type === type).length
    }));

    const feedbackByDay: { date: string; count: number }[] = [];
    const grouped = feedbacks.reduce<Record<string, number>>((acc, fb) => {
        const date = new Date(fb.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    for (const date in grouped) feedbackByDay.push({ date, count: grouped[date] });

    const radarData = ["Complaint", "Suggestion", "Experience"].map(type => ({
        type,
        Pending: feedbacks.filter(fb => fb.type === type && !fb.resolved && !fb.partially_solved).length,
        "Partially Solved": feedbacks.filter(fb => fb.type === type && fb.partially_solved).length,
        Resolved: feedbacks.filter(fb => fb.type === type && fb.resolved).length,
    }));

    const handleStatusClick = (data: any) => {
        if (!data?.name) return;
        if (data.name === "Pending") setFilterStatus("pending");
        else if (data.name === "Partially Solved") setFilterStatus("partially_solved");
        else if (data.name === "Resolved") setFilterStatus("resolved");
    };

    const handleTypeClick = (data: any) => {
        if (!data?.type) return;
        setFilterType(data.type);
    };

    const dynamicThemeClasses = isDarkMode ? "bg-gradient-to-br from-neutral-900 to-black text-neutral-100" : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900";
    const dynamicCardClasses = isDarkMode ? "bg-gradient-to-br from-neutral-800 to-neutral-700 border-neutral-700 shadow-2xl shadow-neutral-950/50" : "bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl shadow-gray-200/50";
    const dynamicInputClasses = isDarkMode ? "bg-neutral-900 text-neutral-200 border-neutral-600 focus:ring-blue-400 shadow-inner shadow-neutral-950/50" : "bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500 shadow-inner shadow-gray-200/50";
    const dynamicSelectContentClasses = isDarkMode ? "bg-neutral-800 border-neutral-600 shadow-lg shadow-neutral-950/50" : "bg-white border-gray-200 shadow-lg shadow-gray-200/50";
    const dynamicSelectMenuItemClasses = isDarkMode ? "hover:bg-neutral-700 focus:bg-neutral-700" : "hover:bg-gray-100 focus:bg-gray-100";
    const dynamicTableClasses = isDarkMode ? "bg-neutral-700 text-neutral-200" : "bg-gray-100 text-gray-900";
    const dynamicTableBodyClasses = isDarkMode ? "divide-y divide-neutral-700" : "divide-y divide-gray-200";
    const dynamicTableTextClasses = isDarkMode ? "text-neutral-200" : "text-gray-700";

    return (
        <div className={`min-h-screen ${dynamicThemeClasses} ${ibmPlexSans.className}`}>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Header with Theme Toggle */}
                <div className="flex justify-between items-center text-center space-y-2">
                    <div className="flex-1"></div>
                    <div className="flex-1 space-y-2">
                        <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${isDarkMode ? "text-neutral-50" : "text-gray-900"}`}>
                            Feedback Dashboard
                        </h1>
                        <p className={`text-base sm:text-lg max-w-2xl mx-auto ${isDarkMode ? "text-neutral-400" : "text-gray-500"}`}>
                            Manage and analyze user feedback with ease.
                        </p>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <Button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            variant="ghost"
                            size="icon"
                            className={`rounded-full transition-all duration-300 ${isDarkMode ? "text-neutral-400 hover:text-white bg-neutral-800 shadow-lg shadow-neutral-950/20" : "text-gray-600 hover:text-gray-900 bg-white shadow-lg shadow-gray-200/50"}`}
                        >
                            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: "Total", value: stats.total, icon: <MessageCircle className="h-5 w-5 text-purple-400" />, bgLight: "bg-purple-100/50", bgDark: "bg-purple-900/50", textLight: "text-purple-800", textDark: "text-purple-300" },
                        { label: "Pending", value: stats.pending, icon: <Clock className="h-5 w-5 text-rose-400" />, bgLight: "bg-rose-100/50", bgDark: "bg-rose-900/50", textLight: "text-rose-800", textDark: "text-rose-300" },
                        { label: "Partially Solved", value: stats.partiallySolved, icon: <AlertTriangle className="h-5 w-5 text-amber-400" />, bgLight: "bg-amber-100/50", bgDark: "bg-amber-900/50", textLight: "text-amber-800", textDark: "text-amber-300" },
                        { label: "Resolved", value: stats.resolved, icon: <CheckCircle2 className="h-5 w-5 text-green-400" />, bgLight: "bg-green-100/50", bgDark: "bg-green-900/50", textLight: "text-green-800", textDark: "text-green-300" },
                        { label: "Complaints", value: stats.complaints, icon: <AlertTriangle className="h-5 w-5 text-rose-400" />, bgLight: "bg-rose-100/50", bgDark: "bg-rose-900/50", textLight: "text-rose-800", textDark: "text-rose-300" },
                    ].map((stat) => (
                        <Card
                            key={stat.label}
                            className={`transition-all duration-300 transform hover:-translate-y-1 hover:shadow-neutral-900/50 rounded-xl border ${dynamicCardClasses}`}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${isDarkMode ? stat.bgDark : stat.bgLight} shadow-md shadow-inner ${isDarkMode ? "shadow-neutral-950/20" : "shadow-gray-200/50"}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className={`text-xs uppercase font-medium ${isDarkMode ? stat.textDark : stat.textLight}`}>{stat.label}</p>
                                    <p className={`text-2xl font-bold ${isDarkMode ? "text-neutral-100" : "text-gray-900"}`}>{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className={`transition-all duration-500 hover:shadow-neutral-900/50 rounded-xl border ${dynamicCardClasses}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-neutral-100" : "text-gray-900"}`}>Feedback Status</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <defs>
                                        {statusColors.map((color, index) => (
                                            <radialGradient key={index} id={`statusGradient${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                                <stop offset="0%" stopColor={color} stopOpacity={0.7} />
                                                <stop offset="100%" stopColor={color} stopOpacity={1} />
                                            </radialGradient>
                                        ))}
                                    </defs>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        labelLine={false}
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        onClick={handleStatusClick}
                                        stroke="none"
                                        paddingAngle={2}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`url(#statusGradient${index})`} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#fff', borderColor: isDarkMode ? '#404040' : '#e5e5e5', color: isDarkMode ? '#fff' : '#000', borderRadius: '8px', boxShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 10px rgba(0,0,0,0.1)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className={`transition-all duration-500 hover:shadow-neutral-900/50 rounded-xl border ${dynamicCardClasses}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-neutral-100" : "text-gray-900"}`}>Feedback by Type</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={typeCounts} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={35}>
                                    <defs>
                                        {typeColors.map((color, index) => (
                                            <linearGradient key={index} id={`typeGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={color} stopOpacity={1} />
                                                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#404040" : "#e5e5e5"} />
                                    <XAxis dataKey="type" axisLine={false} tickLine={false} stroke={isDarkMode ? "#a3a3a3" : "#737373"} />
                                    <YAxis axisLine={false} tickLine={false} stroke={isDarkMode ? "#a3a3a3" : "#737373"} />
                                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#fff', borderColor: isDarkMode ? '#404040' : '#e5e5e5', color: isDarkMode ? '#fff' : '#000', borderRadius: '8px', boxShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 10px rgba(0,0,0,0.1)' }} cursor={{ fill: isDarkMode ? 'rgba(63,63,70,0.3)' : 'rgba(243,244,246,0.7)', strokeWidth: 0, fillOpacity: 0.8 }} />
                                    <Bar dataKey="count" cursor="pointer" onClick={handleTypeClick} radius={[8, 8, 0, 0]}>
                                        {
                                            typeCounts.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`url(#typeGradient${index})`} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className={`transition-all duration-500 hover:shadow-neutral-900/50 rounded-xl border ${dynamicCardClasses}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-neutral-100" : "text-gray-900"}`}>Feedback Over Time</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={feedbackByDay} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isDarkMode ? "#4a5568" : "#6366f1"} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={isDarkMode ? "#4a5568" : "#6366f1"} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke={isDarkMode ? "#a3a3a3" : "#737373"} />
                                    <YAxis stroke={isDarkMode ? "#a3a3a3" : "#737373"} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#404040" : "#e5e5e5"} />
                                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#fff', borderColor: isDarkMode ? '#404040' : '#e5e5e5', color: isDarkMode ? '#fff' : '#000', borderRadius: '8px', boxShadow: isDarkMode ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 10px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="count" stroke={isDarkMode ? "#4a5568" : "#6366f1"} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className={`transition-all duration-500 hover:shadow-neutral-900/50 rounded-xl border ${dynamicCardClasses}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-neutral-100" : "text-gray-900"}`}>Feedback Distribution</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke={isDarkMode ? "#404040" : "#e5e5e5"} />
                                    <PolarAngleAxis dataKey="type" stroke={isDarkMode ? "#a3a3a3" : "#737373"} />
                                    <PolarRadiusAxis />
                                    <Radar name="Pending" dataKey="Pending" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                                    <Radar name="Partially Solved" dataKey="Partially Solved" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                                    <Radar name="Resolved" dataKey="Resolved" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Feedback Section */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? "text-neutral-400" : "text-gray-400"}`} />
                                <Input
                                    placeholder="Search feedback..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={`pl-9 ${dynamicInputClasses}`}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Select onValueChange={(value) => setFilterStatus(value as string)} value={filterStatus || ""}>
                                    <SelectTrigger className={`w-[180px] ${dynamicInputClasses}`}>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className={dynamicSelectContentClasses}>
                                        <SelectItem value="all" className={dynamicSelectMenuItemClasses}>All Statuses</SelectItem>
                                        <SelectItem value="pending" className={dynamicSelectMenuItemClasses}>Pending</SelectItem>
                                        <SelectItem value="partially_solved" className={dynamicSelectMenuItemClasses}>Partially Solved</SelectItem>
                                        <SelectItem value="resolved" className={dynamicSelectMenuItemClasses}>Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(value) => setFilterType(value === "all" ? null : value as string)} value={filterType || "all"}>
                                    <SelectTrigger className={`w-[180px] ${dynamicInputClasses}`}>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent className={dynamicSelectContentClasses}>
                                        <SelectItem value="all" className={dynamicSelectMenuItemClasses}>All Types</SelectItem>
                                        <SelectItem value="Complaint" className={dynamicSelectMenuItemClasses}>Complaint</SelectItem>
                                        <SelectItem value="Suggestion" className={dynamicSelectMenuItemClasses}>Suggestion</SelectItem>
                                        <SelectItem value="Experience" className={dynamicSelectMenuItemClasses}>Experience</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={clearFilters} variant="ghost" className={`transition-colors duration-200 ${isDarkMode ? "text-neutral-400 hover:bg-neutral-700 hover:text-white shadow-neutral-950/20 active:shadow-inner" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 shadow-gray-200/50 active:shadow-inner"}`}>
                                    <X className="w-4 h-4 mr-1" />
                                    Clear
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <Button onClick={markSelectedResolved} disabled={!selectedIds.length} className={`transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0.5 ${getActionButtonClasses('resolve')}`}>Mark Resolved</Button>
                            <Button onClick={markSelectedPartiallySolved} disabled={!selectedIds.length} className={`transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0.5 ${getActionButtonClasses('partial')}`}>Mark Partially Solved</Button>
                            <div className="flex rounded-md shadow-sm">
                                <Button
                                    onClick={() => setViewMode("grid")}
                                    variant="outline"
                                    size="icon"
                                    className={`rounded-l-md rounded-r-none border ${isDarkMode ? (viewMode === "grid" ? "bg-neutral-700 text-neutral-50 shadow-inner" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800") : (viewMode === "grid" ? "bg-gray-200 text-gray-900 shadow-inner" : "bg-white text-gray-400 hover:bg-gray-100")}`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => setViewMode("list")}
                                    variant="outline"
                                    size="icon"
                                    className={`rounded-r-md rounded-l-none border ${isDarkMode ? (viewMode === "list" ? "bg-neutral-700 text-neutral-50 shadow-inner" : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800") : (viewMode === "list" ? "bg-gray-200 text-gray-900 shadow-inner" : "bg-white text-gray-400 hover:bg-gray-100")}`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFeedbacks.map((fb) => (
                                <Card key={fb.id} className={`transition-all duration-300 transform hover:-translate-y-1 hover:shadow-neutral-900/50 rounded-xl border ${dynamicCardClasses} ${selectedIds.includes(fb.id) ? (isDarkMode ? "bg-gradient-to-br from-neutral-700 to-neutral-600 shadow-inner shadow-neutral-950/50" : "bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner shadow-gray-200/50") : ""}`}>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`font-medium ${getStatusBadgeClasses(fb.resolved, fb.partially_solved)}`}>
                                                    {fb.resolved ? "Resolved" : fb.partially_solved ? "Partial" : "Pending"}
                                                </Badge>
                                                <Badge className={`inline-flex items-center font-medium ${getTypeBadgeClasses(fb.type)}`}>
                                                    {getTypeIcon(fb.type)} <span className="ml-1">{fb.type}</span>
                                                </Badge>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(fb.id)}
                                                onChange={() => toggleSelect(fb.id)}
                                                className={`form-checkbox rounded-sm ${isDarkMode ? "text-blue-600 bg-neutral-900 border-neutral-600 shadow-inner" : "text-blue-600 bg-white border-gray-300 shadow-inner"}`}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <p className={`text-lg font-bold ${dynamicTableTextClasses}`}>{fb.name}</p>
                                            <p className={`text-sm ${isDarkMode ? "text-neutral-400" : "text-gray-500"}`}>{fb.email}</p>
                                            <p className={`text-xs ${isDarkMode ? "text-neutral-500" : "text-gray-400"}`}>{format(new Date(fb.created_at), "PPP p")}</p>
                                        </div>
                                        <p className={`text-sm ${dynamicTableTextClasses}`}>{fb.message}</p>
                                        <div className="flex gap-2 pt-4">
                                            <Button size="sm" onClick={() => markResolved(fb.id)} className={`transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0.5 ${getActionButtonClasses('resolve')}`}>Resolve</Button>
                                            <Button size="sm" onClick={() => markPartiallySolved(fb.id)} className={`transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0.5 ${getActionButtonClasses('partial')}`}>Partial</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className={`transition-all duration-500 hover:shadow-neutral-900/50 rounded-xl border ${dynamicCardClasses}`}>
                            <CardContent className="p-6 overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className={isDarkMode ? "bg-neutral-700/50 text-neutral-200" : "bg-gray-100/50 text-gray-900"}>
                                        <tr className="shadow-md">
                                            <th className="px-4 py-3 text-left font-bold rounded-l-md">
                                                <input type="checkbox" checked={selectedIds.length === feedbacks.length && feedbacks.length > 0} onChange={(e) => e.target.checked ? setSelectedIds(feedbacks.map(fb => fb.id)) : setSelectedIds([])} className={`form-checkbox rounded-sm ${isDarkMode ? "text-blue-600 bg-neutral-800 shadow-inner" : "text-blue-600 bg-white shadow-inner"}`} />
                                            </th>
                                            <th className="px-4 py-3 text-left font-bold">Name</th>
                                            <th className="px-4 py-3 text-left font-bold">Email</th>
                                            <th className="px-4 py-3 text-left">Type</th>
                                            <th className="px-4 py-3 text-left">Message</th>
                                            <th className="px-4 py-3 text-left">Status</th>
                                            <th className="px-4 py-3 text-left">Date</th>
                                            <th className="px-4 py-3 text-left rounded-r-md">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? "divide-y divide-neutral-700" : "divide-y divide-gray-200"}>
                                        {filteredFeedbacks.map((fb) => (
                                            <tr key={fb.id} className={`transition-all duration-200 ${isDarkMode ? "hover:bg-neutral-700/50" : "hover:bg-gray-200/50"} ${selectedIds.includes(fb.id) ? (isDarkMode ? "bg-neutral-700/50" : "bg-gray-200/50") : ""}`}>
                                                <td className="px-4 py-3">
                                                    <input type="checkbox" checked={selectedIds.includes(fb.id)} onChange={() => toggleSelect(fb.id)} className={`form-checkbox rounded-sm ${isDarkMode ? "text-blue-600 bg-neutral-800 shadow-inner" : "text-blue-600 bg-white shadow-inner"}`} />
                                                </td>
                                                <td className={`px-4 py-3 ${dynamicTableTextClasses}`}>{fb.name}</td>
                                                <td className={`px-4 py-3 ${dynamicTableTextClasses}`}>{fb.email}</td>
                                                <td className="px-4 py-3">
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeClasses(fb.type)}`}>
                                                        {getTypeIcon(fb.type)} <span className="ml-1">{fb.type}</span>
                                                    </div>
                                                </td>
                                                <td className={`px-4 py-3 ${dynamicTableTextClasses}`}>{fb.message}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={`font-medium ${getStatusBadgeClasses(fb.resolved, fb.partially_solved)}`}>
                                                        {fb.resolved ? "Resolved" : fb.partially_solved ? "Partial" : "Pending"}
                                                    </Badge>
                                                </td>
                                                <td className={`px-4 py-3 text-sm ${isDarkMode ? "text-neutral-400" : "text-gray-500"}`}>{format(new Date(fb.created_at), "PPP")}</td>
                                                <td className="px-4 py-3 flex gap-2">
                                                    <Button size="sm" onClick={() => markResolved(fb.id)} className={`transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0.5 ${getActionButtonClasses('resolve')}`}>Resolve</Button>
                                                    <Button size="sm" onClick={() => markPartiallySolved(fb.id)} className={`transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0.5 ${getActionButtonClasses('partial')}`}>Partial</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}