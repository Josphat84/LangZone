'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Settings,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Star,
  MoreVertical,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  User,
  GraduationCap,
  Clock,
  Award
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ---------------------- Types ----------------------
interface Instructor {
  id: number;
  name: string;
  email: string;
  language: string;
  expertise: string;
  price: number;
  description: string;
  country: string;
  rating: number;
  students: number;
  avatar?: string;
  joinDate: string;
  status: 'active' | 'inactive';
  totalLessons: number;
  totalRevenue: number;
  responseTime: string;
}

interface Booking {
  id: number;
  instructor_id: number;
  student_name: string;
  student_email: string;
  lesson_date: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  created_at: string;
  subject: string;
  payment_status: 'paid' | 'pending' | 'failed';
}

interface Student {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  totalLessons: number;
  totalSpent: number;
  country: string;
  status: 'active' | 'inactive';
  favoriteSubjects: string[];
  learningGoals: string;
  lastActive: string;
}

// ---------------------- Mock Data ----------------------
const generateMockInstructors = (): Instructor[] => [
  { id: 48, name: 'James Brown', email: 'james@yahoo.com', language: 'English', expertise: 'Pro', price: 20, description: 'Hello everybody, I\'m James', country: 'USA', rating: 4.8, students: 45, joinDate: '2023-01-15', status: 'active', totalLessons: 156, totalRevenue: 3120, responseTime: '< 2h' },
  { id: 61, name: 'Josphat Dandira', email: 'jj@yahoo.com', language: 'Shona', expertise: 'Native', price: 20, description: 'Makadii kwese', country: 'Zimbabwe', rating: 4.9, students: 32, joinDate: '2023-03-20', status: 'active', totalLessons: 128, totalRevenue: 2560, responseTime: '< 1h' },
  { id: 67, name: 'Nomatter Chikwamba', email: 'nochik49work@gmail.com', language: 'English', expertise: 'Tutoring', price: 15, description: 'EMPTY', country: 'Zimbabwe', rating: 4.5, students: 28, joinDate: '2023-05-10', status: 'active', totalLessons: 89, totalRevenue: 1335, responseTime: '< 4h' },
  { id: 68, name: 'Tinoe Genius', email: 'tinoetiger@gmail.com', language: 'English/French', expertise: 'Expert', price: 80, description: 'EMPTY', country: 'Zimbabwe', rating: 4.7, students: 51, joinDate: '2023-02-28', status: 'active', totalLessons: 203, totalRevenue: 16240, responseTime: '< 3h' },
  { id: 69, name: 'Benson', email: 'benson@gmail.com', language: 'English', expertise: 'Pro', price: 25, description: 'Tutor Benson', country: 'Zimbabwe', rating: 4.6, students: 39, joinDate: '2023-04-12', status: 'inactive', totalLessons: 145, totalRevenue: 3625, responseTime: '< 6h' },
  { id: 70, name: 'Lorenzo', email: 'lorenzo@gmail.com', language: 'Italian/English', expertise: 'Expert', price: 50, description: 'Tutor Lorenzo', country: 'Italy', rating: 4.9, students: 67, joinDate: '2023-01-08', status: 'active', totalLessons: 278, totalRevenue: 13900, responseTime: '< 1h' },
  { id: 71, name: 'Nancy', email: 'nancy@gmail.com', language: 'English/Spanish', expertise: 'Advanced', price: 30, description: 'Tutor Nancy', country: 'Spain', rating: 4.4, students: 23, joinDate: '2023-06-05', status: 'active', totalLessons: 76, totalRevenue: 2280, responseTime: '< 5h' },
];

const generateMockBookings = (instructors: Instructor[]): Booking[] =>
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    instructor_id: instructors[Math.floor(Math.random() * instructors.length)].id,
    student_name: ['Alice Johnson','Bob Smith','Carol Davis','David Wilson','Emma Brown'][Math.floor(Math.random()*5)],
    student_email: `student${i}@example.com`,
    lesson_date: new Date(Date.now() - Math.random() * 60*24*60*60*1000).toISOString(),
    duration: [30, 45, 60, 90][Math.floor(Math.random()*4)],
    status: ['pending','confirmed','completed','cancelled'][Math.floor(Math.random()*4)] as any,
    amount: Math.floor(Math.random()*50)+15,
    created_at: new Date(Date.now() - Math.random()*60*24*60*60*1000).toISOString(),
    subject: ['Math','English','Science','History','Programming'][Math.floor(Math.random()*5)],
    payment_status: ['paid','pending','failed'][Math.floor(Math.random()*3)] as any
  }));

const generateMockStudents = (bookings: Booking[]): Student[] => {
  const studentMap = new Map();
  const subjects = ['Math', 'English', 'Science', 'History', 'Programming', 'Art', 'Music'];
  const goals = ['Career Advancement', 'Academic Improvement', 'Personal Interest', 'Test Preparation', 'Skill Development'];
  
  bookings.forEach(booking => {
    if (!studentMap.has(booking.student_email)) {
      studentMap.set(booking.student_email, {
        id: studentMap.size + 1,
        name: booking.student_name,
        email: booking.student_email,
        joinDate: new Date(Date.now() - Math.random()*365*24*60*60*1000).toISOString(),
        totalLessons: 0,
        totalSpent: 0,
        country: ['USA','UK','Canada','Australia','Germany','France'][Math.floor(Math.random()*6)],
        status: 'active',
        favoriteSubjects: [...new Set(Array.from({length: 3}, () => subjects[Math.floor(Math.random()*subjects.length)]))],
        learningGoals: goals[Math.floor(Math.random()*goals.length)],
        lastActive: new Date(Date.now() - Math.random()*30*24*60*60*1000).toISOString()
      });
    }
    const student = studentMap.get(booking.student_email);
    student.totalLessons += 1;
    student.totalSpent += booking.amount;
  });
  return Array.from(studentMap.values());
};

// ---------------------- Hooks ----------------------
const useDashboardData = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const generateMockData = useCallback(() => {
    const mockInstructors = generateMockInstructors();
    const mockBookings = generateMockBookings(mockInstructors);
    const mockStudents = generateMockStudents(mockBookings);
    setInstructors(mockInstructors);
    setBookings(mockBookings);
    setStudents(mockStudents);
  }, []);

  useEffect(() => { 
    setTimeout(() => {
      generateMockData(); 
      setLoading(false);
    }, 1000);
  }, [generateMockData]);

  return { instructors, bookings, students, loading, refetch: generateMockData };
};

// ---------------------- CountUp Component ----------------------
const CountUpNumber = ({ end, duration = 1500, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ---------------------- Stat Card Component ----------------------
const StatCard = ({ title, value, icon: Icon, trend, description, color = 'blue' }: any) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              {typeof value === 'number' ? <CountUpNumber end={value} prefix={title.includes('Revenue') ? '$' : ''} /> : value}
            </h3>
            {trend && (
              <div className={`flex items-center mt-1 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
              </div>
            )}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ---------------------- Rating Progress Component ----------------------
const RatingProgress = ({ rating, total = 5 }: { rating: number; total?: number }) => {
  const percentage = (rating / total) * 100;
  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-yellow-400 h-2 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// ---------------------- Main Dashboard ----------------------
export default function DashboardPage() {
  const { instructors, bookings, students, loading, refetch } = useDashboardData();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutors' | 'students' | 'bookings' | 'calendar' | 'settings'>('dashboard');
  const [trendTutorId, setTrendTutorId] = useState<number | 'all'>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    if (trendTutorId !== 'all') {
      filtered = filtered.filter(b => b.instructor_id === trendTutorId);
    }
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [trendTutorId, bookings, searchQuery]);

  const revenueData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    filteredBookings.forEach(b => {
      if (!b.lesson_date || !b.amount) return;
      const day = new Date(b.lesson_date).toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + b.amount;
    });
    return Object.keys(dayMap).sort().map(d => ({ date: d, revenue: dayMap[d] }));
  }, [filteredBookings]);

  const bookingStatusData = useMemo(() => {
    const statusCount = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    filteredBookings.forEach(b => statusCount[b.status]++);
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [filteredBookings]);

  const subjectDistributionData = useMemo(() => {
    const subjectCount: Record<string, number> = {};
    filteredBookings.forEach(b => {
      subjectCount[b.subject] = (subjectCount[b.subject] || 0) + 1;
    });
    return Object.entries(subjectCount).map(([name, value]) => ({ name, value }));
  }, [filteredBookings]);

  // Tutor Analytics
  const tutorPerformanceData = useMemo(() => {
    return instructors.map(instructor => ({
      name: instructor.name,
      revenue: instructor.totalRevenue,
      students: instructor.students,
      lessons: instructor.totalLessons,
      rating: instructor.rating
    })).sort((a, b) => b.revenue - a.revenue);
  }, [instructors]);

  const expertiseDistribution = useMemo(() => {
    const expertiseCount: Record<string, number> = {};
    instructors.forEach(instructor => {
      expertiseCount[instructor.expertise] = (expertiseCount[instructor.expertise] || 0) + 1;
    });
    return Object.entries(expertiseCount).map(([name, value]) => ({ name, value }));
  }, [instructors]);

  // Student Analytics
  const studentActivityData = useMemo(() => {
    const activityLevels = { 'High': 0, 'Medium': 0, 'Low': 0 };
    students.forEach(student => {
      if (student.totalLessons >= 10) activityLevels['High']++;
      else if (student.totalLessons >= 5) activityLevels['Medium']++;
      else activityLevels['Low']++;
    });
    return Object.entries(activityLevels).map(([name, value]) => ({ name, value }));
  }, [students]);

  const studentSpendingData = useMemo(() => {
    return students
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map(student => ({
        name: student.name,
        spent: student.totalSpent,
        lessons: student.totalLessons
      }));
  }, [students]);

  const topInstructors = useMemo(() => {
    return [...instructors]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [instructors]);

  const recentBookings = useMemo(() => {
    return [...filteredBookings]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [filteredBookings]);

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
    active: 'bg-green-500',
    inactive: 'bg-gray-500'
  };

  const paymentStatusColors = {
    paid: 'bg-green-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-white text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalStudents = new Set(filteredBookings.map(b => b.student_email)).size;
  const conversionRate = ((filteredBookings.filter(b => b.status === 'completed').length / filteredBookings.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={refetch} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              Refresh Data
            </Button>
          </div>
        </div>

        {/* ---------------- Tabs ---------------- */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white dark:bg-gray-800 p-2 rounded-lg mb-6 space-x-2 sticky top-0 z-10 border border-gray-200 dark:border-gray-700">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'tutors', label: 'Tutors', icon: Users },
              { id: 'students', label: 'Students', icon: GraduationCap },
              { id: 'bookings', label: 'Bookings', icon: BookOpen },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id as any}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ---------------- DASHBOARD TAB ---------------- */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={totalRevenue}
                icon={DollarSign}
                trend={12.5}
                description="From all bookings"
                color="green"
              />
              <StatCard
                title="Active Tutors"
                value={instructors.filter(i => i.status === 'active').length}
                icon={Users}
                trend={8.2}
                description="Currently teaching"
                color="blue"
              />
              <StatCard
                title="Total Students"
                value={totalStudents}
                icon={GraduationCap}
                trend={15.3}
                description="Registered students"
                color="purple"
              />
              <StatCard
                title="Conversion Rate"
                value={conversionRate.toFixed(1)}
                suffix="%"
                icon={TrendingUp}
                trend={5.1}
                description="Booking completion"
                color="orange"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Revenue Trend</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#06d6a0" fill="#06d6a0" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Booking Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Booking Status</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Distribution by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bookingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#F59E0B', '#3B82F6', '#10B981', '#EF4444'][index]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Instructors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Top Instructors</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Highest rated tutors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topInstructors.map((instructor, index) => (
                      <div key={instructor.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                            {instructor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{instructor.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{instructor.expertise}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-gray-900 dark:text-white font-semibold">{instructor.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{instructor.students} students</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Recent Bookings</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Latest lesson bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => {
                      const instructor = instructors.find(i => i.id === booking.instructor_id);
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{booking.student_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">with {instructor?.name}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                            <p className="text-sm text-gray-900 dark:text-white font-semibold mt-1">${booking.amount}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ---------------- TUTORS TAB ---------------- */}
          <TabsContent value="tutors" className="space-y-6">
            {/* Tutor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tutors</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{instructors.length}</h3>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tutors</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {instructors.filter(i => i.status === 'active').length}
                      </h3>
                    </div>
                    <User className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(instructors.reduce((acc, i) => acc + i.rating, 0) / instructors.length).toFixed(1)}
                      </h3>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${instructors.reduce((acc, i) => acc + i.totalRevenue, 0).toLocaleString()}
                      </h3>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tutor Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Top Performing Tutors</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">By revenue generated</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tutorPerformanceData.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Expertise Distribution</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Tutors by expertise level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expertiseDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expertiseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tutors Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Tutor Management</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Manage all tutors and their profiles</CardDescription>
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Tutor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 dark:text-white">Tutor</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Language</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Expertise</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Price</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Rating</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Students</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instructors.map((instructor) => (
                      <TableRow key={instructor.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {instructor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{instructor.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{instructor.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{instructor.language}</TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{instructor.expertise}</TableCell>
                        <TableCell className="text-gray-900 dark:text-white">${instructor.price}/hr</TableCell>
                        <TableCell>
                          <RatingProgress rating={instructor.rating} />
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{instructor.students}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[instructor.status]}>{instructor.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- STUDENTS TAB ---------------- */}
          <TabsContent value="students" className="space-y-6">
            {/* Student Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</h3>
                    </div>
                    <GraduationCap className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {students.filter(s => s.status === 'active').length}
                      </h3>
                    </div>
                    <User className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Lessons</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {(students.reduce((acc, s) => acc + s.totalLessons, 0) / students.length).toFixed(1)}
                      </h3>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${students.reduce((acc, s) => acc + s.totalSpent, 0).toLocaleString()}
                      </h3>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Student Activity Levels</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Based on lesson frequency</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={studentActivityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {studentActivityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10B981', '#F59E0B', '#EF4444'][index]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Top Spending Students</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Highest lifetime value</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentSpendingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                      <Bar dataKey="spent" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Student Management</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Manage all registered students</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 dark:text-white">Student</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Email</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Country</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Total Lessons</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Total Spent</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Join Date</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.favoriteSubjects.join(', ')}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{student.email}</TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{student.country}</TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{student.totalLessons}</TableCell>
                        <TableCell className="text-gray-900 dark:text-white">${student.totalSpent}</TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {new Date(student.joinDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[student.status]}>{student.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- BOOKINGS TAB ---------------- */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Booking Management</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">View and manage all lesson bookings</CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search bookings..."
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={trendTutorId.toString()} onValueChange={(v) => setTrendTutorId(v === 'all' ? 'all' : parseInt(v))}>
                      <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Filter by tutor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectItem value="all">All Tutors</SelectItem>
                        {instructors.map(i => (
                          <SelectItem key={i.id} value={i.id.toString()}>{i.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 dark:text-white">Booking ID</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Student</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Tutor</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Subject</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Date</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Amount</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Payment</TableHead>
                      <TableHead className="text-gray-900 dark:text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => {
                      const instructor = instructors.find(i => i.id === booking.instructor_id);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium text-gray-900 dark:text-white">#{booking.id}</TableCell>
                          <TableCell className="text-gray-900 dark:text-white">{booking.student_name}</TableCell>
                          <TableCell className="text-gray-900 dark:text-white">{instructor?.name}</TableCell>
                          <TableCell className="text-gray-900 dark:text-white">{booking.subject}</TableCell>
                          <TableCell className="text-gray-900 dark:text-white">
                            {new Date(booking.lesson_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-white">${booking.amount}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={paymentStatusColors[booking.payment_status]}>
                              {booking.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- CALENDAR TAB ---------------- */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Lesson Calendar</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">View all scheduled lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={bookings.map(b => ({
                    id: b.id.toString(),
                    title: `${instructors.find(i => i.id === b.instructor_id)?.name} - ${b.student_name}`,
                    start: b.lesson_date,
                    color: b.status === 'completed' ? '#10B981' :
                           b.status === 'cancelled' ? '#EF4444' :
                           b.status === 'confirmed' ? '#3B82F6' : '#F59E0B'
                  }))}
                  height={600}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  eventClick={(info) => {
                    console.log('Event clicked:', info.event);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- SETTINGS TAB ---------------- */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Settings</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Manage your dashboard settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
                        <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                          <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-notifications" className="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" defaultChecked />
                          <label htmlFor="email-notifications" className="text-sm text-gray-700 dark:text-gray-300">Email notifications</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="booking-alerts" className="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" defaultChecked />
                          <label htmlFor="booking-alerts" className="text-sm text-gray-700 dark:text-gray-300">Booking alerts</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}