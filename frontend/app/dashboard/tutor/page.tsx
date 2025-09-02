// app/dashboard/tutor/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import clsx from 'clsx';
import CountUp from 'react-countup';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Lesson {
  name: string;
  students: number;
  status: string;
  date: string;
}

interface Student {
  name: string;
  completed: number;
  total: number;
}

interface Activity {
  text: string;
  time: string;
}

export default function TutorDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'students' | 'settings'>('dashboard');

  const [stats, setStats] = useState({
    lessons: 12,
    revenue: 450,
    activeStudents: 8
  });

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const generateData = () => {
    const dummyLessons: Lesson[] = Array.from({ length: 5 }, (_, i) => ({
      name: `Lesson ${i + 1}`,
      students: Math.floor(Math.random() * 10) + 1,
      status: Math.random() > 0.3 ? 'Active' : 'Completed',
      date: `${Math.floor(Math.random() * 28) + 1}/09/2025`
    }));
    setLessons(dummyLessons);

    const dummyStudents: Student[] = Array.from({ length: 8 }, (_, i) => ({
      name: `Student ${i + 1}`,
      completed: Math.floor(Math.random() * 5) + 1,
      total: 5
    }));
    setStudents(dummyStudents);

    const dummyActivities: Activity[] = Array.from({ length: 5 }, (_, i) => ({
      text: `Student ${Math.floor(Math.random() * 10) + 1} completed a lesson`,
      time: `${Math.floor(Math.random() * 59) + 1} mins ago`
    }));
    setActivities(dummyActivities);

    setStats({
      lessons: dummyLessons.length,
      revenue: Math.floor(Math.random() * 1000),
      activeStudents: dummyStudents.length
    });
  };

  useEffect(() => {
    generateData();
    const interval = setInterval(() => generateData(), 5000);
    return () => clearInterval(interval);
  }, []);

  const gradient = (ctx: any, chartArea: any) => {
    if (!chartArea) return 'rgba(0,0,0,0)';
    const width = chartArea.right - chartArea.left;
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, 'rgba(20,184,166,0.5)');
    grad.addColorStop(0.5, 'rgba(249,115,22,0.5)');
    grad.addColorStop(1, 'rgba(239,68,68,0.5)');
    return grad;
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 500 + 50)),
        borderColor: 'rgba(20,184,166,1)',
        backgroundColor: (context: any) => gradient(context.chart.ctx, context.chart.chartArea),
        tension: 0.4,
        fill: true,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(20,184,166,1)',
        pointRadius: 5
      },
      {
        label: 'Lessons',
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 15 + 5)),
        borderColor: 'rgba(249,115,22,1)',
        backgroundColor: (context: any) => gradient(context.chart.ctx, context.chart.chartArea),
        tension: 0.4,
        fill: true,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(249,115,22,1)',
        pointRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: 'easeOutQuart' },
    plugins: {
      legend: { position: 'top' as const, labels: { color: '#333', font: { size: 14, weight: 'bold' } } },
      title: { display: true, text: 'Revenue & Lessons Trend', color: '#111', font: { size: 16 } },
      tooltip: { mode: 'index', intersect: false }
    },
    interaction: { mode: 'nearest' as const, intersect: false },
    scales: {
      y: { ticks: { color: '#111' }, grid: { color: '#e5e7eb' } },
      x: { ticks: { color: '#111' }, grid: { color: '#e5e7eb' } }
    }
  };

  const statsConfig = [
    { value: stats.lessons, label: 'Lessons', color: '#14b8a6', max: 20 },
    { value: stats.revenue, label: 'Revenue $', color: '#f97316', max: 1000 },
    { value: stats.activeStudents, label: 'Students', color: '#e11d48', max: 20 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Tabs */}
      <div className="flex gap-2 md:gap-4 mb-6 flex-wrap justify-center">
        {['dashboard', 'lessons', 'students', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={clsx(
              'py-2 px-4 rounded-full font-semibold transition text-sm md:text-base',
              activeTab === tab
                ? 'bg-teal-600 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 transform'
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 md:space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {statsConfig.map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-4 md:p-6 rounded-3xl shadow-lg flex flex-col items-center transition transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-20 h-20 md:w-24 md:h-24">
                  <CircularProgressbar
                    value={s.value}
                    maxValue={s.max}
                    text={<CountUp start={0} end={s.value} duration={1.5} separator="," />}
                    styles={buildStyles({
                      textColor: s.color,
                      pathColor: s.color,
                      trailColor: '#e5e7eb',
                      textSize: '16px',
                      pathTransitionDuration: 1.5
                    })}
                  />
                </div>
                <p className="mt-2 text-gray-600 font-semibold text-sm md:text-base">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transition" style={{ height: 280 }}>
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Mini sparkline cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Revenue', 'Lessons'].map((metric) => (
              <div key={metric} className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition">
                <p className="text-gray-500 font-semibold text-sm">{metric} Trend</p>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                      {
                        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 500 + 50)),
                        borderColor: metric === 'Revenue' ? 'rgba(20,184,166,1)' : 'rgba(249,115,22,1)',
                        backgroundColor: 'rgba(0,0,0,0)',
                        tension: 0.4,
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 5
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    scales: { x: { display: false }, y: { display: false } }
                  }}
                  style={{ height: 80 }}
                />
              </div>
            ))}
          </div>

          {/* Recent Activities & Upcoming Lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
              <h3 className="font-bold text-lg mb-2 md:mb-4">Recent Activity</h3>
              <ul className="space-y-2">
                {activities.map((act, idx) => (
                  <li key={idx} className="flex justify-between px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm md:text-base">
                    <span>{act.text}</span>
                    <span className="text-gray-400">{act.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
              <h3 className="font-bold text-lg mb-2 md:mb-4">Upcoming Lessons</h3>
              <ul className="space-y-2">
                {lessons.map((lesson, idx) => (
                  <li key={idx} className="flex justify-between px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-sm md:text-base">
                    <span>{lesson.name}</span>
                    <span className="text-blue-700 font-semibold">{lesson.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Students Progress */}
          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
            <h3 className="font-bold text-lg mb-2 md:mb-4">Student Progress</h3>
            <ul className="space-y-2">
              {students.map((student, idx) => (
                <li key={idx}>
                  <p className="font-semibold text-sm md:text-base">{student.name}</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 md:h-4">
                    <div
                      className="h-3 md:h-4 rounded-full transition-all"
                      style={{
                        width: `${(student.completed / student.total) * 100}%`,
                        background: 'linear-gradient(to right, #14b8a6, #f97316)'
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Lessons */}
      {activeTab === 'lessons' && (
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg overflow-x-auto hover:shadow-2xl transition">
          <table className="min-w-full table-auto border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-3 md:px-4 py-2">Lesson</th>
                <th className="px-3 md:px-4 py-2">Students</th>
                <th className="px-3 md:px-4 py-2">Status</th>
                <th className="px-3 md:px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, idx) => (
                <tr key={idx} className="text-center border-b hover:bg-gray-50 transition">
                  <td className="px-3 md:px-4 py-2">{lesson.name}</td>
                  <td className="px-3 md:px-4 py-2">{lesson.students}</td>
                  <td
                    className={clsx(
                      'px-3 md:px-4 py-2 font-semibold rounded-full text-white',
                      lesson.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                    )}
                  >
                    {lesson.status}
                  </td>
                  <td className="px-3 md:px-4 py-2">{lesson.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Students */}
      {activeTab === 'students' && (
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg overflow-x-auto hover:shadow-2xl transition">
          <table className="min-w-full table-auto border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-3 md:px-4 py-2">Student</th>
                <th className="px-3 md:px-4 py-2">Completed Lessons</th>
                <th className="px-3 md:px-4 py-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx} className="text-center border-b hover:bg-gray-50 transition">
                  <td className="px-3 md:px-4 py-2">{student.name}</td>
                  <td className="px-3 md:px-4 py-2">{student.completed} / {student.total}</td>
                  <td className="px-3 md:px-4 py-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 md:h-4">
                      <div
                        className="h-3 md:h-4 rounded-full transition-all"
                        style={{
                          width: `${(student.completed / student.total) * 100}%`,
                          background: 'linear-gradient(to right, #14b8a6, #f97316)'
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <p className="text-gray-700 text-sm md:text-base">Here you can add settings like profile info, password change, notifications, etc.</p>
        </div>
      )}
    </div>
  );
}
