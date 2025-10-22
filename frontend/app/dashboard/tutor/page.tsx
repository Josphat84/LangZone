'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, BookOpen, DollarSign, Calendar, Clock, TrendingUp, 
  Star, Award, GraduationCap, Globe, Mail, ChevronDown, Filter, Search,
  BarChart3, PieChart, Activity, Video, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, BarChart, Bar, PieChart as RePieChart, 
  Pie, Cell, Area, AreaChart
} from 'recharts';

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
  rating?: number;
  totalHours?: number;
}

interface Booking {
  id: number;
  instructor_id: number;
  student_name?: string;
  student_email?: string;
  lesson_date?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount?: number;
  created_at: string;
  duration?: number;
}

// ---------------------- Mock Data ----------------------
const generateMockInstructors = (): Instructor[] => [
  { id: 48, name: 'James Brown', email: 'james@yahoo.com', language: 'English', expertise: 'Pro', price: 20, description: 'Hello everybody, I\'m James', country: 'USA', rating: 4.8, totalHours: 245 },
  { id: 61, name: 'Josphat Dandira', email: 'jj@yahoo.com', language: 'Shona', expertise: 'Native', price: 20, description: 'Makadii kwese', country: 'Zimbabwe', rating: 4.9, totalHours: 189 },
  { id: 67, name: 'Nomatter Chikwamba', email: 'nochik49work@gmail.com', language: 'English', expertise: 'Tutoring', price: 15, description: 'Professional tutor', country: 'Zimbabwe', rating: 4.7, totalHours: 156 },
  { id: 68, name: 'Tinoe Genius', email: 'tinoetiger@gmail.com', language: 'English/French', expertise: 'Expert', price: 80, description: 'Multilingual expert', country: 'Zimbabwe', rating: 4.95, totalHours: 312 },
  { id: 69, name: 'Benson', email: 'benson@gmail.com', language: 'English', expertise: 'Pro', price: 25, description: 'Tutor Benson', country: 'Zimbabwe', rating: 4.6, totalHours: 198 },
  { id: 70, name: 'Lorenzo', email: 'lorenzo@gmail.com', language: 'Italian/English', expertise: 'Expert', price: 50, description: 'Tutor Lorenzo', country: 'Italy', rating: 4.85, totalHours: 267 },
  { id: 71, name: 'Nancy', email: 'nancy@gmail.com', language: 'English/Spanish', expertise: 'Advanced', price: 30, description: 'Tutor Nancy', country: 'Spain', rating: 4.75, totalHours: 223 },
];

const generateMockBookings = (instructors: Instructor[]): Booking[] =>
  Array.from({ length: 80 }, (_, i) => ({
    id: i + 1,
    instructor_id: instructors[Math.floor(Math.random() * instructors.length)].id,
    student_name: ['Alice Johnson','Bob Smith','Carol Martinez','David Lee','Emma Wilson','Frank Chen','Grace Taylor','Henry Brown'][Math.floor(Math.random()*8)],
    student_email: `student${i}@example.com`,
    lesson_date: new Date(Date.now() - Math.random() * 60*24*60*60*1000).toISOString(),
    status: ['pending','confirmed','completed','cancelled'][Math.floor(Math.random()*4)] as any,
    amount: Math.floor(Math.random()*70)+15,
    duration: [1, 1.5, 2][Math.floor(Math.random()*3)],
    created_at: new Date(Date.now() - Math.random()*60*24*60*60*1000).toISOString()
  }));

// ---------------------- Hooks ----------------------
const useDashboardData = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const generateMockData = useCallback(() => {
    const mockInstructors = generateMockInstructors();
    const mockBookings = generateMockBookings(mockInstructors);
    setInstructors(mockInstructors);
    setBookings(mockBookings);
  }, []);

  useEffect(() => { generateMockData(); setLoading(false); }, [generateMockData]);
  return { instructors, bookings, loading };
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

// ---------------------- Custom Calendar Component ----------------------
const CustomCalendar = ({ bookings, instructors }: { bookings: Booking[], instructors: Instructor[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  
  const getBookingsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.lesson_date?.startsWith(dateStr));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">{monthNames[month]} {year}</h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors">Previous</button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors">Today</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors">Next</button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-slate-600 py-2">{day}</div>
        ))}
        
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayBookings = getBookingsForDay(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          
          return (
            <div key={day} className={`aspect-square border rounded-lg p-2 hover:bg-slate-50 transition-colors ${isToday ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-200'}`}>
              <div className="text-sm font-semibold text-slate-900 mb-1">{day}</div>
              <div className="space-y-1">
                {dayBookings.slice(0, 3).map(booking => {
                  const instructor = instructors.find(i => i.id === booking.instructor_id);
                  const statusColors = {
                    completed: 'bg-green-500',
                    confirmed: 'bg-blue-500',
                    pending: 'bg-yellow-500',
                    cancelled: 'bg-red-500'
                  };
                  return (
                    <div key={booking.id} className={`text-xs px-1 py-0.5 rounded ${statusColors[booking.status]} text-white truncate`} title={`${instructor?.name} - ${booking.student_name}`}>
                      {instructor?.name?.split(' ')[0]}
                    </div>
                  );
                })}
                {dayBookings.length > 3 && (
                  <div className="text-xs text-slate-500">+{dayBookings.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------- Main Dashboard ----------------------
export default function DashboardPage() {
  const { instructors, bookings, loading } = useDashboardData();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutors' | 'calendar' | 'analytics'>('dashboard');
  const [selectedTutor, setSelectedTutor] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    if (selectedTutor !== 'all') {
      filtered = filtered.filter(b => b.instructor_id === selectedTutor);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    return filtered;
  }, [selectedTutor, bookings, statusFilter]);

  const filteredInstructors = useMemo(() => {
    if (!searchQuery) return instructors;
    const query = searchQuery.toLowerCase();
    return instructors.filter(i => 
      i.name.toLowerCase().includes(query) ||
      i.language.toLowerCase().includes(query) ||
      i.country.toLowerCase().includes(query)
    );
  }, [searchQuery, instructors]);

  const revenueByDay = useMemo(() => {
    const dayMap: Record<string, { total: number; [key: number]: number }> = {};
    filteredBookings.forEach(b => {
      if (!b.lesson_date || !b.amount) return;
      const day = new Date(b.lesson_date).toISOString().slice(0, 10);
      if (!dayMap[day]) dayMap[day] = { total: 0 };
      dayMap[day][b.instructor_id] = (dayMap[day][b.instructor_id] || 0) + b.amount;
      dayMap[day].total += b.amount;
    });
    return Object.keys(dayMap).sort().map(d => ({ date: d, ...dayMap[d] }));
  }, [filteredBookings]);

  const statusDistribution = useMemo(() => {
    const dist = { completed: 0, pending: 0, confirmed: 0, cancelled: 0 };
    filteredBookings.forEach(b => dist[b.status]++);
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [filteredBookings]);

  const topTutors = useMemo(() => {
    return instructors.map(inst => {
      const tutorBookings = bookings.filter(b => b.instructor_id === inst.id);
      const revenue = tutorBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
      return { ...inst, bookingCount: tutorBookings.length, revenue };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [instructors, bookings]);

  const totalRevenue = useMemo(() => filteredBookings.reduce((sum, b) => sum + (b.amount || 0), 0), [filteredBookings]);
  const totalStudents = useMemo(() => new Set(filteredBookings.map(b => b.student_email)).size, [filteredBookings]);
  const avgRating = useMemo(() => instructors.reduce((sum, i) => sum + (i.rating || 0), 0) / instructors.length, [instructors]);
  const totalHours = useMemo(() => instructors.reduce((sum, i) => sum + (i.totalHours || 0), 0), [instructors]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 flex items-center justify-center">
        <div className="text-slate-900 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const COLORS = ['#06d6a0', '#118ab2', '#ef476f', '#ffd166', '#8338ec'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tutor Platform</h1>
                <p className="text-sm text-slate-600">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-100 rounded-lg px-4 py-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-6 bg-white/80 backdrop-blur p-2 rounded-xl shadow-sm border border-slate-200">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'tutors', label: 'Tutors', icon: Users },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: PieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, label: 'Total Tutors', value: instructors.length, color: 'from-blue-500 to-cyan-500', prefix: '' },
                { icon: BookOpen, label: 'Total Bookings', value: filteredBookings.length, color: 'from-purple-500 to-pink-500', prefix: '' },
                { icon: DollarSign, label: 'Total Revenue', value: totalRevenue, color: 'from-green-500 to-emerald-500', prefix: '$' },
                { icon: Star, label: 'Avg Rating', value: avgRating, color: 'from-yellow-500 to-orange-500', prefix: '', suffix: '/5' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:scale-105 transition-transform">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">
                    <CountUpNumber end={stat.value} prefix={stat.prefix} suffix={stat.suffix || ''} />
                  </p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <label className="text-slate-900 font-medium">Filter by Tutor:</label>
                <select
                  className="bg-slate-50 text-slate-900 px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  value={selectedTutor}
                  onChange={e => setSelectedTutor(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                >
                  <option value="all">All Tutors</option>
                  {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-900 font-medium">Status:</label>
                <select
                  className="bg-slate-50 text-slate-900 px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Revenue Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueByDay}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Tutors */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Top Performing Tutors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topTutors.map((tutor, index) => (
                  <div key={tutor.id} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{tutor.name}</h4>
                        <p className="text-sm text-slate-600">{tutor.language}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Revenue:</span>
                        <span className="text-green-600 font-semibold">${tutor.revenue}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Bookings:</span>
                        <span className="text-blue-600 font-semibold">{tutor.bookingCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Rating:</span>
                        <span className="text-yellow-600 font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          {tutor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TUTORS TAB */}
        {activeTab === 'tutors' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 flex items-center gap-4 shadow-sm border border-slate-200">
              <Search className="w-5 h-5 text-slate-600" />
              <input
                type="text"
                placeholder="Search tutors by name, language, or country..."
                className="flex-1 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.map(inst => {
                const tutorBookings = bookings.filter(b => b.instructor_id === inst.id);
                const tutorRevenue = tutorBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
                const statusCounts = { completed: 0, pending: 0, confirmed: 0, cancelled: 0 };
                tutorBookings.forEach(b => statusCounts[b.status]++);

                return (
                  <div key={inst.id} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:scale-105 transition-transform">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {inst.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
                        <Star className="w-4 h-4 text-yellow-600 fill-current" />
                        <span className="text-yellow-700 font-semibold">{inst.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{inst.name}</h3>
                    <p className="text-slate-600 text-sm mb-4">{inst.expertise} • {inst.language}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700">{inst.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700">{inst.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span className="text-green-600 font-semibold">${inst.price}/hour</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
                        <p className="text-2xl font-bold text-slate-900">{tutorBookings.length}</p>
                        <p className="text-xs text-slate-600">Bookings</p>
                      </div>
                      <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
                        <p className="text-2xl font-bold text-green-600">${tutorRevenue}</p>
                        <p className="text-xs text-slate-600">Revenue</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                        {statusCounts.completed} Completed
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                        {statusCounts.confirmed} Confirmed
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-200">
                        {statusCounts.pending} Pending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <CustomCalendar bookings={bookings} instructors={instructors} />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution Pie Chart */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-indigo-600" />
                  Booking Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {statusDistribution.map((status, index) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-700 text-sm capitalize">{status.name}: {status.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tutor Revenue Bar Chart */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  Revenue by Tutor
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topTutors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                      formatter={(value: number) => [`${value}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Student Bookings Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-600" />
                Recent Bookings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-600 font-semibold">Student</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-semibold">Tutor</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.slice(0, 10).map(booking => {
                      const instructor = instructors.find(i => i.id === booking.instructor_id);
                      const statusColors = {
                        completed: 'bg-green-100 text-green-700 border-green-200',
                        confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
                        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                        cancelled: 'bg-red-100 text-red-700 border-red-200'
                      };
                      const statusIcons = {
                        completed: CheckCircle,
                        confirmed: Video,
                        pending: AlertCircle,
                        cancelled: XCircle
                      };
                      const StatusIcon = statusIcons[booking.status];
                      
                      return (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 text-slate-900 font-medium">{booking.student_name}</td>
                          <td className="py-4 px-4 text-slate-700">{instructor?.name}</td>
                          <td className="py-4 px-4 text-slate-700">
                            {booking.lesson_date ? new Date(booking.lesson_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-green-600 font-semibold">${booking.amount}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 shadow-xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8" />
                  <span className="text-3xl font-bold">{totalHours}</span>
                </div>
                <h4 className="text-lg font-semibold">Total Teaching Hours</h4>
                <p className="text-blue-100 text-sm mt-1">Across all tutors</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8" />
                  <span className="text-3xl font-bold">{totalStudents}</span>
                </div>
                <h4 className="text-lg font-semibold">Active Students</h4>
                <p className="text-purple-100 text-sm mt-1">Unique learners</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 shadow-xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8" />
                  <span className="text-3xl font-bold">${(totalRevenue / filteredBookings.length).toFixed(0)}</span>
                </div>
                <h4 className="text-lg font-semibold">Avg Booking Value</h4>
                <p className="text-green-100 text-sm mt-1">Per session</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}