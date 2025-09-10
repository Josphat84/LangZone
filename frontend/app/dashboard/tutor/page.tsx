'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, BookOpen, DollarSign } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
}

// ---------------------- Mock Data ----------------------
const generateMockInstructors = (): Instructor[] => [
  { id: 48, name: 'James Brown', email: 'james@yahoo.com', language: 'English', expertise: 'Pro', price: 20, description: 'Hello everybody, I\'m James', country: 'USA' },
  { id: 61, name: 'Josphat Dandira', email: 'jj@yahoo.com', language: 'Shona', expertise: 'Native', price: 20, description: 'Makadii kwese', country: 'Zimbabwe' },
  { id: 67, name: 'Nomatter Chikwamba', email: 'nochik49work@gmail.com', language: 'English', expertise: 'Tutoring', price: 0, description: 'EMPTY', country: 'Zimbabwe' },
  { id: 68, name: 'Tinoe Genius', email: 'tinoetiger@gmail.com', language: 'English/French', expertise: 'EMPTY', price: 80, description: 'EMPTY', country: 'Zimbabwe' },
  { id: 69, name: 'Benson', email: 'benson@gmail.com', language: 'English', expertise: 'Pro', price: 25, description: 'Tutor Benson', country: 'Zimbabwe' },
  { id: 70, name: 'Lorenzo', email: 'lorenzo@gmail.com', language: 'Italian/English', expertise: 'Expert', price: 50, description: 'Tutor Lorenzo', country: 'Italy' },
  { id: 71, name: 'Nancy', email: 'nancy@gmail.com', language: 'English/Spanish', expertise: 'Advanced', price: 30, description: 'Tutor Nancy', country: 'Spain' },
];

const generateMockBookings = (instructors: Instructor[]): Booking[] =>
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    instructor_id: instructors[Math.floor(Math.random() * instructors.length)].id,
    student_name: ['Alice','Bob','Carol','David','Emma'][Math.floor(Math.random()*5)],
    student_email: `student${i}@example.com`,
    lesson_date: new Date(Date.now() - Math.random() * 60*24*60*60*1000).toISOString(),
    status: ['pending','confirmed','completed','cancelled'][Math.floor(Math.random()*4)] as any,
    amount: Math.floor(Math.random()*50)+15,
    created_at: new Date(Date.now() - Math.random()*60*24*60*60*1000).toISOString()
  }));

// ---------------------- Hooks ----------------------
const useDashboardData = () => {
  const [instructors,setInstructors] = useState<Instructor[]>([]);
  const [bookings,setBookings] = useState<Booking[]>([]);
  const [loading,setLoading] = useState(true);

  const generateMockData = useCallback(()=>{
    const mockInstructors = generateMockInstructors();
    const mockBookings = generateMockBookings(mockInstructors);
    setInstructors(mockInstructors);
    setBookings(mockBookings);
  },[]);

  useEffect(()=>{ generateMockData(); setLoading(false); },[generateMockData]);
  return { instructors, bookings, loading };
};

// ---------------------- CountUp Component ----------------------
const CountUpNumber = ({ end, duration=1500 }: { end:number; duration?:number })=>{
  const [count,setCount] = useState(0);
  useEffect(()=>{
    let start:number;
    const animate=(timestamp:number)=>{
      if(!start) start=timestamp;
      const progress = Math.min((timestamp-start)/duration,1);
      setCount(Math.floor(progress*end));
      if(progress<1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  },[end,duration]);
  return <span>{count.toLocaleString()}</span>;
};

// ---------------------- Main Dashboard ----------------------
export default function DashboardPage(){
  const { instructors, bookings, loading } = useDashboardData();
  const [activeTab,setActiveTab] = useState<'dashboard'|'tutors'|'calendar'|'settings'>('dashboard');
  const [trendTutorId,setTrendTutorId] = useState<number|'all'>('all');

  const filteredBookings = useMemo(()=>{
    if(trendTutorId==='all') return bookings;
    return bookings.filter(b=>b.instructor_id===trendTutorId);
  },[trendTutorId,bookings]);

  const revenueByDay = useMemo(()=>{
    const dayMap: Record<string, Record<number, number>> = {};
    filteredBookings.forEach(b=>{
      if(!b.lesson_date||!b.amount) return;
      const day = new Date(b.lesson_date).toISOString().slice(0,10);
      if(!dayMap[day]) dayMap[day] = {};
      dayMap[day][b.instructor_id] = (dayMap[day][b.instructor_id] || 0) + b.amount;
    });
    return Object.keys(dayMap).sort().map(d => ({ date: d, ...dayMap[d] }));
  }, [filteredBookings]);

  if(loading) return <div className="p-4 text-white">Loading...</div>;

  const totalRevenue = filteredBookings.reduce((sum,b)=>sum+(b.amount||0),0);
  const totalStudents = new Set(filteredBookings.map(b=>b.student_email)).size;
  const tutorCardColor = '#1f2937';
  const lineColors = ['#06d6a0','#118ab2','#ef476f','#ffd166','#8338ec','#ff7f50','#ffb347'];

  return (
    <div className="p-4 text-white space-y-6 font-sans">

      {/* ---------------- Tabs ---------------- */}
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-900 p-2 rounded mb-4 space-x-2 sticky top-0 z-10">
          {['dashboard','tutors','calendar','settings'].map(tab=>(
            <TabsTrigger
              key={tab}
              value={tab as any}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab===tab ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ---------------- DASHBOARD TAB ---------------- */}
        <TabsContent value="dashboard">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[{ icon: Users, label: 'Instructors', value: instructors.length },
              { icon: BookOpen, label: 'Bookings', value: filteredBookings.length },
              { icon: DollarSign, label: 'Revenue', value: totalRevenue, prefix:'$' },
              { icon: Users, label: 'Students', value: totalStudents }].map((stat,i)=>(
              <div key={i} className="bg-gray-800 p-4 rounded-lg flex flex-col items-center shadow hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1">
                <stat.icon className="mb-2 w-6 h-6" /> 
                <span className="text-sm">{stat.label}</span>
                <CountUpNumber end={stat.value}/> {stat.prefix||''}
              </div>
            ))}
          </div>

          {/* Tutor Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 mb-2">
            <label>Show trends for:</label>
            <select className="bg-gray-700 p-2 rounded" value={trendTutorId} onChange={e=>setTrendTutorId(e.target.value==='all'?'all':parseInt(e.target.value))}>
              <option value="all">All Tutors Combined</option>
              {instructors.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>

          {/* Revenue Trend Chart */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">{trendTutorId==='all'?'Revenue Trend':'Revenue Trend by Tutor'}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueByDay} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3"/>
                <XAxis dataKey="date" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor:'#222', border:'none', color:'#fff' }} formatter={(value:number)=>[`$${value.toFixed(2)}`,'Revenue']}/>
                <Legend />
                {instructors.map((tutor,i)=>(
                  <Line key={tutor.id} type="monotone" dataKey={tutor.id} stroke={lineColors[i%lineColors.length]} strokeWidth={2} dot={{ r:3 }} activeDot={{ r:5 }}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tutor Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {instructors.map(inst=>{
              const tutorBookings = bookings.filter(b=>b.instructor_id===inst.id);
              const tutorRevenue = tutorBookings.reduce((sum,b)=>sum+(b.amount||0),0);
              const trendData = tutorBookings.reduce((acc:any, b)=>{
                if(!b.lesson_date || !b.amount) return acc;
                const day = new Date(b.lesson_date).toISOString().slice(0,10);
                if(!acc[day]) acc[day] = 0;
                acc[day] += b.amount;
                return acc;
              }, {} as Record<string,number>);
              const trendArray = Object.keys(trendData).sort().map(day=>({ date: day, revenue: trendData[day] }));
              const statusCounts = { completed:0, pending:0, cancelled:0 };
              tutorBookings.forEach(b=>statusCounts[b.status]++);
              return (
                <div key={inst.id} className="p-4 rounded-lg shadow hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1" style={{ backgroundColor: tutorCardColor, color:'#fff' }}>
                  <div className="text-lg font-bold">{inst.name}</div>
                  <div className="text-sm">{inst.language} - {inst.expertise}</div>
                  <div className="text-sm mt-1">Bookings: {tutorBookings.length}</div>
                  <div className="text-sm">Revenue: ${tutorRevenue}</div>
                  <div className="text-xs">{inst.country}</div>

                  <div className="mt-2 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendArray}>
                        <Line type="monotone" dataKey="revenue" stroke="#06d6a0" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-wrap space-x-2 mt-2 text-xs">
                    {['completed','pending','cancelled'].map((status)=>{
                      const count = statusCounts[status as keyof typeof statusCounts];
                      const percentage = tutorBookings.length ? ((count/tutorBookings.length)*100).toFixed(0) : '0';
                      const colors: Record<string,string> = { completed:'#06d6a0', pending:'#f9c74f', cancelled:'#f9844a' };
                      const labels: Record<string,string> = { completed:'Completed', pending:'Pending', cancelled:'Cancelled' };
                      return (
                        <span key={status} className={`px-2 py-1 rounded-full font-semibold`} style={{backgroundColor:colors[status]}}>
                          {labels[status]}: {count} ({percentage}%)
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ---------------- TUTORS TAB ---------------- */}
        <TabsContent value="tutors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructors.map(inst=>{
              const tutorBookings = bookings.filter(b=>b.instructor_id===inst.id);
              return (
                <div key={inst.id} className="p-4 rounded-lg shadow hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1" style={{ backgroundColor: tutorCardColor, color:'#fff' }}>
                  <div className="text-lg font-bold">{inst.name}</div>
                  <div className="text-sm">{inst.language} - {inst.expertise}</div>
                  <div>${inst.price}</div>
                  <div>Bookings: {tutorBookings.length}</div>
                  <div className="text-xs">{inst.country}</div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ---------------- CALENDAR TAB ---------------- */}
        <TabsContent value="calendar">
          <FullCalendar
            plugins={[dayGridPlugin,timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' }}
            events={bookings.map(b=>({ 
              title: `${instructors.find(i=>i.id===b.instructor_id)?.name} - $${b.amount}`,
              start: b.lesson_date, 
              color: b.status==='completed'?'#06d6a0': b.status==='cancelled'?'#ffa500':'#f94144'
            }))}
            height={600}
            className="bg-gray-800 rounded-lg p-2 shadow"
          />
        </TabsContent>

        {/* ---------------- SETTINGS TAB ---------------- */}
        <TabsContent value="settings">
          <div className="bg-gray-800 p-4 rounded-lg shadow">Settings coming soon...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
