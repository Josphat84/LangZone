"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import {
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line,
  Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon, Clock, TrendingUp, AlertCircle, Search, 
  Download, Filter, X, Users, BarChart3, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Minus, Sparkles, Activity,
  Target, Zap, Award, Timer, UserCheck, FileText, Info
} from "lucide-react";
import { format } from "date-fns";

// Mock Supabase
const mockSupabase = {
  from: (table: string) => ({
    select: (cols?: string) => ({
      order: (col: string, opts?: any) => ({
        then: (cb: any) => {
          setTimeout(() => {
            if (table === "employees") cb({ data: mockEmployees, error: null });
            else cb({ data: mockRequests, error: null });
          }, 300);
          return Promise.resolve({ data: [], error: null });
        }
      }),
      eq: (col: string, val: any) => ({
        then: (cb: any) => {
          setTimeout(() => cb({ data: [], error: null }), 300);
          return Promise.resolve({ data: [], error: null });
        }
      })
    }),
    insert: (data: any) => ({
      then: (cb: any) => {
        setTimeout(() => cb({ data: null, error: null }), 300);
        return Promise.resolve({ data: null, error: null });
      }
    }),
    update: (data: any) => ({
      eq: (col: string, val: any) => ({
        then: (cb: any) => {
          setTimeout(() => cb({ data: null, error: null }), 300);
          return Promise.resolve({ data: null, error: null });
        }
      })
    })
  })
};

const mockEmployees = [
  { id: "1", full_name: "Alice Johnson", department: "Engineering", position: "Senior Developer" },
  { id: "2", full_name: "Bob Smith", department: "Marketing", position: "Marketing Manager" },
  { id: "3", full_name: "Carol White", department: "Engineering", position: "DevOps Engineer" },
  { id: "4", full_name: "David Brown", department: "Sales", position: "Sales Executive" },
  { id: "5", full_name: "Emma Davis", department: "Engineering", position: "Frontend Developer" },
  { id: "6", full_name: "Frank Miller", department: "Operations", position: "Operations Lead" },
];

const mockRequests = [
  { id: "1", employee_id: "1", date: "2025-01-15", start_time: "18:00", end_time: "22:00", total_hours: 4, reason: "Critical bug fix for production", status: "approved", supervisor_comment: "Well done", employees: { full_name: "Alice Johnson" } },
  { id: "2", employee_id: "2", date: "2025-01-16", start_time: "17:00", end_time: "20:00", total_hours: 3, reason: "Campaign launch preparation", status: "pending", supervisor_comment: null, employees: { full_name: "Bob Smith" } },
  { id: "3", employee_id: "1", date: "2025-01-20", start_time: "19:00", end_time: "23:00", total_hours: 4, reason: "Production deployment", status: "approved", supervisor_comment: null, employees: { full_name: "Alice Johnson" } },
  { id: "4", employee_id: "3", date: "2025-01-22", start_time: "20:00", end_time: "02:00", total_hours: 6, reason: "Server maintenance", status: "rejected", supervisor_comment: "Not pre-approved", employees: { full_name: "Carol White" } },
  { id: "5", employee_id: "4", date: "2025-01-18", start_time: "16:00", end_time: "21:00", total_hours: 5, reason: "Client presentation", status: "approved", supervisor_comment: null, employees: { full_name: "David Brown" } },
  { id: "6", employee_id: "5", date: "2025-01-19", start_time: "18:00", end_time: "23:00", total_hours: 5, reason: "UI/UX improvements", status: "approved", supervisor_comment: null, employees: { full_name: "Emma Davis" } },
  { id: "7", employee_id: "1", date: "2025-01-25", start_time: "17:00", end_time: "22:00", total_hours: 5, reason: "Database optimization", status: "approved", supervisor_comment: null, employees: { full_name: "Alice Johnson" } },
  { id: "8", employee_id: "6", date: "2025-01-23", start_time: "19:00", end_time: "01:00", total_hours: 6, reason: "Inventory management", status: "pending", supervisor_comment: null, employees: { full_name: "Frank Miller" } },
];

const GRADIENT_COLORS = [
  { start: '#3b82f6', end: '#1d4ed8' },
  { start: '#ef4444', end: '#b91c1c' },
  { start: '#10b981', end: '#047857' },
  { start: '#f59e0b', end: '#d97706' },
  { start: '#8b5cf6', end: '#6d28d9' },
  { start: '#06b6d4', end: '#0891b2' },
  { start: '#ec4899', end: '#be185d' },
  { start: '#6366f1', end: '#4338ca' },
];

// Enhanced Tooltip for Bar Chart with trend info
const EnhancedBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-primary/30 rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/20">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <CalendarIcon className="h-4 w-4 text-primary" />
          </div>
          <p className="font-bold text-sm text-primary">{label}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Total Hours
            </span>
            <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {data.value.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-dashed">
            <span className="text-xs text-muted-foreground">Avg Per Day</span>
            <span className="font-semibold text-xs">{(data.value / 1).toFixed(1)} hrs</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Enhanced Pie Tooltip with detailed breakdown
const EnhancedPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, percent } = payload[0];
    const avgPerRequest = value / 2; // Mock calculation
    
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-primary/30 rounded-2xl shadow-2xl p-4 backdrop-blur-xl min-w-[240px]">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/20">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="font-bold text-sm text-primary truncate">{name}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Total Hours
            </span>
            <span className="font-extrabold text-base bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {value.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Percentage
            </span>
            <span className="font-bold text-primary text-sm">{(percent * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-dashed">
            <span className="text-xs text-muted-foreground">Avg/Request</span>
            <span className="font-semibold text-xs">{avgPerRequest.toFixed(1)} hrs</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Top contributor in team</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Line Chart Tooltip
const LineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-primary/30 rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
        <p className="font-bold text-sm text-primary mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{entry.name}:</span>
              <span className="font-bold text-sm">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent * 100 < 5) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-xs drop-shadow-lg">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface Employee {
  id: string;
  full_name: string;
  department: string;
  position: string;
}

interface OvertimeRequest {
  id: string;
  employee_id: string;
  date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  supervisor_comment: string | null;
  employees: { full_name: string } | null;
}

interface AppAlert {
  type: 'success' | 'error' | 'info' | null;
  message: string;
}

const getStatusColor = (status: OvertimeRequest['status']) => {
  switch (status) {
    case "approved": return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg shadow-green-500/30";
    case "rejected": return "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg shadow-red-500/30";
    default: return "bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0 shadow-lg shadow-yellow-500/30";
  }
};

const calculateHours = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const fixedDate = '2000-01-01T';
  let startDate = new Date(fixedDate + start);
  let endDate = new Date(fixedDate + end);
  if (endDate.getTime() <= startDate.getTime()) {
    endDate.setDate(endDate.getDate() + 1);
  }
  const totalHours = (endDate.getTime() - startDate.getTime()) / 3600000;
  return totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : 0;
};

export default function OvertimePage() {
  const supabase = mockSupabase;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AppAlert>({ type: null, message: '' });

  const [empName, setEmpName] = useState("");
  const [empDept, setEmpDept] = useState("");
  const [empPos, setEmpPos] = useState("");
  const [empErrors, setEmpErrors] = useState({ name: "", dept: "", pos: "" });

  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({ employeeId: "", date: "", startTime: "", endTime: "" });
  const [totalHoursDisplay, setTotalHoursDisplay] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchRequests();
  }, []);

  useEffect(() => {
    setTotalHoursDisplay(calculateHours(startTime, endTime));
  }, [startTime, endTime]);

  const showAlert = useCallback((type: AppAlert['type'], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: '' }), 4000);
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    const { data, error } = await supabase.from("employees").select("*").order("full_name");
    if (!error) setEmployees(data as Employee[] || []);
    setLoading(false);
  }

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("overtime_requests")
      .select("*, employees(full_name)")
      .order("date", { ascending: false });
    if (!error) setRequests(data as OvertimeRequest[] || []);
    setLoading(false);
  }

  const addEmployee = useCallback(async () => {
    const newErrors = { name: "", dept: "", pos: "" };
    let hasError = false;
    if (!empName.trim()) { newErrors.name = "Name is required"; hasError = true; }
    if (!empDept.trim()) { newErrors.dept = "Department is required"; hasError = true; }
    if (!empPos.trim()) { newErrors.pos = "Position is required"; hasError = true; }
    setEmpErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    const { error } = await supabase.from("employees").insert({
      full_name: empName.trim(),
      department: empDept.trim(),
      position: empPos.trim(),
    });
    setLoading(false);

    if (error) {
      showAlert("error", `Failed to add employee: ${error.message}`);
    } else {
      showAlert("success", "✨ Employee added successfully!");
      setEmpName("");
      setEmpDept("");
      setEmpPos("");
      setEmpErrors({ name: "", dept: "", pos: "" });
      fetchEmployees();
    }
  }, [empName, empDept, empPos, showAlert, supabase]);

  const addRequest = useCallback(async () => {
    const newErrors = { employeeId: "", date: "", startTime: "", endTime: "" };
    let hasError = false;

    if (!employeeId) { newErrors.employeeId = "Select an employee"; hasError = true; }
    if (!date) { newErrors.date = "Select a date"; hasError = true; }
    if (!startTime) { newErrors.startTime = "Select start time"; hasError = true; }
    if (!endTime) { newErrors.endTime = "Select end time"; hasError = true; }

    if (totalHoursDisplay <= 0) {
      newErrors.endTime = "End time must be after start time";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      showAlert("error", "Please correct the form errors");
      return;
    }

    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      showAlert("error", "Employee not found");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("overtime_requests").insert({
      employee_id: employeeId,
      employee_name: employee.full_name,
      date,
      start_time: startTime,
      end_time: endTime,
      total_hours: totalHoursDisplay,
      reason: reason.trim(),
      status: "pending",
    });
    setLoading(false);

    if (error) {
      showAlert("error", `Submission failed: ${error.message}`);
    } else {
      showAlert("success", "🎉 Overtime request submitted successfully!");
      setEmployeeId("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
      setErrors({ employeeId: "", date: "", startTime: "", endTime: "" });
      fetchRequests();
    }
  }, [employeeId, date, startTime, endTime, reason, totalHoursDisplay, employees, showAlert, supabase]);

  async function updateStatus(id: string, status: OvertimeRequest['status'], comment: string) {
    setLoading(true);
    const { error } = await supabase
      .from("overtime_requests")
      .update({ status, supervisor_comment: comment })
      .eq("id", id);
    setLoading(false);

    if (error) {
      showAlert("error", `Failed to ${status}`);
    } else {
      showAlert("success", `✅ Request ${status}!`);
      fetchRequests();
    }
  }

  const uniqueDepartments = useMemo(() => {
    const departments = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(departments).sort();
  }, [employees]);

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesName = r.employees?.full_name?.toLowerCase().includes(search);
        const matchesReason = r.reason?.toLowerCase().includes(search);
        if (!matchesName && !matchesReason) return false;
      }

      if (filterEmployeeId && filterEmployeeId !== "__ALL__" && r.employee_id !== filterEmployeeId) return false;
      
      if (filterDepartment && filterDepartment !== "__ALL__") {
        const employee = employees.find(e => e.id === r.employee_id);
        if (!employee || employee.department !== filterDepartment) return false;
      }

      if (filterStatus && filterStatus !== "__ALL__" && r.status !== filterStatus) return false;

      const requestDate = new Date(r.date);
      if (filterStartDate && requestDate < filterStartDate) return false;
      if (filterEndDate) {
        const endDatePlusOne = new Date(filterEndDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        if (requestDate >= endDatePlusOne) return false;
      }

      return true;
    });
  }, [requests, employees, searchTerm, filterEmployeeId, filterDepartment, filterStatus, filterStartDate, filterEndDate]);

  const barChartData = useMemo(() => {
    const dataMap: { [date: string]: number } = {};
    filteredRequests.forEach(r => {
      if (r.status === "approved") {
        dataMap[r.date] = (dataMap[r.date] || 0) + r.total_hours;
      }
    });
    return Object.keys(dataMap)
      .map(date => ({ date, hours: parseFloat(dataMap[date].toFixed(2)) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredRequests]);

  const pieChartData = useMemo(() => {
    const dataMap: { [employeeName: string]: number } = {};
    filteredRequests.forEach(r => {
      if (r.status === "approved" && r.employees?.full_name) {
        const name = r.employees.full_name;
        dataMap[name] = (dataMap[name] || 0) + r.total_hours;
      }
    });
    return Object.keys(dataMap)
      .map(name => ({ name, value: parseFloat(dataMap[name].toFixed(2)) }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [filteredRequests]);

  const departmentData = useMemo(() => {
    const dataMap: { [dept: string]: number } = {};
    filteredRequests.forEach(r => {
      if (r.status === "approved") {
        const emp = employees.find(e => e.id === r.employee_id);
        if (emp) {
          dataMap[emp.department] = (dataMap[emp.department] || 0) + r.total_hours;
        }
      }
    });
    return Object.keys(dataMap).map(dept => ({ 
      department: dept, 
      hours: parseFloat(dataMap[dept].toFixed(2)) 
    }));
  }, [filteredRequests, employees]);

  const stats = useMemo(() => {
    const approved = filteredRequests.filter(r => r.status === "approved");
    const totalApprovedHours = approved.reduce((sum, r) => sum + r.total_hours, 0);
    const totalPendingRequests = filteredRequests.filter(r => r.status === "pending").length;
    const averageHours = approved.length > 0 ? totalApprovedHours / approved.length : 0;
    
    const lastMonth = filteredRequests.filter(r => {
      const date = new Date(r.date);
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      return date >= lastMonthDate && r.status === "approved";
    });
    const lastMonthHours = lastMonth.reduce((sum, r) => sum + r.total_hours, 0);
    const trend = totalApprovedHours > lastMonthHours ? 'up' : totalApprovedHours < lastMonthHours ? 'down' : 'same';
    
    return {
      totalApprovedHours,
      totalPendingRequests,
      averageHours,
      totalRequests: filteredRequests.length,
      approvalRate: filteredRequests.length > 0 ? (approved.length / filteredRequests.length * 100) : 0,
      trend,
      trendValue: lastMonthHours > 0 ? ((totalApprovedHours - lastMonthHours) / lastMonthHours * 100) : 0
    };
  }, [filteredRequests]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterEmployeeId("");
    setFilterDepartment("");
    setFilterStatus("");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
  };

  const activeFilterCount = [
    searchTerm,
    filterEmployeeId && filterEmployeeId !== "__ALL__",
    filterDepartment && filterDepartment !== "__ALL__",
    filterStatus && filterStatus !== "__ALL__",
    filterStartDate,
    filterEndDate
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Overtime Hub
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Track, analyze & manage with precision
              </p>
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert.type && (
          <div className={`relative overflow-hidden rounded-2xl p-5 text-white font-medium shadow-2xl animate-in slide-in-from-top duration-500 ${
            alert.type === 'success' ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600' : 
            alert.type === 'error' ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600' :
            'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  {alert.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                </div>
                <p className="text-sm md:text-base font-semibold">{alert.message}</p>
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-xl transition-all" 
                onClick={() => setAlert({ type: null, message: '' })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-primary/20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-3 text-sm text-muted-foreground font-medium">Loading data...</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="employee" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 relative z-10">
            <TabsTrigger 
              value="employee" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 text-xs sm:text-sm font-semibold relative z-20"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Employee Portal</span>
              <span className="sm:hidden">Employee</span>
            </TabsTrigger>
            <TabsTrigger 
              value="supervisor" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 text-xs sm:text-sm font-semibold relative z-20"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Supervisor</span>
              <span className="sm:hidden">Review</span>
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 text-xs sm:text-sm font-semibold relative z-20"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* EMPLOYEE VIEW */}
          <TabsContent value="employee" className="space-y-6 animate-in fade-in duration-500">
            <Card className="shadow-2xl border-2 border-blue-100 dark:border-blue-900/30 overflow-hidden group hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Register New Employee</CardTitle>
                    <CardDescription className="text-sm">Add personnel before submitting overtime requests</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Label htmlFor="empName" className="text-sm font-semibold flex items-center gap-2">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    id="empName"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className={`transition-all duration-300 ${empErrors.name ? "border-red-500 ring-2 ring-red-500/20" : "focus:ring-2 focus:ring-primary/20"}`}
                    placeholder="John Doe"
                  />
                  {empErrors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left duration-200">
                      <AlertCircle className="h-3 w-3" />
                      {empErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empDept" className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    Department
                  </Label>
                  <Input
                    id="empDept"
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className={`transition-all duration-300 ${empErrors.dept ? "border-red-500 ring-2 ring-red-500/20" : "focus:ring-2 focus:ring-primary/20"}`}
                    placeholder="Engineering"
                  />
                  {empErrors.dept && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left duration-200">
                      <AlertCircle className="h-3 w-3" />
                      {empErrors.dept}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empPos" className="text-sm font-semibold flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-primary" />
                    Position
                  </Label>
                  <Input
                    id="empPos"
                    value={empPos}
                    onChange={(e) => setEmpPos(e.target.value)}
                    className={`transition-all duration-300 ${empErrors.pos ? "border-red-500 ring-2 ring-red-500/20" : "focus:ring-2 focus:ring-primary/20"}`}
                    placeholder="Senior Developer"
                  />
                  {empErrors.pos && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left duration-200">
                      <AlertCircle className="h-3 w-3" />
                      {empErrors.pos}
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button 
                    onClick={addEmployee} 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Employee"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-2 border-indigo-100 dark:border-indigo-900/30 overflow-hidden group hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-indigo-100 dark:border-indigo-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                    <Timer className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Request Overtime</CardTitle>
                    <CardDescription className="text-sm">Submit a new overtime work request</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Employee
                  </Label>
                  <Select value={employeeId} onValueChange={setEmployeeId}>
                    <SelectTrigger className={`transition-all duration-300 ${errors.employeeId ? "border-red-500 ring-2 ring-red-500/20" : "focus:ring-2 focus:ring-primary/20"}`}>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employeeId && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left duration-200">
                      <AlertCircle className="h-3 w-3" />
                      {errors.employeeId}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`transition-all duration-300 ${errors.date ? "border-red-500 ring-2 ring-red-500/20" : "focus:ring-2 focus:ring-primary/20"}`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left duration-200">
                      <AlertCircle className="h-3 w-3" />
                      {errors.date}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-full p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/30 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-2xl"></div>
                    <div className="relative text-center">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        Calculated Hours
                      </p>
                      <p className={`text-4xl font-black transition-all duration-500 ${totalHoursDisplay > 0 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent scale-110' : 'text-gray-300 dark:text-gray-700'}`}>
                        {totalHoursDisplay.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">Total Hours</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`transition-all duration-300 ${errors.startTime ? "border-red-500 ring-2 ring-red-500/20" : "focus:ring-2 focus:ring-primary/20"}`}
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left duration-200">
                      <AlertCircle className="h-3 w-3" />
                      {errors.startTime}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    End Time
                  </Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`transition-all duration-300 ${errors.endTime ? "border-red-500 ring-2 ring-red-500/20" : "focus:ring-2 focus:ring-primary/20"}`}
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-left duration-200">
                      <AlertCircle className="h-3 w-3" />
                      {errors.endTime}
                    </p>
                  )}
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Reason
                  </Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Project Deadline, System Maintenance, Client Emergency"
                    className="min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button 
                    onClick={addRequest} 
                    disabled={loading || totalHoursDisplay <= 0}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPERVISOR VIEW */}
          <TabsContent value="supervisor" className="animate-in fade-in duration-500">
            <Card className="shadow-2xl border-2 border-amber-100 dark:border-amber-900/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-b border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Pending Requests</CardTitle>
                      <CardDescription className="text-sm">Review and manage pending overtime requests</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 text-base shadow-lg border-0">
                    {requests.filter((r) => r.status === "pending").length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                {requests.filter((r) => r.status === "pending").length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/30">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative p-5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full shadow-xl">
                          <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                      🎉 All Clear!
                    </p>
                    <p className="text-sm text-muted-foreground">No pending requests at the moment</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border-b-2">
                          <TableHead className="font-bold text-slate-700 dark:text-slate-300">Employee</TableHead>
                          <TableHead className="font-bold text-slate-700 dark:text-slate-300">Date</TableHead>
                          <TableHead className="font-bold text-slate-700 dark:text-slate-300">Hours</TableHead>
                          <TableHead className="font-bold text-slate-700 dark:text-slate-300">Reason</TableHead>
                          <TableHead className="font-bold text-slate-700 dark:text-slate-300 min-w-[200px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.filter((r) => r.status === "pending").map((r) => (
                          <SupervisorRow key={r.id} r={r} onAction={updateStatus} disabled={loading} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADMIN VIEW */}
          <TabsContent value="admin" className="animate-in fade-in duration-500">
            <Card className="shadow-2xl border-2 border-purple-100 dark:border-purple-900/30">
              <CardHeader className="space-y-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-purple-100 dark:border-purple-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl md:text-3xl font-black">Overtime Analytics</CardTitle>
                      <CardDescription className="text-sm">Advanced insights and visualizations</CardDescription>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>

                {/* Search & Filter */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by employee name or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-12 rounded-xl border-2 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-2 h-12 px-6 rounded-xl border-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">{activeFilterCount}</Badge>
                      )}
                    </Button>
                  </div>

                  {showFilters && (
                    <div className="flex flex-wrap gap-4 p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800/30 animate-in slide-in-from-top duration-300">
                      <div className="w-full sm:w-[200px] space-y-2">
                        <Label className="text-xs font-bold">Employee</Label>
                        <Select value={filterEmployeeId} onValueChange={setFilterEmployeeId}>
                          <SelectTrigger className="h-10 rounded-xl">
                            <SelectValue placeholder="All Employees" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__ALL__">All Employees</SelectItem>
                            {employees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full sm:w-[160px] space-y-2">
                        <Label className="text-xs font-bold">Department</Label>
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                          <SelectTrigger className="h-10 rounded-xl">
                            <SelectValue placeholder="All Depts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__ALL__">All Departments</SelectItem>
                            {uniqueDepartments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full sm:w-[120px] space-y-2">
                        <Label className="text-xs font-bold">Status</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="h-10 rounded-xl">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__ALL__">All Statuses</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full sm:w-[150px] space-y-2">
                        <Label className="text-xs font-bold">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal h-10 rounded-xl">
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {filterStartDate ? format(filterStartDate, "PP") : <span className="text-xs">Pick date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={filterStartDate} onSelect={setFilterStartDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="w-full sm:w-[150px] space-y-2">
                        <Label className="text-xs font-bold">End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal h-10 rounded-xl">
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {filterEndDate ? format(filterEndDate, "PP") : <span className="text-xs">Pick date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={filterEndDate} onSelect={setFilterEndDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {activeFilterCount > 0 && (
                        <div className="flex items-end">
                          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 h-10 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600">
                            <X className="h-4 w-4" />
                            Clear All
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="relative overflow-hidden shadow-xl border-2 border-blue-100 dark:border-blue-900/30 hover:shadow-2xl transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between pb-3 space-y-0">
                      <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Total Hours</CardTitle>
                      <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {stats.totalApprovedHours.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${stats.trend === 'up' ? 'bg-green-100 text-green-700' : stats.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} border-0`}>
                          {stats.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : stats.trend === 'down' ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                          {Math.abs(stats.trendValue).toFixed(1)}%
                        </Badge>
                        <p className="text-xs text-muted-foreground">vs last month</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden shadow-xl border-2 border-amber-100 dark:border-amber-900/30 hover:shadow-2xl transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-full blur-3xl"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between pb-3 space-y-0">
                      <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Pending</CardTitle>
                      <div className="p-2.5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl shadow-lg">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {stats.totalPendingRequests}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden shadow-xl border-2 border-emerald-100 dark:border-emerald-900/30 hover:shadow-2xl transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between pb-3 space-y-0">
                      <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Avg Hours</CardTitle>
                      <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {stats.averageHours.toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Per request</p>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden shadow-xl border-2 border-purple-100 dark:border-purple-900/30 hover:shadow-2xl transition-all duration-300 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
                    <CardHeader className="relative flex flex-row items-center justify-between pb-3 space-y-0">
                      <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Approval Rate</CardTitle>
                      <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {stats.approvalRate.toFixed(0)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Of all requests</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <Card className="p-6 shadow-xl border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative p-0 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                              <BarChart3 className="h-4 w-4 text-white" />
                            </div>
                            Overtime Trend
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">Daily approved hours over time</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="relative h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))" 
                            tickLine={false} 
                            axisLine={false} 
                            className="text-xs font-medium"
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            tickLine={false} 
                            axisLine={false}
                            className="text-xs font-medium"
                          />
                          <Tooltip content={<EnhancedBarTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.1)' }} />
                          <Bar 
                            dataKey="hours" 
                            fill="url(#barGradient)"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Pie Chart */}
                  <Card className="p-6 shadow-xl border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative p-0 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            Employee Distribution
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">Total hours by employee</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="relative h-[300px]">
                      {pieChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <defs>
                              {GRADIENT_COLORS.map((color, idx) => (
                                <linearGradient key={idx} id={`pieGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={color.start} />
                                  <stop offset="100%" stopColor={color.end} />
                                </linearGradient>
                              ))}
                            </defs>
                            <Pie
                              data={pieChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={95}
                              paddingAngle={4}
                              labelLine={false}
                              label={renderCustomizedLabel}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={`url(#pieGradient${index % GRADIENT_COLORS.length})`}
                                  className="hover:opacity-80 transition-opacity cursor-pointer drop-shadow-lg"
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<EnhancedPieTooltip />} />
                            <Legend 
                              layout="vertical" 
                              align="right" 
                              verticalAlign="middle" 
                              wrapperStyle={{ paddingLeft: '10px', fontSize: '11px' }}
                              iconType="circle"
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Clock className="h-12 w-12 opacity-20 mb-3" />
                          <p className="text-sm font-medium">No data available</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Department Chart */}
                  <Card className="p-6 shadow-xl border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative p-0 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg">
                              <Target className="h-4 w-4 text-white" />
                            </div>
                            By Department
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">Overtime hours per department</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="relative h-[300px]">
                      {departmentData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={departmentData} layout="vertical">
                            <defs>
                              <linearGradient id="deptGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#047857" stopOpacity={0.7} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" horizontal={false} />
                            <XAxis 
                              type="number" 
                              stroke="hsl(var(--muted-foreground))" 
                              tickLine={false} 
                              axisLine={false}
                              className="text-xs"
                            />
                            <YAxis 
                              type="category" 
                              dataKey="department" 
                              stroke="hsl(var(--muted-foreground))" 
                              tickLine={false} 
                              axisLine={false}
                              width={100}
                              className="text-xs font-medium"
                            />
                            <Tooltip content={<EnhancedBarTooltip />} />
                            <Bar 
                              dataKey="hours" 
                              fill="url(#deptGradient)"
                              radius={[0, 8, 8, 0]}
                              maxBarSize={40}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Target className="h-12 w-12 opacity-20 mb-3" />
                          <p className="text-sm font-medium">No department data</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Area Chart - Cumulative */}
                  <Card className="p-6 shadow-xl border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="relative p-0 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                              <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                            Cumulative Trend
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">Running total of overtime hours</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="relative h-[300px]">
                      {barChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={barChartData.map((item, idx, arr) => ({
                            ...item,
                            cumulative: arr.slice(0, idx + 1).reduce((sum, d) => sum + d.hours, 0)
                          }))}>
                            <defs>
                              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#d97706" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                            <XAxis 
                              dataKey="date" 
                              stroke="hsl(var(--muted-foreground))" 
                              tickLine={false} 
                              axisLine={false}
                              className="text-xs"
                            />
                            <YAxis 
                              stroke="hsl(var(--muted-foreground))" 
                              tickLine={false} 
                              axisLine={false}
                              className="text-xs"
                            />
                            <Tooltip content={<LineTooltip />} />
                            <Area 
                              type="monotone" 
                              dataKey="cumulative" 
                              stroke="#f59e0b" 
                              strokeWidth={3}
                              fill="url(#areaGradient)"
                              name="Cumulative Hours"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <TrendingUp className="h-12 w-12 opacity-20 mb-3" />
                          <p className="text-sm font-medium">No trend data</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Records Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Detailed Records
                      <Badge className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                        {filteredRequests.length}
                      </Badge>
                    </h3>
                  </div>

                  <div className="overflow-x-auto border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border-b-2">
                          <TableHead className="font-bold text-xs">Employee</TableHead>
                          <TableHead className="font-bold text-xs">Department</TableHead>
                          <TableHead className="font-bold text-xs">Date</TableHead>
                          <TableHead className="font-bold text-xs">Hours</TableHead>
                          <TableHead className="font-bold text-xs">Status</TableHead>
                          <TableHead className="font-bold text-xs">Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-16">
                              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <Search className="h-12 w-12 opacity-20" />
                                <p className="text-base font-semibold">No records found</p>
                                <p className="text-xs">Try adjusting your search or filters</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRequests.map((r) => (
                            <TableRow key={r.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-900/50 dark:hover:to-transparent transition-all duration-200 border-b">
                              <TableCell className="font-semibold text-sm">{r.employees?.full_name}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {employees.find(e => e.id === r.employee_id)?.department || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground font-mono">{r.date}</TableCell>
                              <TableCell className="font-mono text-sm font-bold">{r.total_hours.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(r.status) + " text-xs font-semibold"}>
                                  {r.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                                {r.reason || "N/A"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Supervisor Row Component
function SupervisorRow({ r, onAction, disabled }: { r: OvertimeRequest; onAction: (id: string, status: OvertimeRequest['status'], comment: string) => void; disabled: boolean }) {
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approved" | "rejected">("approved");

  const handleAction = () => {
    if (actionType === "rejected" && !comment.trim()) return;
    onAction(r.id, actionType, comment);
    setIsDialogOpen(false);
    setComment("");
  };

  return (
    <TableRow className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-900/50 transition-all duration-200 border-b">
      <TableCell className="font-semibold text-sm">{r.employees?.full_name}</TableCell>
      <TableCell className="text-sm text-muted-foreground font-mono">{r.date}</TableCell>
      <TableCell className="font-mono text-sm font-bold">{r.total_hours.toFixed(2)}</TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{r.reason}</TableCell>
      <TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => { setActionType("approved"); setIsDialogOpen(true); }}
              disabled={disabled}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs shadow-md"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              onClick={() => { setActionType("rejected"); setIsDialogOpen(true); }}
              disabled={disabled}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs shadow-md"
            >
              <X className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
          <DialogContent className="sm:max-w-[550px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className={`p-2.5 rounded-xl ${actionType === "approved" ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'}`}>
                  {actionType === "approved" ? 
                    <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  }
                </div>
                {actionType === "approved" ? "Approve" : "Reject"} Request
              </DialogTitle>
              <p className="text-sm text-muted-foreground pt-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Employee: <span className="font-semibold text-foreground">{r.employees?.full_name}</span>
              </p>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-semibold">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Hours</p>
                      <p className="font-bold font-mono">{r.total_hours.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time Period</p>
                      <p className="font-medium">{r.start_time} - {r.end_time}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Supervisor Comment
                  {actionType === "rejected" && <span className="text-red-500 text-xs">(Required)</span>}
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={actionType === "approved" ? "Optional: Add approval notes..." : "Required: Provide reason for rejection..."}
                  className="min-h-[100px] focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={disabled || (actionType === "rejected" && !comment.trim())}
                className={`rounded-xl shadow-lg ${
                  actionType === "approved" 
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700" 
                    : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                } text-white`}
              >
                {disabled ? "Processing..." : `Confirm ${actionType === "approved" ? "Approval" : "Rejection"}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}