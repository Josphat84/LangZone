"use client";
import { useEffect, useState, useMemo } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
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
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

// --- COLOR PALETTE & UTILITIES ---

const DONUT_COLORS = [
    'hsl(210 70% 50%)',   // Blue
    'hsl(350 70% 50%)',   // Red
    'hsl(140 70% 50%)',   // Green
    'hsl(50 70% 50%)',    // Yellow/Gold
    'hsl(260 70% 50%)',   // Purple
    'hsl(180 70% 50%)',   // Cyan
    'hsl(30 70% 50%)',    // Orange
    'hsl(300 70% 50%)',   // Magenta
];

// Enhanced tooltip for Bar Chart
const CustomTooltip = ({ active, payload, label, dataKeyName = 'Value' }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0];
      const primaryLabel = label || dataItem.payload.name; 
      
      return (
        <div className="p-4 bg-white dark:bg-gray-800 border-2 border-primary/20 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-bold text-base text-primary mb-2">{primaryLabel}</p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <p className="text-muted-foreground">
              {dataItem.name || dataKeyName}: 
              <span className="font-extrabold text-foreground ml-1 text-lg">{dataItem.value.toFixed(2)} Hrs</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
};

// Enhanced tooltip for Pie Chart with detailed breakdown
const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const name = data.name;
      const hours = data.value;
      const percentage = data.percent ? (data.percent * 100).toFixed(1) : 0;
      
      return (
        <div className="p-4 bg-white dark:bg-gray-800 border-2 border-primary/20 rounded-xl shadow-2xl backdrop-blur-md min-w-[220px]">
          <p className="font-bold text-base text-primary mb-3 border-b pb-2">{name}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Total Hours:
              </span>
              <span className="font-bold text-foreground text-lg">{hours.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Percentage:
              </span>
              <span className="font-bold text-primary">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
};

// Recharts Pie Label Renderer
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    if (percent * 100 < 5) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central" 
        className="font-medium text-xs pointer-events-none"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
};

// --- TYPE DEFINITIONS ---
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
  type: 'success' | 'error' | null;
  message: string;
}

// --- HELPER FUNCTIONS ---

const getStatusColor = (status: OvertimeRequest['status']) => {
  switch (status) {
    case "approved": return "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300";
    case "rejected": return "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300";
    default: return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300";
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
  const totalHoursMs = endDate.getTime() - startDate.getTime();
  const totalHours = totalHoursMs / 3600000;
  return totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : 0;
}

// --- MAIN COMPONENT ---

export default function OvertimePage() {
  const supabase = getSupabaseClient();

  // --- STATE ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AppAlert>({ type: null, message: '' });

  // Employee form state
  const [empName, setEmpName] = useState("");
  const [empDept, setEmpDept] = useState("");
  const [empPos, setEmpPos] = useState("");
  const [empErrors, setEmpErrors] = useState({ name: "", dept: "", pos: "" });

  // Overtime form state
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({ employeeId: "", date: "", startTime: "", endTime: "" });
  const [totalHoursDisplay, setTotalHoursDisplay] = useState(0); 
  
  // --- FILTER STATE ---
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);

  // --- EFFECTS ---
  useEffect(() => {
    fetchEmployees();
    fetchRequests();
  }, []);

  useEffect(() => {
    const hours = calculateHours(startTime, endTime);
    setTotalHoursDisplay(hours);
  }, [startTime, endTime]);

  // --- API/DATA FETCHING & ACTION HANDLERS ---
  const showAlert = (type: AppAlert['type'], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: null, message: '' }), 4000);
  };

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

  async function addEmployee() {
    const newErrors = { name: "", dept: "", pos: "" };
    let hasError = false;
    if (!empName) { newErrors.name = "Enter name"; hasError = true; }
    if (!empDept) { newErrors.dept = "Enter department"; hasError = true; }
    if (!empPos) { newErrors.pos = "Enter position"; hasError = true; }
    setEmpErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    const { error } = await supabase.from("employees").insert({
      full_name: empName,
      department: empDept,
      position: empPos,
    });
    setLoading(false);
    
    if (error) {
      showAlert("error", `Failed to add employee: ${error.message}`);
    } else {
      showAlert("success", "Employee added successfully.");
      setEmpName(""); setEmpDept(""); setEmpPos(""); setEmpErrors({ name: "", dept: "", pos: "" });
      fetchEmployees();
    }
  }

  async function addRequest() {
    const newErrors = { employeeId: "", date: "", startTime: "", endTime: "" };
    let hasError = false;
    
    if (!employeeId) { newErrors.employeeId = "Select employee"; hasError = true; }
    if (!date) { newErrors.date = "Select date"; hasError = true; }
    if (!startTime) { newErrors.startTime = "Select start time"; hasError = true; }
    if (!endTime) { newErrors.endTime = "Select end time"; hasError = true; }
    
    const totalHours = totalHoursDisplay;
    if (totalHours <= 0) {
      newErrors.endTime = "End time must be after start time."; hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      showAlert("error", "Please correct the errors in the form before submitting.");
      return;
    }
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
        showAlert("error", "Error: Employee details missing. Cannot submit.");
        return;
    }
    const employeeName = employee.full_name;

    setLoading(true);
    
    const { error } = await supabase.from("overtime_requests").insert({
      employee_id: employeeId,
      employee_name: employeeName, 
      date,
      start_time: startTime,
      end_time: endTime,
      total_hours: totalHours,
      reason,
      status: "pending", 
    });

    setLoading(false);

    if (error) {
      showAlert("error", `Submission failed. Error: ${error.message}`);
    } else {
      showAlert("success", "Overtime request submitted successfully.");
      setEmployeeId(""); setDate(""); setStartTime(""); setEndTime(""); setReason("");
      setErrors({ employeeId: "", date: "", startTime: "", endTime: "" });
      setTotalHoursDisplay(0);
      fetchRequests();
    }
  }

  async function updateStatus(id: string, status: OvertimeRequest['status'], comment: string) {
    setLoading(true);
    const { error } = await supabase
      .from("overtime_requests")
      .update({ status, supervisor_comment: comment })
      .eq("id", id);
      setLoading(false);

    if (error) {
      showAlert("error", `Failed to ${status.toLowerCase()}.`);
    } else {
      showAlert("success", `Request ${status.toLowerCase()}!`);
      fetchRequests();
    }
  }

  // --- UNIQUE FILTER DATA ---
  const uniqueDepartments = useMemo(() => {
    const departments = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(departments).sort();
  }, [employees]);

  // --- DERIVED STATE / MEMOS ---

  const filteredRequests = useMemo(() => {
    const isEmployeeFilterActive = filterEmployeeId && filterEmployeeId !== "__ALL__";
    const isDepartmentFilterActive = filterDepartment && filterDepartment !== "__ALL__";
    const isStatusFilterActive = filterStatus && filterStatus !== "__ALL__";

    return requests.filter(r => {
      if (isEmployeeFilterActive && r.employee_id !== filterEmployeeId) return false;

      if (isDepartmentFilterActive) {
        const employee = employees.find(e => e.id === r.employee_id);
        if (!employee || employee.department !== filterDepartment) return false;
      }

      if (isStatusFilterActive && r.status !== filterStatus) return false;

      const requestDate = new Date(r.date);
      if (filterStartDate && requestDate < filterStartDate) return false;
      if (filterEndDate) {
          const endDatePlusOne = new Date(filterEndDate);
          endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
          if (requestDate >= endDatePlusOne) return false;
      }

      return true;
    });
  }, [requests, employees, filterEmployeeId, filterDepartment, filterStatus, filterStartDate, filterEndDate]);

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
        .map(name => ({ name: name, value: parseFloat(dataMap[name].toFixed(2)) }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
  }, [filteredRequests]);

  const totalApprovedHours = filteredRequests.reduce((total, r) => total + (r.status === "approved" ? r.total_hours : 0), 0);
  const totalPendingRequests = filteredRequests.filter(r => r.status === "pending").length;
  const averageHoursPerRequest = totalApprovedHours > 0 && filteredRequests.filter(r => r.status === "approved").length > 0
    ? (totalApprovedHours / filteredRequests.filter(r => r.status === "approved").length)
    : 0;

  // --- RENDER ---
  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-primary rounded-xl shadow-lg">
          <Clock className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 dark:text-gray-50">
            Overtime Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track, analyze, and manage employee overtime efficiently</p>
        </div>
      </div>
      
      {alert.type && (
        <div className={`p-4 rounded-xl text-white font-medium ${alert.type === 'success' ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-red-600 to-red-500'} flex justify-between items-center shadow-xl animate-in slide-in-from-top duration-300`}>
          <div className="flex items-center gap-3">
            {alert.type === 'success' ? (
              <div className="bg-white/20 p-2 rounded-full">
                <TrendingUp className="h-5 w-5" />
              </div>
            ) : (
              <div className="bg-white/20 p-2 rounded-full">
                <Clock className="h-5 w-5" />
              </div>
            )}
            <p>{alert.message}</p>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setAlert({ type: null, message: '' })}>
            &times;
          </Button>
        </div>
      )}

      {loading && <div className="text-center text-primary p-4 font-medium">Loading data...</div>}
      
      <Tabs defaultValue="employee" className="space-y-6">
        <TabsList className="flex space-x-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-lg border">
          <TabsTrigger value="employee" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
            Employee Portal
          </TabsTrigger>
          <TabsTrigger value="supervisor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
            Supervisor Review
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
            Admin Analytics
          </TabsTrigger>
        </TabsList>

        {/* --- EMPLOYEE VIEW --- */}
        <TabsContent value="employee" className="space-y-6">
          <Card className="shadow-xl border-2 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Register New Employee</CardTitle>
                  <CardDescription>Add new personnel to the system before submitting requests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div>
                <Label htmlFor="empName" className="text-sm font-medium">Full Name</Label>
                <Input 
                  id="empName" 
                  value={empName} 
                  onChange={(e) => setEmpName(e.target.value)} 
                  className={`mt-1 transition-all ${empErrors.name ? "border-red-500 focus:ring-red-500" : "focus:border-primary"}`}
                  placeholder="John Doe"
                />
                {empErrors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠ {empErrors.name}</p>}
              </div>
              <div>
                <Label htmlFor="empDept" className="text-sm font-medium">Department</Label>
                <Input 
                  id="empDept" 
                  value={empDept} 
                  onChange={(e) => setEmpDept(e.target.value)} 
                  className={`mt-1 transition-all ${empErrors.dept ? "border-red-500 focus:ring-red-500" : "focus:border-primary"}`}
                  placeholder="Engineering"
                />
                {empErrors.dept && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠ {empErrors.dept}</p>}
              </div>
              <div>
                <Label htmlFor="empPos" className="text-sm font-medium">Position</Label>
                <Input 
                  id="empPos" 
                  value={empPos} 
                  onChange={(e) => setEmpPos(e.target.value)} 
                  className={`mt-1 transition-all ${empErrors.pos ? "border-red-500 focus:ring-red-500" : "focus:border-primary"}`}
                  placeholder="Senior Developer"
                />
                {empErrors.pos && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠ {empErrors.pos}</p>}
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button 
                  onClick={addEmployee} 
                  disabled={loading}
                  className="px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? "Saving..." : "Save Employee"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl border-2 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Request Overtime</CardTitle>
                  <CardDescription>Submit a new request for overtime work</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="md:col-span-1">
                <Label htmlFor="employeeSelect" className="text-sm font-medium">Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                    <SelectTrigger className={`mt-1 transition-all ${errors.employeeId ? "border-red-500" : "focus:border-primary"}`}>
                        <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.employeeId && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠ {errors.employeeId}</p>}
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className={`mt-1 transition-all ${errors.date ? "border-red-500 focus:ring-red-500" : "focus:border-primary"}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠ {errors.date}</p>}
              </div>
              <div className="md:col-span-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4 flex items-center">
                  <div className="text-center w-full p-4 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Calculated Hours</p>
                      <p className={`text-3xl font-bold ${totalHoursDisplay > 0 ? 'text-primary' : 'text-gray-400'} transition-all duration-300`}>
                          {totalHoursDisplay.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Total Hours</p>
                  </div>
              </div>
              
              <div>
                <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
                <Input 
                    id="startTime" 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    className={`mt-1 transition-all ${errors.startTime ? "border-red-500 focus:ring-red-500" : "focus:border-primary"}`}
                />
                {errors.startTime && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠ {errors.startTime}</p>}
              </div>
              <div>
                <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
                <Input 
                    id="endTime" 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    className={`mt-1 transition-all ${errors.endTime ? "border-red-500 focus:ring-red-500" : "focus:border-primary"}`}
                />
                {errors.endTime && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠ {errors.endTime}</p>}
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="reason" className="text-sm font-medium">Reason</Label>
                <Textarea 
                  id="reason" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Project Deadline, System Maintenance, Client Emergency"
                  className="mt-1 min-h-[80px] transition-all focus:border-primary"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button 
                  onClick={addRequest} 
                  disabled={loading || totalHoursDisplay <= 0}
                  className="px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SUPERVISOR VIEW --- */}
        <TabsContent value="supervisor">
          <Card className="shadow-xl border-2 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle>Pending Overtime Requests</CardTitle>
                    <CardDescription>Review and manage all pending requests</CardDescription>
                  </div>
                </div>
                <Badge className="bg-yellow-500 text-white px-4 py-2 text-lg shadow-lg">
                  {requests.filter((r) => r.status === "pending").length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {requests.filter((r) => r.status === "pending").length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-green-500/10 rounded-full">
                      <TrendingUp className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-green-700 dark:text-green-400">🎉 All Clear!</p>
                  <p className="text-muted-foreground mt-2">No pending requests. Great job staying on top of things!</p>
                </div>
              ) : (
                <div className="overflow-x-auto border rounded-xl shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/60 hover:to-muted/40">
                        <TableHead className="font-semibold">Employee</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Hours</TableHead>
                        <TableHead className="font-semibold">Reason</TableHead>
                        <TableHead className="min-w-[200px] font-semibold">Action</TableHead>
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

        {/* --- ADMIN VIEW --- */}
        <TabsContent value="admin">
          <Card className="shadow-xl">
            <CardHeader className="space-y-4">
              <CardTitle className="text-3xl font-bold">Overtime Analytics & Records</CardTitle>
              <CardDescription>Analyze trends using advanced filtering and rich visualizations.</CardDescription>

              {/* --- ADVANCED FILTER BAR --- */}
              <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <div className="w-full sm:w-[200px]">
                      <Label>Employee</Label>
                      <Select value={filterEmployeeId} onValueChange={setFilterEmployeeId}>
                          <SelectTrigger>
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

                  <div className="w-full sm:w-[160px]">
                      <Label>Department</Label>
                      <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                          <SelectTrigger>
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

                  <div className="w-full sm:w-[120px]">
                      <Label>Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger>
                              <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="__ALL__">All Statuses</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>

                  <div className="flex gap-2 w-full lg:w-auto">
                      <div className="flex-1 min-w-[150px]">
                          <Label>Start Date</Label>
                          <Popover>
                              <PopoverTrigger asChild>
                                  <Button
                                      variant={"outline"}
                                      className="w-full justify-start text-left font-normal"
                                  >
                                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                      {filterStartDate ? format(filterStartDate, "PPP") : <span>Pick a start date</span>}
                                  </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                      mode="single"
                                      selected={filterStartDate}
                                      onSelect={setFilterStartDate}
                                      initialFocus
                                  />
                              </PopoverContent>
                          </Popover>
                      </div>

                      <div className="flex-1 min-w-[150px]">
                          <Label>End Date</Label>
                          <Popover>
                              <PopoverTrigger asChild>
                                  <Button
                                      variant={"outline"}
                                      className="w-full justify-start text-left font-normal"
                                  >
                                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                      {filterEndDate ? format(filterEndDate, "PPP") : <span>Pick an end date</span>}
                                  </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                      mode="single"
                                      selected={filterEndDate}
                                      onSelect={setFilterEndDate}
                                      initialFocus
                                  />
                              </PopoverContent>
                          </Popover>
                      </div>
                  </div>
                  
                  <div className="flex items-end pt-2">
                      <Button 
                          variant="outline" 
                          onClick={() => {
                              setFilterEmployeeId(""); 
                              setFilterDepartment(""); 
                              setFilterStatus("");
                              setFilterStartDate(undefined); 
                              setFilterEndDate(undefined);
                          }}
                      >
                          Clear Filters
                      </Button>
                  </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* --- ENHANCED STATS CARDS --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="shadow-xl border-l-4 border-primary hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Approved Hours</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                          {totalApprovedHours.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Hours from filtered data
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-xl border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/50 dark:from-gray-800 dark:to-yellow-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                          {totalPendingRequests}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Requires immediate review</p>
                    </CardContent>
                </Card>
                
                <Card className="shadow-xl border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Hours/Request</CardTitle>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {averageHoursPerRequest.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Across approved items</p>
                    </CardContent>
                </Card>
              </div>

              {/* Grid for Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* --- BAR CHART --- */}
                <Card className="p-6 shadow-xl border-2 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800 dark:to-slate-900/50">
                    <CardHeader className="p-0 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-2xl">Overtime Trend</CardTitle>
                        </div>
                        <CardDescription className="text-sm">Daily approved overtime hours - hover over bars for details</CardDescription>
                    </CardHeader>
                    <div className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                          <defs>
                              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(210 70% 50%)" stopOpacity={0.95}/>
                                  <stop offset="95%" stopColor="hsl(210 70% 50%)" stopOpacity={0.5}/>
                              </linearGradient>
                              <filter id="shadow" height="130%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                                <feOffset dx="0" dy="2" result="offsetblur"/>
                                <feComponentTransfer>
                                  <feFuncA type="linear" slope="0.3"/>
                                </feComponentTransfer>
                                <feMerge>
                                  <feMergeNode/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                          </defs>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" /> 
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={12} 
                            className="text-xs font-medium"
                          /> 
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={10}
                            className="text-xs font-medium" 
                          />
                          <Tooltip content={<CustomTooltip dataKeyName="Hours" />} cursor={{ fill: 'hsl(var(--muted) / 0.1)' }} /> 
                          <Bar 
                            dataKey="hours" 
                            name="Approved Hours" 
                            fill="url(#colorHours)"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={50}
                            filter="url(#shadow)"
                            className="transition-all duration-300"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </Card>

                {/* --- PIE CHART --- */}
                <Card className="p-6 shadow-xl border-2 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-800 dark:to-slate-900/50">
                    <CardHeader className="p-0 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-2xl">Employee Distribution</CardTitle>
                        </div>
                        <CardDescription className="text-sm">Total approved hours by employee - hover for breakdown</CardDescription>
                    </CardHeader>
                    <div className="h-[320px] flex justify-center">
                      {pieChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <defs>
                                    {DONUT_COLORS.map((color, idx) => (
                                      <linearGradient key={`gradient-${idx}`} id={`pieGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={1}/>
                                        <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <Pie
                                      data={pieChartData}
                                      dataKey="value"
                                      nameKey="name"
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={75}
                                      outerRadius={105}
                                      paddingAngle={4}
                                      stroke="white"
                                      strokeWidth={2}
                                      labelLine={false}
                                      label={renderCustomizedLabel}
                                  >
                                      {pieChartData.map((entry, index) => (
                                          <Cell 
                                            key={`cell-${entry.name}`} 
                                            fill={`url(#pieGradient${index % DONUT_COLORS.length})`}
                                            className="transition-all duration-300 hover:opacity-90 cursor-pointer drop-shadow-lg"
                                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                                          />
                                      ))}
                                  </Pie>
                                  <Tooltip content={<PieCustomTooltip />} />
                                  <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle" 
                                    wrapperStyle={{ paddingLeft: '10px', fontSize: '13px' }} 
                                    iconType="circle"
                                    iconSize={10}
                                    formatter={(value) => (
                                      <span className="text-sm text-foreground font-medium hover:text-primary transition-colors cursor-pointer">
                                        {value}
                                      </span>
                                    )}
                                  />
                              </PieChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                            <Clock className="h-12 w-12 opacity-20" />
                            <p className="text-sm">No approved overtime data matches the filters</p>
                          </div>
                      )}
                    </div>
                </Card>
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 border-t pt-6 mt-2 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                Detailed Records 
                <Badge className="ml-2 bg-primary text-primary-foreground px-3 py-1">
                  {filteredRequests.length} Results
                </Badge>
              </h3>
              <div className="overflow-x-auto border-2 rounded-xl shadow-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/60 hover:to-muted/40">
                      <TableHead className="font-semibold">Employee</TableHead>
                      <TableHead className="font-semibold">Department</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Hours</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <Clock className="h-12 w-12 opacity-20" />
                            <p className="text-lg">No records match your filters</p>
                            <p className="text-sm">Try adjusting your filter criteria</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((r) => (
                        <TableRow key={r.id} className="transition-all hover:bg-muted/30 hover:shadow-sm">
                          <TableCell className="font-medium">{r.employees?.full_name}</TableCell>
                          <TableCell className="text-muted-foreground">{employees.find(e => e.id === r.employee_id)?.department || 'N/A'}</TableCell>
                          <TableCell className="text-muted-foreground">{r.date}</TableCell>
                          <TableCell className="font-mono text-sm font-semibold">{r.total_hours.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(r.status)}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{r.reason || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- SupervisorRow Component ---

function SupervisorRow({ r, onAction, disabled }: { r: OvertimeRequest; onAction: (id: string, status: OvertimeRequest['status'], comment: string) => void; disabled: boolean; }) {
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approved" | "rejected">("approved");

  const handleAction = () => {
    onAction(r.id, actionType, comment);
    setIsDialogOpen(false);
    setComment("");
  };

  const displayStatus = actionType.charAt(0).toUpperCase() + actionType.slice(1);

  return (
    <TableRow className="transition-all hover:bg-muted/30 hover:shadow-md">
      <TableCell className="font-medium">{r.employees?.full_name}</TableCell>
      <TableCell className="text-muted-foreground">{r.date}</TableCell>
      <TableCell className="font-mono text-sm font-semibold">{r.total_hours.toFixed(2)}</TableCell>
      <TableCell className="text-muted-foreground max-w-xs truncate">{r.reason}</TableCell>
      <TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex gap-2">
              <Button 
                variant="default"
                onClick={() => { setActionType("approved"); setIsDialogOpen(true); }}
                disabled={disabled}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                ✓ Approve
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => { setActionType("rejected"); setIsDialogOpen(true); }}
                disabled={disabled}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                ✗ Reject
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className={`p-2 rounded-lg ${actionType === "approved" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {actionType === "approved" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-red-600" />
                  )}
                </div>
                {displayStatus} Request
              </DialogTitle>
              <p className="text-sm text-muted-foreground pt-2">
                Employee: <span className="font-semibold text-foreground">{r.employees?.full_name}</span>
              </p>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{r.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hours:</span>
                  <span className="font-mono font-semibold">{r.total_hours.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{r.start_time} - {r.end_time}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="supervisorComment" className="text-sm font-medium">
                  Supervisor Comment {actionType === "rejected" && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id="supervisorComment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={`${actionType === "approved" ? "Optional: Add approval notes..." : "Required: Provide reason for rejection..."}`}
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="shadow-sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAction} 
                disabled={disabled}
                className={`shadow-md hover:shadow-lg transition-all duration-300 ${
                  actionType === "approved" 
                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600" 
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                }`}
              >
                {disabled ? "Processing..." : `Confirm ${displayStatus}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}