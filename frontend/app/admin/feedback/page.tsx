'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
// NOTE: Ensure this path is correct for your Supabase client setup
import { supabase } from "@/lib/supabase/client"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle2, Clock, MessageCircle, AlertTriangle, Star, Lightbulb, X, Sun, Moon, LayoutGrid, List, Zap, Settings2, CalendarIcon, MoreVertical, Mail, Copy } from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area
} from "recharts";
import { IBM_Plex_Sans } from "next/font/google";
import { format, subDays } from "date-fns";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { toast } from 'react-hot-toast'; 

// --- FONT CONFIG ---
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
    last_updated: string; 
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const initialDateRange = {
    from: subDays(new Date(), 30),
    to: new Date(),
};

export default function AdminFeedbackDashboard() {
    // --- State Management ---
    // Initialized to FALSE (Light Mode) to match the dashboard background
    const [isDarkMode, setIsDarkMode] = useState(false); 
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); 
    const [paginatedFeedbacks, setPaginatedFeedbacks] = useState<Feedback[]>([]); 
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); 
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);


    // --- Design Utility Functions ---
    const getTypeIcon = (type: string) =>
        type === "Complaint" ? <AlertTriangle className="h-4 w-4" /> :
            type === "Suggestion" ? <Lightbulb className="h-4 w-4" /> :
                <Star className="h-4 w-4" />;

    const getTypeBadgeClasses = (type: string) => {
        if (type === "Complaint") return isDarkMode ? "bg-rose-900 text-rose-300 border-rose-800" : "bg-rose-50 text-rose-700 border-rose-200";
        if (type === "Suggestion") return isDarkMode ? "bg-cyan-900 text-cyan-300 border-cyan-800" : "bg-cyan-50 text-cyan-700 border-cyan-200";
        return isDarkMode ? "bg-fuchsia-900 text-fuchsia-300 border-fuchsia-800" : "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200";
    };

    const getStatusBadgeClasses = (resolved: boolean, partially_solved?: boolean) => {
        if (resolved) return isDarkMode ? "bg-green-800 text-green-200 border-green-700" : "bg-green-100 text-green-700 border-green-200";
        if (partially_solved) return isDarkMode ? "bg-amber-800 text-amber-200 border-amber-700" : "bg-amber-100 text-amber-700 border-amber-200";
        return isDarkMode ? "bg-rose-800 text-rose-200 border-rose-700" : "bg-rose-100 text-rose-700 border-rose-200";
    };

    const getRowClass = (resolved: boolean, partially_solved?: boolean) => {
        const baseClass = isDarkMode ? "bg-neutral-900 hover:bg-neutral-800/80" : "bg-white hover:bg-gray-50/50";
        
        if (!resolved && !partially_solved) {
            return cn(baseClass, isDarkMode ? "border-l-4 border-rose-600" : "border-l-4 border-rose-400");
        }
        if (partially_solved) {
            return cn(baseClass, isDarkMode ? "border-l-4 border-amber-600" : "border-l-4 border-amber-400");
        }
        return cn(baseClass, "border-l-4 border-transparent");
    };

    const getActionButtonClasses = (action: string) => {
        if (action === "resolve") return isDarkMode ? "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700";
        if (action === "partial") return isDarkMode ? "bg-amber-600 text-white hover:bg-amber-500 active:bg-amber-700" : "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700";
        return isDarkMode ? "bg-neutral-700 text-neutral-100 hover:bg-neutral-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300";
    };
    
    // --- 3D / SHADOW ENHANCEMENTS ---
    const dynamicThemeClasses = isDarkMode ? "bg-neutral-950 text-neutral-100 dark-scrollbar" : "bg-gray-50 text-gray-900 light-scrollbar";
    
    // ENHANCEMENT: Added transition and lifted shadow on hover for a 3D effect.
    const dynamicCardClasses = isDarkMode 
        ? "bg-neutral-900 border-neutral-800 shadow-xl shadow-neutral-900/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/30 hover:scale-[1.01]" 
        : "bg-white border-gray-200 shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:scale-[1.01]";
    
    const dynamicInputClasses = isDarkMode 
        ? "bg-neutral-800 text-neutral-100 border-neutral-700 focus:border-blue-500" 
        : "bg-white text-gray-900 border-gray-300 focus:border-blue-500";
    
    const dynamicSelectContentClasses = isDarkMode 
        ? "bg-neutral-800 border-neutral-700 shadow-2xl text-neutral-100" 
        : "bg-white border-gray-200 shadow-xl text-gray-900";
    
    const dynamicSelectMenuItemClasses = isDarkMode 
        ? "hover:bg-neutral-700 focus:bg-neutral-700 text-neutral-100" 
        : "hover:bg-gray-100 focus:bg-gray-100 text-gray-900";

    const dynamicTableClasses = isDarkMode ? "bg-neutral-800 text-neutral-200 border-b border-neutral-700" : "bg-white text-gray-900 border-b border-gray-200";
    const dynamicTableBodyClasses = isDarkMode ? "divide-y divide-neutral-800" : "divide-y divide-gray-100";
    const dynamicTableTextClasses = isDarkMode ? "text-neutral-200" : "text-gray-700";
    const dynamicTableHeaderTextClasses = isDarkMode ? "text-neutral-400 font-semibold" : "text-gray-500 font-semibold";


    // --- Data Fetching and Mutations ---
    const buildQuery = useCallback(() => {
        let query = supabase.from("feedback").select("*", { count: 'exact' });
        
        if (filterType) query = query.eq("type", filterType);
        
        if (filterStatus === "resolved") query = query.eq("resolved", true);
        else if (filterStatus === "pending") query = query.eq("resolved", false).eq("partially_solved", false);
        else if (filterStatus === "partially_solved") query = query.eq("partially_solved", true).eq("resolved", false);

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`);
        }

        if (dateRange?.from) {
            query = query.gte("created_at", format(dateRange.from, 'yyyy-MM-dd'));
        }
        if (dateRange?.to) {
            query = query.lte("created_at", format(dateRange.to, 'yyyy-MM-dd') + ' 23:59:59'); 
        }

        return query.order("created_at", { ascending: false });
    }, [filterType, filterStatus, search, dateRange]);

    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        const { data: allData, error: allError } = await buildQuery().limit(1000); 
        if (allError) console.error("Error fetching all data:", allError.message);
        else setFeedbacks(allData as Feedback[]);

        const offset = (currentPage - 1) * pageSize;
        const { data: pageData, error: pageError, count } = await buildQuery()
            .range(offset, offset + pageSize - 1);

        if (pageError) console.error("Error fetching paginated data:", pageError.message);
        else setPaginatedFeedbacks(pageData as Feedback[]);

        setTotalCount(count || 0);
        setLoading(false);
    }, [buildQuery, currentPage, pageSize]);

    useEffect(() => {
        fetchFeedbacks();
        const subscription = supabase
            .channel("public:feedback")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "feedback" }, () => {
                fetchFeedbacks();
                setCurrentPage(1); 
            })
            .subscribe();
        return () => {
            supabase.removeChannel(subscription);
        };
    }, [fetchFeedbacks]);

    const updateFilterAndFetch = (updateFn: () => void) => {
        updateFn();
        setCurrentPage(1);
    }

    const updateFeedbackStatus = async (id: number, resolved: boolean, partially_solved: boolean) => {
        await supabase.from("feedback").update({ resolved, partially_solved, last_updated: new Date().toISOString() }).eq("id", id);
        fetchFeedbacks();
        if (selectedItem?.id === id) {
            setSelectedItem((prev) => prev ? { ...prev, resolved, partially_solved } : null);
        }
    };
    
    const markUnresolved = (id: number) => updateFeedbackStatus(id, false, false);
    const markResolved = (id: number) => updateFeedbackStatus(id, true, false);
    const markPartiallySolved = (id: number) => updateFeedbackStatus(id, false, true);
    
    const markSelectedResolved = async () => {
        if (!selectedIds.length) return;
        await supabase.from("feedback").update({ resolved: true, partially_solved: false, last_updated: new Date().toISOString() }).in("id", selectedIds);
        setSelectedIds([]);
        fetchFeedbacks();
    };

    const markSelectedPartiallySolved = async () => {
        if (!selectedIds.length) return;
        await supabase.from("feedback").update({ partially_solved: true, resolved: false, last_updated: new Date().toISOString() }).in("id", selectedIds);
        setSelectedIds([]);
        fetchFeedbacks();
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const clearFilters = () => {
        updateFilterAndFetch(() => {
            setSearch("");
            setFilterType(null);
            setFilterStatus("all");
            setDateRange(initialDateRange);
        });
    };

    const stats = useMemo(() => {
        const total = feedbacks.length;
        const pending = feedbacks.filter((fb) => !fb.resolved && !fb.partially_solved).length;
        const partiallySolved = feedbacks.filter((fb) => fb.partially_solved && !fb.resolved).length;
        const resolved = feedbacks.filter((fb) => fb.resolved).length;
        const complaints = feedbacks.filter((fb) => fb.type === "Complaint").length;
        
        return {
            total,
            pending,
            partiallySolved,
            resolved,
            complaints,
            resolvedPct: total > 0 ? (((resolved + partiallySolved) / total) * 100).toFixed(1) : "0.0",
        };
    }, [feedbacks]);

    const statusData = useMemo(() => [
        { name: "Pending", value: stats.pending, color: "#f43f5e" }, // Rose 500
        { name: "Partial", value: stats.partiallySolved, color: "#f59e0b" }, // Amber 500
        { name: "Resolved", value: stats.resolved, color: "#22c55e" }, // Green 500
    ], [stats]);
    
    const typeCounts = useMemo(() => ["Complaint", "Suggestion", "Experience"].map(type => ({
        type,
        count: feedbacks.filter(fb => fb.type === type).length
    })), [feedbacks]);

    const feedbackByDay = useMemo(() => {
        const grouped = feedbacks.reduce<Record<string, number>>((acc, fb) => {
            const date = format(new Date(fb.created_at), 'MMM d');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(grouped).map(date => ({ date, count: grouped[date] }));
    }, [feedbacks]);

    const typeColors = ["#f43f5e", "#06b6d4", "#d946ef"];

    const handleStatusClick = (data: any) => {
        if (!data?.name) return;
        updateFilterAndFetch(() => {
            if (data.name === "Pending") setFilterStatus("pending");
            else if (data.name === "Partial") setFilterStatus("partially_solved");
            else if (data.name === "Resolved") setFilterStatus("resolved");
        });
    };

    const handleTypeClick = (data: any) => {
        if (!data?.type) return;
        updateFilterAndFetch(() => setFilterType(data.type));
    };

    // --- Component: User Contact Popover ---
    const UserContactPopover = ({ name, email }: { name: string, email: string }) => (
        <Popover>
            <PopoverTrigger asChild>
                <span className={`cursor-pointer font-semibold underline-offset-2 hover:underline transition-colors ${dynamicTableTextClasses}`}>{name}</span>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-2", dynamicSelectContentClasses)} align="start">
                <div className="flex flex-col space-y-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("justify-start", dynamicSelectMenuItemClasses)}
                        onClick={() => { navigator.clipboard.writeText(email); toast.success("Email copied!"); }}
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy Email
                    </Button>
                    <a href={`mailto:${email}`}>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("justify-start w-full", dynamicSelectMenuItemClasses)}
                        >
                            <Mail className="mr-2 h-4 w-4" /> Email Draft
                        </Button>
                    </a>
                </div>
            </PopoverContent>
        </Popover>
    );

    // --- Component: Date Range Picker ---
    const DateRangeSelector = () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        (!dateRange?.from && !dateRange?.to) && "text-muted-foreground",
                        dynamicInputClasses
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                                {format(dateRange.from, "LLL d, y")} -{" "}
                                {format(dateRange.to, "LLL d, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL d, y")
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                    {(dateRange?.from || dateRange?.to) && (
                        <X 
                            className="ml-auto h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" 
                            onClick={(e) => { e.stopPropagation(); updateFilterAndFetch(() => setDateRange(undefined)); }}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0", dynamicSelectContentClasses)} align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => updateFilterAndFetch(() => setDateRange(range))}
                    numberOfMonths={2}
                    captionLayout="dropdown"
                    className={isDarkMode ? "dark-calendar" : "light-calendar"}
                />
                <div className="p-2 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => updateFilterAndFetch(() => setDateRange(initialDateRange))}>Last 30 Days</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateFilterAndFetch(() => setDateRange({ from: subDays(new Date(), 7), to: new Date() }))}>Last 7 Days</Button>
                    <Button size="sm" variant="ghost" onClick={() => updateFilterAndFetch(() => setDateRange(undefined))}>Clear</Button>
                </div>
            </PopoverContent>
        </Popover>
    );


    // --- Component: Inline Status Editor (Dropdown Menu) ---
    const InlineStatusEditor = ({ fb }: { fb: Feedback }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Badge 
                    className={cn(
                        "cursor-pointer font-medium transition-transform duration-100 active:scale-95", 
                        getStatusBadgeClasses(fb.resolved, fb.partially_solved)
                    )}
                >
                    {fb.resolved ? "Resolved" : fb.partially_solved ? "Partial" : "Pending"}
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn("w-48", dynamicSelectContentClasses)} align="start">
                <DropdownMenuItem 
                    onClick={() => markResolved(fb.id)}
                    className={cn(dynamicSelectMenuItemClasses, "text-green-600 dark:text-green-400")}
                    disabled={fb.resolved}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Fully Resolved
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => markPartiallySolved(fb.id)}
                    className={cn(dynamicSelectMenuItemClasses, "text-amber-600 dark:text-amber-400")}
                    disabled={fb.partially_solved && !fb.resolved}
                >
                    <AlertTriangle className="mr-2 h-4 w-4" /> Partially Solved
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDarkMode ? "bg-neutral-700" : "bg-gray-200"} />
                <DropdownMenuItem 
                    onClick={() => markUnresolved(fb.id)}
                    className={cn(dynamicSelectMenuItemClasses, "text-rose-600 dark:text-rose-400")}
                    disabled={!fb.resolved && !fb.partially_solved}
                >
                    <Clock className="mr-2 h-4 w-4" /> Set to Pending
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );


    // --- Pagination Logic ---
    const totalPages = Math.ceil(totalCount / pageSize);
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handlePageSizeChange = (size: string) => {
        setPageSize(parseInt(size));
        setCurrentPage(1);
    };

    return (
        <div className={`min-h-screen ${dynamicThemeClasses} ${ibmPlexSans.className} transition-colors duration-500`}>
            <style jsx global>{`
                /* Custom Scrollbar Styles for Polished Look */
                .light-scrollbar ::-webkit-scrollbar { width: 8px; height: 8px; }
                .light-scrollbar ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
                .light-scrollbar ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
                
                .dark-scrollbar ::-webkit-scrollbar { width: 8px; height: 8px; }
                .dark-scrollbar ::-webkit-scrollbar-thumb { background-color: #404040; border-radius: 4px; }
                .dark-scrollbar ::-webkit-scrollbar-thumb:hover { background-color: #525252; }
            `}</style>
            
            {/* ENHANCEMENT: Recharts Gradient Definitions for 3D Effect */}
            <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                    {/* Pie Chart Radial Gradients for Depth */}
                    <radialGradient id="grad-rose" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#c52441" stopOpacity={1} />
                    </radialGradient>
                    <radialGradient id="grad-amber" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                    </radialGradient>
                    <radialGradient id="grad-green" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#15803d" stopOpacity={1} />
                    </radialGradient>

                    {/* Bar Chart Linear Gradients for Volume */}
                    <linearGradient id="bar-rose" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                        <stop offset="100%" stopColor="#d946ef" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="bar-cyan" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                        <stop offset="100%" stopColor="#164e63" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="bar-fuchsia" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="0%" stopColor="#d946ef" stopOpacity={1} />
                        <stop offset="100%" stopColor="#9d174d" stopOpacity={0.7} />
                    </linearGradient>
                </defs>
            </svg>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-10 pt-20"> 
                
                {/* --- Header & Theme Toggle --- */}
                <header className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-800">
                    {/* ENHANCEMENT: Subtle Text Shadow on Title */}
                    <h1 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-neutral-50 shadow-md shadow-blue-900/50" : "text-gray-900 shadow-sm shadow-blue-200/50"}`}>
                        Feedback Operations Dashboard
                    </h1>
                    <div className="flex items-center space-x-3">
                        <Button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            variant="outline"
                            size="icon"
                            className={`rounded-full transition-colors duration-300 ${dynamicCardClasses} border ${isDarkMode ? "hover:bg-neutral-800" : "hover:bg-gray-100"}`}
                        >
                            {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-500" />}
                        </Button>
                    </div>
                </header>

                {/* --- 1. Stats and Metrics Section --- */}
                <section className="space-y-4">
                    <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? "text-neutral-50" : "text-gray-800"}`}>
                        <Zap className="h-5 w-5 text-blue-500" /> Key Metrics <span className={`text-sm font-medium ${isDarkMode ? "text-neutral-500" : "text-gray-400"}`}>({dateRange?.from && dateRange.to ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}` : 'All Time'})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[
                            { label: "Total Submissions", value: stats.total, icon: <MessageCircle className="h-5 w-5 text-blue-400" />, color: "blue", tooltip: "Total items matching current filters." },
                            { label: "Currently Pending", value: stats.pending, icon: <Clock className="h-5 w-5 text-rose-400" />, color: "rose", tooltip: "Requires immediate attention." },
                            { label: "Partially Handled", value: stats.partiallySolved, icon: <AlertTriangle className="h-5 w-5 text-amber-400" />, color: "amber", tooltip: "Work in progress or awaiting user response." },
                            { label: "Fully Resolved", value: stats.resolved, icon: <CheckCircle2 className="h-5 w-5 text-green-400" />, color: "green", tooltip: `Success rate: ${stats.resolvedPct}% resolved.` },
                            { label: "High-Priority", value: stats.complaints, icon: <AlertTriangle className="h-5 w-5 text-red-400" />, color: "red", tooltip: "Complaints require fast turnaround." },
                        ].map((stat) => (
                            <Card
                                key={stat.label}
                                // The dynamicCardClasses now contain the 3D lift/shadow effects
                                className={`transition-all duration-300 rounded-lg ${dynamicCardClasses}`} 
                            >
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <CardContent className="p-4 flex items-center gap-4 cursor-help">
                                            <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                                {stat.icon}
                                            </div>
                                            <div>
                                                <p className={`text-xs uppercase font-medium ${isDarkMode ? "text-neutral-400" : "text-gray-500"}`}>{stat.label}</p>
                                                <p className={`text-2xl font-bold ${isDarkMode ? "text-neutral-50" : "text-gray-900"}`}>{stat.value}</p>
                                            </div>
                                        </CardContent>
                                    </PopoverTrigger>
                                    <PopoverContent className={cn("w-40 text-sm", dynamicSelectContentClasses)}>{stat.tooltip}</PopoverContent>
                                </Popover>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ENHANCEMENT: Soft, Recessed Separator */}
                <Separator className={isDarkMode ? "bg-neutral-800 h-1 shadow-inner shadow-neutral-950/50" : "bg-gray-200 h-1 shadow-inner shadow-gray-100/50"} />

                {/* --- 2. Visual Analytics Section --- */}
                <section className="space-y-4">
                    <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? "text-neutral-50" : "text-gray-800"}`}>
                        <Settings2 className="h-5 w-5 text-blue-500" /> Data Visualizations
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Feedback Status */}
                        <Card className={`transition-all duration-500 rounded-lg ${dynamicCardClasses}`}>
                            <CardHeader>
                                <CardTitle className={isDarkMode ? "text-neutral-100" : "text-gray-900"}>Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
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
                                            {statusData.map((entry, index) => {
                                                const gradId = entry.name === "Pending" ? "grad-rose" : entry.name === "Partial" ? "grad-amber" : "grad-green";
                                                return <Cell key={`cell-${index}`} fill={`url(#${gradId})`} className="cursor-pointer hover:opacity-90 transition-opacity" />;
                                            })}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#fff', borderColor: isDarkMode ? '#404040' : '#e5e5e5', color: isDarkMode ? '#fff' : '#000', borderRadius: '8px' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Feedback by Type */}
                        <Card className={`transition-all duration-500 rounded-lg ${dynamicCardClasses}`}>
                            <CardHeader>
                                <CardTitle className={isDarkMode ? "text-neutral-100" : "text-gray-900"}>Feedback Category Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={typeCounts} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={35}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#404040" : "#e5e5e5"} />
                                        <XAxis dataKey="type" axisLine={false} tickLine={false} stroke={isDarkMode ? "#a3a3a3" : "#737373"} />
                                        <YAxis axisLine={false} tickLine={false} stroke={isDarkMode ? "#a3a3a3" : "#737373"} />
                                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#fff', borderColor: isDarkMode ? '#404040' : '#e5e5e5', color: isDarkMode ? '#fff' : '#000', borderRadius: '8px' }} />
                                        <Bar dataKey="count" cursor="pointer" onClick={handleTypeClick} radius={[8, 8, 0, 0]}>
                                            {
                                                typeCounts.map((entry, index) => {
                                                    const gradId = entry.type === "Complaint" ? "bar-rose" : entry.type === "Suggestion" ? "bar-cyan" : "bar-fuchsia";
                                                    return <Cell key={`cell-${index}`} fill={`url(#${gradId})`} className="hover:opacity-90 transition-opacity" />;
                                                })
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Feedback Over Time */}
                    <Card className={`transition-all duration-500 rounded-lg ${dynamicCardClasses}`}>
                        <CardHeader>
                            <CardTitle className={isDarkMode ? "text-neutral-100" : "text-gray-900"}>Submission Trend (Daily)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <ResponsiveContainer width="100%" height={150}>
                                <AreaChart data={feedbackByDay} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        {/* ENHANCEMENT: Adjusted Gradient for Depth */}
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isDarkMode ? "#374151" : "#6366f1"} stopOpacity={0.9} />
                                            <stop offset="95%" stopColor={isDarkMode ? "#4a5568" : "#6366f1"} stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke={isDarkMode ? "#404040" : "#e5e5e5"} tickLine={false} axisLine={false} />
                                    <YAxis stroke={isDarkMode ? "#404040" : "#e5e5e5"} tickLine={false} axisLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#404040" : "#e5e5e5"} />
                                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#fff', borderColor: isDarkMode ? '#404040' : '#e5e5e5', color: isDarkMode ? '#fff' : '#000', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="count" stroke={isDarkMode ? "#6b7280" : "#3b82f6"} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </section>

                {/* ENHANCEMENT: Soft, Recessed Separator */}
                <Separator className={isDarkMode ? "bg-neutral-800 h-1 shadow-inner shadow-neutral-950/50" : "bg-gray-200 h-1 shadow-inner shadow-gray-100/50"} />

                {/* --- 3. Management Table & Controls Section --- */}
                <section className="space-y-6">
                    <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? "text-neutral-50" : "text-gray-800"}`}>
                        <List className="h-5 w-5 text-blue-500" /> Feedback Queue
                    </h2>
                    
                    {/* Controls Bar - Uses contrast background for visual separation */}
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/50">
                        <div className="flex flex-wrap items-center gap-4 w-full">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? "text-neutral-400" : "text-gray-400"}`} />
                                <Input
                                    placeholder="Search name, email, or message..."
                                    value={search}
                                    onChange={(e) => updateFilterAndFetch(() => setSearch(e.target.value))}
                                    className={`pl-9 ${dynamicInputClasses}`}
                                />
                            </div>
                            
                            <Select onValueChange={(value) => updateFilterAndFetch(() => setFilterStatus(value as string))} value={filterStatus || ""}>
                                <SelectTrigger className={`w-[140px] ${dynamicInputClasses}`}>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className={dynamicSelectContentClasses}>
                                    <SelectItem value="all" className={dynamicSelectMenuItemClasses}>All Statuses</SelectItem>
                                    <SelectItem value="pending" className={dynamicSelectMenuItemClasses}>Pending</SelectItem>
                                    <SelectItem value="partially_solved" className={dynamicSelectMenuItemClasses}>Partial</SelectItem>
                                    <SelectItem value="resolved" className={dynamicSelectMenuItemClasses}>Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => updateFilterAndFetch(() => setFilterType(value === "all" ? null : value as string))} value={filterType || "all"}>
                                <SelectTrigger className={`w-[140px] ${dynamicInputClasses}`}>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent className={dynamicSelectContentClasses}>
                                    <SelectItem value="all" className={dynamicSelectMenuItemClasses}>All Types</SelectItem>
                                    <SelectItem value="Complaint" className={dynamicSelectMenuItemClasses}>Complaint</SelectItem>
                                    <SelectItem value="Suggestion" className={dynamicSelectMenuItemClasses}>Suggestion</SelectItem>
                                    <SelectItem value="Experience" className={dynamicSelectMenuItemClasses}>Experience</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <DateRangeSelector />
                        </div>

                        <div className="flex items-center gap-2 mt-2 xl:mt-0 flex-shrink-0">
                            <Button onClick={markSelectedResolved} disabled={!selectedIds.length} className={`text-xs h-8 px-3 ${getActionButtonClasses('resolve')}`}>Resolve ({selectedIds.length})</Button>
                            <Button onClick={markSelectedPartiallySolved} disabled={!selectedIds.length} className={`text-xs h-8 px-3 ${getActionButtonClasses('partial')}`}>Partial ({selectedIds.length})</Button>
                            
                            <Button onClick={clearFilters} variant="ghost" size="sm" className={`transition-colors duration-200 ${isDarkMode ? "text-neutral-400 hover:bg-neutral-700 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
                                <X className="w-4 h-4 mr-1" /> Clear All
                            </Button>

                            <div className="flex rounded-md border border-gray-200 dark:border-neutral-700">
                                <Button
                                    onClick={() => setViewMode("grid")}
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 rounded-r-none ${isDarkMode ? (viewMode === "grid" ? "bg-neutral-700 text-neutral-50" : "text-neutral-400 hover:bg-neutral-800") : (viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100")}`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => setViewMode("list")}
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 rounded-l-none ${isDarkMode ? (viewMode === "list" ? "bg-neutral-700 text-neutral-50" : "text-neutral-400 hover:bg-neutral-800") : (viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100")}`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* --- Feedback List/Grid Rendering --- */}
                    {loading ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                                {[...Array(pageSize)].map((_, index) => (
                                    <Skeleton key={index} className={`h-40 rounded-lg ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} />
                                ))}
                            </div>
                        ) : (
                            <div className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-neutral-800" : "border-gray-200"} shadow-xl`}>
                                <Table>
                                    <TableHeader className={dynamicTableClasses}>
                                        <TableRow className={isDarkMode ? "hover:bg-neutral-700/50" : "hover:bg-gray-50/50"}>
                                            <TableHead className={`w-[3%] ${dynamicTableHeaderTextClasses}`}>Sel</TableHead>
                                            <TableHead className={`w-[10%] ${dynamicTableHeaderTextClasses}`}>Status</TableHead>
                                            <TableHead className={`w-[10%] ${dynamicTableHeaderTextClasses}`}>Type</TableHead>
                                            <TableHead className={`w-[15%] ${dynamicTableHeaderTextClasses}`}>User</TableHead>
                                            <TableHead className={`w-[40%] ${dynamicTableHeaderTextClasses}`}>Message</TableHead>
                                            <TableHead className={`w-[12%] ${dynamicTableHeaderTextClasses}`}>Submitted</TableHead>
                                            <TableHead className={`w-[10%] text-center ${dynamicTableHeaderTextClasses}`}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...Array(pageSize)].map((_, index) => (
                                            <TableRow key={index} className={isDarkMode ? "bg-neutral-900" : "bg-white"}>
                                                <TableCell><Skeleton className={`h-4 w-4 rounded ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /></TableCell>
                                                <TableCell><Skeleton className={`h-6 w-16 ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /></TableCell>
                                                <TableCell><Skeleton className={`h-6 w-20 ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /></TableCell>
                                                <TableCell><Skeleton className={`h-6 w-28 ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /></TableCell>
                                                <TableCell><Skeleton className={`h-6 w-full ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /></TableCell>
                                                <TableCell><Skeleton className={`h-6 w-20 ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /></TableCell>
                                                <TableCell><div className="flex gap-1 justify-center"><Skeleton className={`h-8 w-8 ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /><Skeleton className={`h-8 w-8 ${isDarkMode ? "bg-neutral-800" : "bg-gray-100"}`} /></div></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    ) : paginatedFeedbacks.length === 0 ? (
                        <Card className={`${dynamicCardClasses} p-8 text-center`}>
                            <p className={`text-xl font-medium ${isDarkMode ? "text-neutral-400" : "text-gray-600"}`}>No feedback found matching the filters.</p>
                        </Card>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                            {paginatedFeedbacks.map((fb) => (
                                <Dialog key={fb.id} onOpenChange={(open) => !open && setSelectedItem(null)}>
                                    <Card
                                        className={cn(`transition-all duration-300 rounded-lg border hover:shadow-lg`, dynamicCardClasses, getRowClass(fb.resolved, fb.partially_solved).split(" ").filter(c => c.startsWith('border-l-4')).join(' '))}
                                    >
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`font-medium ${getStatusBadgeClasses(fb.resolved, fb.partially_solved)}`}>
                                                        {fb.resolved ? "Resolved" : fb.partially_solved ? "Partial" : "Pending"}
                                                    </Badge>
                                                    <Badge variant="outline" className={`inline-flex items-center font-medium ${getTypeBadgeClasses(fb.type)}`}>
                                                        {getTypeIcon(fb.type)} <span className="ml-1">{fb.type}</span>
                                                    </Badge>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(fb.id)}
                                                    onChange={() => toggleSelect(fb.id)}
                                                    className={`form-checkbox rounded-sm h-5 w-5 cursor-pointer ${isDarkMode ? "text-blue-500 bg-neutral-800 border-neutral-600" : "text-blue-500 bg-white border-gray-300"}`}
                                                />
                                            </div>

                                            <DialogTrigger asChild onClick={() => setSelectedItem(fb)}>
                                                <div className="cursor-pointer space-y-1">
                                                    <p className={`text-base font-semibold ${dynamicTableTextClasses}`}>{fb.name}</p>
                                                    <p className={`text-sm ${isDarkMode ? "text-neutral-400" : "text-gray-500"}`}>{fb.email}</p>
                                                    <p className={`text-xs ${isDarkMode ? "text-neutral-500" : "text-gray-400"}`}>{format(new Date(fb.created_at), "MMM d, yy")}</p>
                                                    <p className={`text-sm ${dynamicTableTextClasses} line-clamp-2 mt-2 pt-2 border-t border-gray-100 dark:border-neutral-800`}>{fb.message}</p>
                                                </div>
                                            </DialogTrigger>

                                            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 dark:border-neutral-800">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-medium ${dynamicTableTextClasses}`}>Resolved:</span>
                                                    <Switch
                                                        checked={fb.resolved}
                                                        onCheckedChange={(checked) => updateFeedbackStatus(fb.id, checked, !checked ? fb.partially_solved || false : false)}
                                                        className={isDarkMode ? "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-neutral-600" : "data-[state=checked]:bg-green-500"}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-medium ${dynamicTableTextClasses}`}>Partial:</span>
                                                    <Switch
                                                        checked={fb.partially_solved && !fb.resolved} 
                                                        onCheckedChange={(checked) => updateFeedbackStatus(fb.id, checked ? false : fb.resolved, checked)}
                                                        className={isDarkMode ? "data-[state=checked]:bg-amber-600 data-[state=unchecked]:bg-neutral-600" : "data-[state=checked]:bg-amber-500"}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Dialog>
                            ))}
                        </div>
                    ) : (
                        // List View (Table)
                        <div className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-neutral-800" : "border-gray-200"} shadow-xl`}>
                            <ScrollArea className="h-[65vh] max-h-[800px] w-full">
                                <Table className="min-w-full">
                                    <TableHeader className={dynamicTableClasses}>
                                        <TableRow className={isDarkMode ? "hover:bg-neutral-700/50" : "hover:bg-gray-50/50"}>
                                            <TableHead className={`w-[3%] ${dynamicTableHeaderTextClasses}`}>Sel</TableHead>
                                            <TableHead className={`w-[10%] ${dynamicTableHeaderTextClasses}`}>Status</TableHead>
                                            <TableHead className={`w-[10%] ${dynamicTableHeaderTextClasses}`}>Type</TableHead>
                                            <TableHead className={`w-[15%] ${dynamicTableHeaderTextClasses}`}>User</TableHead>
                                            <TableHead className={`w-[40%] ${dynamicTableHeaderTextClasses}`}>Message</TableHead>
                                            <TableHead className={`w-[12%] ${dynamicTableHeaderTextClasses}`}>Submitted / Updated</TableHead>
                                            <TableHead className={`w-[10%] text-center ${dynamicTableHeaderTextClasses}`}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className={dynamicTableBodyClasses}>
                                        {paginatedFeedbacks.map((fb) => (
                                            <Dialog key={fb.id} onOpenChange={(open) => !open && setSelectedItem(null)}>
                                                <TableRow
                                                    className={cn(getRowClass(fb.resolved, fb.partially_solved), `${selectedIds.includes(fb.id) ? (isDarkMode ? "bg-neutral-800/80" : "bg-gray-100/80") : ""}`)}
                                                >
                                                    <TableCell className="py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(fb.id)}
                                                            onChange={() => toggleSelect(fb.id)}
                                                            className={`form-checkbox rounded-sm h-4 w-4 cursor-pointer ${isDarkMode ? "text-blue-500 bg-neutral-800 border-neutral-600" : "text-blue-500 bg-white border-gray-300"}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <InlineStatusEditor fb={fb} />
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <Badge variant="outline" className={`inline-flex items-center font-medium ${getTypeBadgeClasses(fb.type)}`}>
                                                            {getTypeIcon(fb.type)} <span className="ml-1">{fb.type}</span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <UserContactPopover name={fb.name} email={fb.email} />
                                                        <p className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-gray-500"}`}>{fb.email}</p>
                                                    </TableCell>
                                                    <TableCell className={`text-sm max-w-lg truncate py-3`}>
                                                        <DialogTrigger onClick={() => setSelectedItem(fb)} className={`text-left ${dynamicTableTextClasses} hover:text-blue-500 transition-colors`}>
                                                            {fb.message}
                                                        </DialogTrigger>
                                                    </TableCell>
                                                    <TableCell className="text-sm py-3">
                                                        <p className={isDarkMode ? "text-neutral-300 font-medium" : "text-gray-700 font-medium"}>{format(new Date(fb.created_at), "MMM d, yy")}</p>
                                                        {fb.last_updated && (
                                                            <p className={`text-xs italic ${isDarkMode ? "text-neutral-500" : "text-gray-400"}`}>
                                                                Updated: {format(new Date(fb.last_updated), "p")}
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <div className="flex gap-1 justify-center">
                                                            <Button size="icon" onClick={() => markResolved(fb.id)} className={`h-8 w-8 transition-all duration-200 ${getActionButtonClasses('resolve')}`} title="Mark Resolved">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="icon" onClick={() => markPartiallySolved(fb.id)} className={`h-8 w-8 transition-all duration-200 ${getActionButtonClasses('partial')}`} title="Mark Partially Solved">
                                                                <AlertTriangle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </Dialog>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    )}
                </section>

                {/* --- Pagination Footer --- */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-4">
                    <div className={`text-sm ${isDarkMode ? "text-neutral-400" : "text-gray-600"} mb-4 md:mb-0`}>
                        Showing **{((currentPage - 1) * pageSize) + 1}** to **{Math.min(currentPage * pageSize, totalCount)}** of **{totalCount}** results.
                    </div>

                    <div className="flex items-center gap-4">
                        <Select onValueChange={handlePageSizeChange} value={String(pageSize)}>
                            <SelectTrigger className={`w-[120px] ${dynamicInputClasses}`}>
                                <SelectValue placeholder="Page Size" />
                            </SelectTrigger>
                            <SelectContent className={dynamicSelectContentClasses}>
                                {PAGE_SIZE_OPTIONS.map(size => (
                                    <SelectItem key={size} value={String(size)} className={dynamicSelectMenuItemClasses}>{size} per page</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-40' : ''}
                                    />
                                </PaginationItem>

                                <PaginationItem>
                                    <span className={`px-4 py-2 text-sm font-medium ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                        className={currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-40' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>

            {/* --- Feedback Detail Dialog (Modal) --- */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className={isDarkMode ? "bg-neutral-900 text-neutral-100 border-neutral-800 sm:max-w-[550px]" : "bg-white text-gray-900 sm:max-w-[550px] shadow-2xl"}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{selectedItem?.type} Details</DialogTitle>
                        <DialogDescription className={isDarkMode ? "text-neutral-400" : "text-gray-500"}>
                            Submitted by **{selectedItem?.name}** ({selectedItem?.email})
                        </DialogDescription>
                    </DialogHeader>

                    {selectedItem && (
                        <ScrollArea className="h-[70vh] max-h-[600px] p-2 pr-4">
                            <div className="space-y-6 pt-2">
                                {/* Status & Type Block */}
                                <div className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-neutral-800">
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Current Status</p>
                                        <Badge className={`text-base font-medium ${getStatusBadgeClasses(selectedItem.resolved, selectedItem.partially_solved)}`}>
                                            {selectedItem.resolved ? "Fully Resolved" : selectedItem.partially_solved ? "Partially Solved" : "Pending Review"}
                                        </Badge>
                                        <Badge variant="outline" className={`text-sm inline-flex items-center font-medium ${getTypeBadgeClasses(selectedItem.type)} mt-2`}>
                                            {getTypeIcon(selectedItem.type)} <span className="ml-1">{selectedItem.type}</span>
                                        </Badge>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Submitted</p>
                                        <p className={isDarkMode ? "text-neutral-300" : "text-gray-700"}>
                                            {format(new Date(selectedItem.created_at), "MMM d, yyyy")}
                                        </p>
                                        <p className={`text-xs ${isDarkMode ? "text-neutral-500" : "text-gray-400"}`}>{format(new Date(selectedItem.created_at), "p")}</p>
                                    </div>
                                </div>

                                {/* Message Block */}
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Full Message Content</p>
                                    <p className={`whitespace-pre-wrap leading-relaxed ${isDarkMode ? "text-neutral-200" : "text-gray-800"}`}>
                                        {selectedItem.message}
                                    </p>
                                </div>

                                <Separator className={isDarkMode ? "bg-neutral-800" : "bg-gray-200"} />

                                {/* Action Block with Switches */}
                                <div className="space-y-4">
                                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Quick Status Update</p>
                                    
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
                                        <p className="font-medium flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" /> Mark as **Fully Resolved**
                                        </p>
                                        <Switch
                                            checked={selectedItem.resolved}
                                            onCheckedChange={(checked) => updateFeedbackStatus(selectedItem.id, checked, !checked ? selectedItem.partially_solved || false : false)}
                                            className={isDarkMode ? "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-neutral-600" : "data-[state=checked]:bg-green-500"}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
                                        <p className="font-medium flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-500" /> Mark as **Partially Solved**
                                        </p>
                                        <Switch
                                            checked={selectedItem.partially_solved && !selectedItem.resolved}
                                            onCheckedChange={(checked) => updateFeedbackStatus(selectedItem.id, selectedItem.resolved, checked)}
                                            className={isDarkMode ? "data-[state=checked]:bg-amber-600 data-[state=unchecked]:bg-neutral-600" : "data-[state=checked]:bg-amber-500"}
                                        />
                                    </div>

                                    <Button onClick={() => markUnresolved(selectedItem.id)} variant="outline" className={`w-full mt-2 transition-colors duration-200 ${isDarkMode ? "border-rose-700 text-rose-300 hover:bg-rose-900" : "border-rose-300 text-rose-600 hover:bg-rose-50"}`}>
                                        <Clock className="h-4 w-4 mr-2" /> Reset Status to Pending
                                    </Button>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}