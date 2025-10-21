"use client";

import React, { useState } from "react";
// All styling relies on Tailwind CSS classes to mimic Shadcn/ui components.

// --- Shadcn Style Utility Components (Used across all views) ---

// Status Badge Helper (Shadcn style - subtle, rounded)
const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (status.includes("upcoming") || status.includes("Not Started") || status.includes("Pending")) colorClass = "bg-indigo-100 text-indigo-700";
  else if (status.includes("Completed") || status.includes("Paid")) colorClass = "bg-green-100 text-green-700";
  else if (status.includes("In Progress") || status.includes("Review")) colorClass = "bg-yellow-100 text-yellow-700";
  else if (status.includes("cancelled")) colorClass = "bg-red-100 text-red-700";

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full uppercase ${colorClass}`}>
      {status}
    </span>
  );
};

// **Shadcn Style** Progress Ring (Level Progress) - Clean & Focused
const CustomProgressRing = ({ percentage, size = 150, stroke = 12 }: { percentage: number, size?: number, stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center relative transition duration-300 hover:ring-2 ring-indigo-500/30 rounded-full" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle className="text-gray-200" strokeWidth={stroke} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle
          className="text-indigo-600 transition-all duration-700 ease-out" 
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
};

// **Shadcn Style** Skill Radar Chart - Minimal & Clean
const MockSkillRadarChart = ({ skills }: { skills: Record<string, number> }) => {
  const skillLabels = Object.keys(skills);
  const skillValues = Object.values(skills);
  const maxSkill = 5; 
  const points = skillValues.map((value, index) => {
    const angle = (index / skillLabels.length) * 2 * Math.PI;
    const normalizedValue = value / maxSkill;
    const x = 50 + normalizedValue * 40 * Math.sin(angle);
    const y = 50 - normalizedValue * 40 * Math.cos(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-4 flex flex-col items-center">
      <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        <span className="mr-2 text-indigo-500">🧠</span> Skill Proficiency (1-5)
      </h4>
      <svg width="180" height="180" viewBox="0 0 100 100" className="mb-4">
        {/* Minimal Grid */}
        <circle cx="50" cy="50" r="45" stroke="#E5E7EB" fill="none" strokeWidth="1"/>
        
        {/* Data Polygon - Subtle primary fill */}
        <polygon points={points} fill="rgba(99, 102, 241, 0.1)" stroke="#4F46E5" strokeWidth="1.5" className="transition duration-300" />
        
        {/* Data Points */}
        {skillValues.map((value, index) => {
            const angle = (index / skillLabels.length) * 2 * Math.PI;
            const normalizedValue = value / maxSkill;
            const x = 50 + normalizedValue * 40 * Math.sin(angle);
            const y = 50 - normalizedValue * 40 * Math.cos(angle);
            return (
                <circle key={index} cx={x} cy={y} r="2.5" fill="#4F46E5" className="transition duration-150 hover:r-4 hover:fill-indigo-700" />
            );
        })}

        {/* Labels */}
        {skillLabels.map((label, index) => {
          const angle = (index / skillLabels.length) * 2 * Math.PI;
          const x = 50 + 52 * Math.sin(angle);
          const y = 50 - 52 * Math.cos(angle);
          return (
            <text key={label} x={x} y={y} fontSize="4" textAnchor={x > 50 ? 'start' : x < 50 ? 'end' : 'middle'} alignmentBaseline="middle" fill="#6B7280">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// **Shadcn Style** Doughnut Chart - Coordinated Color Palette
const EnhancedDoughnutChart = ({ data }: { data: Record<string, number> }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    let cumulativePercent = 0;
    const radius = 35; 
    const center = 50;
    const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"]; 

    const segments = Object.keys(data).map((key, index) => {
        const value = data[key];
        const percent = (value / total) * 100;
        const startAngle = (cumulativePercent / 100) * 360;
        cumulativePercent += percent;
        const endAngle = (cumulativePercent / 100) * 360;
        
        const color = colors[index % colors.length];
        const largeArcFlag = percent > 50 ? 1 : 0;
        const start = {
            x: center + radius * Math.sin((Math.PI / 180) * startAngle),
            y: center - radius * Math.cos((Math.PI / 180) * startAngle)
        };
        const end = {
            x: center + radius * Math.sin((Math.PI / 180) * endAngle),
            y: center - radius * Math.cos((Math.PI / 180) * endAngle)
        };
        
        const pathData = [
            `M ${center} ${center}`,
            `L ${start.x} ${start.y}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
            `Z`
        ].join(' ');

        return { key, value, percent, color, pathData };
    });

    return (
        <div className="p-4 border-t border-gray-100">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                <span className="mr-2 text-yellow-500">⏱️</span> Lesson Focus Breakdown
            </h4>
            <div className="flex items-center">
                <svg width="150" height="150" viewBox="0 0 100 100" className="mr-6 transition duration-300">
                    {segments.map((s, index) => (
                        <path key={s.key} d={s.pathData} fill={s.color} className="cursor-pointer transition duration-150 hover:opacity-90" />
                    ))}
                    {/* Inner Circle to make it a Doughnut */}
                    <circle cx="50" cy="50" r="20" fill="white" />
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#374151" fontWeight="bold">
                        {total} min
                    </text>
                </svg>
                <div className="flex flex-col justify-center space-y-2 text-sm">
                    {segments.map(s => (
                        <div key={s.key} className="flex items-center hover:bg-gray-50 p-1 rounded transition duration-150 cursor-default">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: s.color }}></span>
                            <span className="text-gray-700 font-medium">{s.key}:</span>
                            <span className="font-bold ml-1 text-gray-900">{s.percent.toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// **Shadcn Style** Line Chart Mock (Minimalist & Elegant)
const ApexLineChartMock = ({ data, title, unit }: { data: Record<string, number>, title: string, unit: string }) => {
    const values = Object.values(data);
    const labels = Object.keys(data);
    const maxVal = Math.max(...values, 10);
    const height = 180; 
    const width = 400;
    const padding = 25;
    const chartHeight = height - 2 * padding;
    const chartWidth = width - 2 * padding;
    const xStep = labels.length > 1 ? chartWidth / (labels.length - 1) : 0;

    const points = values.map((val, index) => {
        const x = padding + index * xStep;
        const y = height - padding - (val / maxVal) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    const lastPoint = values.length > 0 ? values[values.length - 1] : 0;

    return (
        <div className="p-4">
            <h4 className="text-xl font-semibold mb-1 text-gray-800 flex items-center">
                <span className="mr-2 text-green-600">📈</span> {title}
            </h4>
            <p className="text-sm text-gray-500 mb-4">Tracking monthly trend of {unit.toLowerCase()}.</p>

            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Minimal Grid Lines */}
                {[0.5, 1.0].map((ratio, index) => (
                    <line key={index} x1={padding} y1={height - padding - ratio * chartHeight} x2={width - padding} y2={height - padding - ratio * chartHeight} stroke="#F3F4F6" strokeDasharray="4 4" />
                ))}

                {/* Data Area (Subtle Primary Fill) */}
                <defs>
                    <linearGradient id="lineGradientShadcn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15"/>
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0"/>
                    </linearGradient>
                </defs>

                {/* Area under the curve */}
                <polygon fill="url(#lineGradientShadcn)" points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`} />
                
                {/* Data Line - Primary color, smooth look */}
                {values.length > 1 && <polyline fill="none" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />}
                
                {/* Data Points - Subtle hover effect to simulate professional tooltip target */}
                {values.map((val, index) => {
                    const x = padding + index * xStep;
                    const y = height - padding - (val / maxVal) * chartHeight;
                    return (
                        <circle key={index} cx={x} cy={y} r="6" fill="transparent" stroke="transparent" strokeWidth="0" className="transition duration-150 hover:r-4 hover:fill-indigo-500 cursor-pointer" />
                    );
                })}
                
                {/* Labels */}
                {labels.map((label, index) => {
                    const x = padding + index * xStep;
                    return (
                        <text key={label} x={x} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#6B7280">
                            {label}
                        </text>
                    );
                })}
                 {/* Last Value Label */}
                <text x={width - padding} y={height - padding - (lastPoint / maxVal) * chartHeight - 10} textAnchor="end" fontSize="12" fontWeight="bold" fill="#4F46E5">
                    {lastPoint} {unit.toLowerCase()}
                </text>
            </svg>
        </div>
    );
};

// **Shadcn Style** Gamification Scorecard - Minimalist, Primary Accent
const GamificationScorecard = ({ score, rank, badge }: { score: number, rank: string, badge: string }) => {
    return (
        <div className="p-5 bg-white rounded-xl border shadow-sm hover:shadow-lg hover:ring-2 ring-indigo-500/10 transition duration-300">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                <span className="text-yellow-500 mr-2">✨</span> Learner XP Score
            </h3>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Total XP Earned</p>
                    <p className="text-5xl font-extrabold mt-1 tracking-tight text-indigo-600">{score.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Current Rank</p>
                    <p className="text-2xl font-bold text-gray-900">{rank}</p>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">Next Goal Badge:</p>
                <p className="text-base font-medium text-gray-700">{badge}</p>
            </div>
        </div>
    );
};

// --- Type Definitions and Data Interfaces ---
type DashboardView =
  | "Dashboard"
  | "Lessons"
  | "Tutors"
  | "Exercises"
  | "Payments"
  | "Goals"
  | "Messages"
  | "Settings";

interface Tutor {
    id: number;
    name: string;
    language: string;
    rating: number;
    bookedLessons: number;
    bio: string;
    specialties: string[];
    availability: string;
    image: string;
}

interface Lesson {
    id: number;
    title: string;
    tutor: string;
    startsAt: string;
    durationMins: number;
    zoomMeetingId: string;
    status: string;
    language: string;
    notes: string;
}

interface Exercise {
    id: number;
    type: string;
    language: string;
    title: string;
    status: string;
    completed: boolean;
    dueDate: string;
}

interface Payment {
    id: number;
    amount: number;
    date: string;
    description: string;
    status: string;
    method: string;
    type: 'debit' | 'credit'; 
}

interface Goal {
    id: number;
    title: string;
    target: string;
    progress: number;
    dueDate: string;
    status: string;
}

// 🌍 LangZone Student Dashboard - Complete Component
export default function StudentDashboard() {
  // --- State Management and Mock Data ---
  const [activeView, setActiveView] = useState<DashboardView>("Dashboard");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  // Initial student data (read-only base)
  const [initialStudent] = useState({
    name: "Tendai Chipo",
    email: "tendai.chipo@mail.com",
    timezone: "Africa/Harare",
    level: "Intermediate B2",
    targetLanguage: "English",
    notificationEmail: true,
    notificationSMS: false,
    streak: 15,
  });

  // State for mutable settings form (to fix the console warning)
  const [settingsForm, setSettingsForm] = useState({
      name: initialStudent.name,
      timezone: initialStudent.timezone,
      notificationEmail: initialStudent.notificationEmail,
      notificationSMS: initialStudent.notificationSMS,
  });

  // New handler for input changes
  function handleSettingsChange(field: string, value: any) {
      setSettingsForm(prev => ({ ...prev, [field]: value }));
  }

  const [lessons] = useState<Lesson[]>([
    { id: 1, title: "English Conversation: Ordering Food", tutor: "Tutor A (Sarah)", startsAt: "2025-10-22T10:00:00+02:00", durationMins: 60, zoomMeetingId: "987-654-3210", status: "upcoming", language: "English", notes: "Review vocabulary on food, restaurants, and common requests." },
    { id: 2, title: "French Grammar: Passé Composé", tutor: "Tutor B (Pierre)", startsAt: "2025-11-05T09:00:00+02:00", durationMins: 60, zoomMeetingId: "123-456-7890", status: "upcoming", language: "French", notes: "Focus on irregular verbs and use with être vs avoir." },
    { id: 3, title: "German Reading Comprehension", tutor: "Tutor C (Greta)", startsAt: "2025-09-15T16:00:00+02:00", durationMins: 45, zoomMeetingId: "555-111-2222", status: "completed", language: "German", notes: "Read and summarize article on renewable energy." },
    { id: 4, title: "Business English Roleplay", tutor: "Tutor A (Sarah)", startsAt: "2025-09-01T14:00:00+02:00", durationMins: 60, zoomMeetingId: "333-222-1111", status: "completed", language: "English", notes: "Simulated negotiation practice. Good use of polite phrases." },
  ].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()));

  const [progress] = useState({
    totalHours: 15.5,
    monthlyHours: 6.5,
    monthlyGoal: 10,
    levelProgress: 68,
    wordsLearned: 1250,
    gamificationScore: 5400,
    rank: "Diamond Learner",
    nextBadge: "Fluent Speaker (10,000 XP)",
    skillRating: {
        Listening: 4,
        Speaking: 3,
        Reading: 5,
        Writing: 3,
        Vocabulary: 4,
    },
    monthlyLearningHours: { 
        'Jul': 4, 'Aug': 7, 'Sep': 10, 'Oct': 6.5,
    },
    lessonTimeAllocation: { 
        'Conversation': 360,
        'Grammar': 180,
        'Writing Review': 90,
    }
  });

  const [exercises] = useState<Exercise[]>([
    { id: 1, type: "Vocabulary", language: "English", title: "Daily vocab: Food & Drinks (Flashcards)", status: "In Progress", completed: false, dueDate: "2025-10-25" },
    { id: 2, type: "Grammar", language: "English", title: "Past Tense Practice (Unit 4 Quiz)", status: "Completed", completed: true, dueDate: "2025-10-18" },
    { id: 3, type: "Listening", language: "French", title: "French Podcast Summary (Ep 2 Essay)", status: "Pending Review", completed: false, dueDate: "2025-10-28" },
    { id: 4, type: "Writing", language: "English", title: "Describe your last holiday (250 words)", status: "Not Started", completed: false, dueDate: "2025-10-30" },
    { id: 5, type: "Speaking Prep", language: "German", title: "Topic: Future Plans (Outline)", status: "In Progress", completed: false, dueDate: "2025-11-01" },
  ]);

  const [tutors] = useState<Tutor[]>([
    { id: 1, name: "Tutor A (Sarah)", language: "English", rating: 4.8, bookedLessons: 6, bio: "Expert in conversational English and IELTS prep.", specialties: ["IELTS", "Business English"], availability: "Mon, Wed, Fri", image: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Tutor B (Pierre)", language: "French", rating: 4.7, bookedLessons: 4, bio: "Native French speaker focusing on advanced grammar.", specialties: ["Grammar", "DEFL Prep"], availability: "Tues, Thurs", image: "https://i.pravatar.cc/150?img=5" },
    { id: 3, name: "Tutor C (Greta)", language: "German", rating: 4.5, bookedLessons: 2, bio: "A friendly tutor specializing in beginner and intermediate German.", specialties: ["Beginner", "Culture"], availability: "Weekends", image: "https://i.pravatar.cc/150?img=8" },
  ]);
  
  const [messages] = useState([
    { id: 1, from: "Tutor A (Sarah)", text: "Remember to review yesterday’s notes on Modal Verbs. See you tomorrow!", time: "1h ago", read: false, type: "Tutor" },
    { id: 2, from: "Admin", text: "Your new flashcards are ready in the Exercises tab.", time: "2h ago", read: false, type: "System" },
    { id: 3, from: "Tutor B (Pierre)", text: "Lesson rescheduled to next week due to a conflict.", time: "3d ago", read: true, type: "Tutor" },
    { id: 4, from: "Billing", text: "Invoice #1015 has been processed successfully.", time: "1w ago", read: true, type: "Billing" },
  ].sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1)));

  const [payments] = useState<Payment[]>([
    { id: 1, amount: 20.00, date: "2025-07-15", description: "Lesson with Tutor A", status: "Paid", method: "EcoCash", type: 'debit' },
    { id: 2, amount: 25.00, date: "2025-08-01", description: "Lesson with Tutor B", status: "Paid", method: "Visa Card", type: 'debit' },
    { id: 3, amount: 10.00, date: "2025-09-20", description: "Lesson with Tutor C", status: "Paid", method: "Wallet", type: 'debit' },
    { id: 4, amount: 50.00, date: "2025-09-15", description: "Wallet Top-Up", status: "Paid", method: "EcoCash", type: 'credit' },
    { id: 5, amount: 20.00, date: "2025-10-01", description: "Lesson with Tutor A", status: "Paid", method: "Visa Card", type: 'debit' },
    { id: 6, amount: 30.00, date: "2025-10-20", description: "Lesson with Tutor B", status: "Pending", method: "Wallet", type: 'debit' },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  
  const [goals] = useState<Goal[]>([
    { id: 1, title: "Achieve B2 Speaking Fluency", target: "DEFL B2 Exam", progress: 68, dueDate: "2026-03-30", status: "In Progress" },
    { id: 2, title: "Master 2000 New Vocabulary Words", target: "Vocabulary count", progress: 62, dueDate: "2025-12-31", status: "In Progress" },
    { id: 3, title: "Complete Advanced Grammar Module", target: "Grammar Quiz Score > 90%", progress: 100, dueDate: "2025-09-01", status: "Completed" },
  ]);

  // --- Utility Functions ---
  function formatLocal(dt: string) {
    try {
      const d = new Date(dt);
      return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch (e) {
      return dt;
    }
  }

  // --- Modal Component (Tutor Profile) ---
  const TutorModal = ({ tutor, onClose }: { tutor: Tutor | null, onClose: () => void }) => {
    if (!tutor) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 space-y-4 border border-gray-200">
          <div className="flex justify-between items-start border-b pb-3">
            <h2 className="text-xl font-bold">{tutor.name.split('(')[0].trim()}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl font-semibold p-1 hover:bg-gray-100 rounded-full">
              &times;
            </button>
          </div>
          
          <p className="text-gray-700 italic">"{tutor.bio}"</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <span className="font-medium text-gray-600 block">Language:</span>
                <span className="text-indigo-600">{tutor.language}</span>
            </div>
            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
                <span className="font-medium text-gray-600 block">Rating:</span>
                <span className="text-yellow-700 font-bold">⭐ {tutor.rating}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium border">
                Close
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-md">
                Book Next Lesson
            </button>
          </div>
        </div>
      </div>
    );
  };


  // ------------------------------------------
  // --- 1. Dashboard View (Populated) ---
  // ------------------------------------------
  const renderDashboard = () => (
    <>
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, **{initialStudent.name}** 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            You are currently at **{initialStudent.level}** in {initialStudent.targetLanguage}. Keep up the great streak!
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-green-600 text-white shadow-sm hover:bg-green-700 h-10 px-4 py-2"
        >
          + Quick Book Tutor
        </button>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        
        {/* Left Section: Core Activity & Charts */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Progress & Gamification Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {/* Streak Card - Shadcn Style */}
            <div className="rounded-xl border border-gray-200 shadow-sm p-4 bg-white hover:ring-2 ring-green-500/10 transition duration-300 cursor-pointer flex flex-col justify-center items-center">
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Daily Streak 🔥</p>
                <p className="text-5xl font-extrabold text-green-900 mt-1">{initialStudent.streak}</p>
                <p className="text-xs text-gray-500">consecutive days</p>
            </div>
            {/* Gamification Scorecard (Shadcn Minimalist) */}
            <div className="sm:col-span-2">
                <GamificationScorecard score={progress.gamificationScore} rank={progress.rank} badge={progress.nextBadge} />
            </div>
          </div>

          {/* Line Chart for Monthly Progress - Shadcn/ApexCharts Style */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300">
            <ApexLineChartMock data={progress.monthlyLearningHours} title="Learning Trend" unit="Hours" />
          </div>
          
          {/* Upcoming Lesson - Clean Shadcn Card */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
            <div className="flex flex-col space-y-1.5 p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">📅 Next Lesson</h3>
            </div>
            <div className="p-4">
              {lessons.filter(l => l.status === "upcoming").slice(0, 1).map((l) => (
                <div key={l.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition duration-150 shadow-sm">
                  <div className="mb-2 sm:mb-0">
                    <div className="font-semibold text-base text-indigo-800">{l.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      **{l.tutor.split('(')[0].trim()}** • {formatLocal(l.startsAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-green-600 text-white shadow-sm hover:bg-green-700 h-9 px-4"
                    >
                      🚀 Join Call
                    </button>
                    <button
                        onClick={() => setActiveView("Lessons")}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 h-9 px-4"
                    >
                        View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Section: Visualizations & Goals */}
        <aside className="space-y-6">
          
          {/* Level Progress VISUALIZATION - Shadcn Card */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6 text-center hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300 cursor-pointer">
            <h3 className="text-lg font-semibold mb-4 flex justify-center items-center text-gray-800">
                ✨ Level Mastery
            </h3>
            <div className="mb-4">
              <CustomProgressRing percentage={progress.levelProgress} />
            </div>
            <p className="text-sm text-gray-600 font-medium mt-3">
              **{initialStudent.level}** Progress
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              Next Assessment: 12 lessons remaining.
            </p>
          </div>
          
          {/* Skill Proficiency Radar Chart - Shadcn Card */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300">
            <MockSkillRadarChart skills={progress.skillRating} />
          </div>
          
          {/* Doughnut Chart for Time Allocation - Shadcn Card */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300">
            <EnhancedDoughnutChart data={progress.lessonTimeAllocation} />
          </div>

        </aside>
      </div>
    </>
  );

  // ------------------------------------------
  // --- 2. Lessons View (Populated) ---
  // ------------------------------------------
  const renderLessons = () => (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">📚 Lesson History & Schedule</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300">
          <p className="text-sm text-gray-500">Total Hours</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{progress.totalHours} hrs</p>
          <p className="text-xs text-gray-500 mt-1">Total learning time to date.</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-green-500/10 transition duration-300">
          <p className="text-sm text-gray-500">Upcoming Lessons</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{lessons.filter(l => l.status === 'upcoming').length}</p>
          <p className="text-xs text-gray-500 mt-1">Ready for your next session.</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-yellow-500/10 transition duration-300">
          <p className="text-sm text-gray-500">Completed Lessons</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{lessons.filter(l => l.status === 'completed').length}</p>
          <p className="text-xs text-gray-500 mt-1">Sessions finished and reviewed.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-200">All Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Lesson Title</th>
                <th className="px-6 py-3">Tutor</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lessons.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition duration-100">
                  <td className="px-6 py-4"><StatusBadge status={l.status} /></td>
                  <td className="px-6 py-4 font-medium text-gray-900">{l.title}</td>
                  <td className="px-6 py-4 text-gray-700">{l.tutor}</td>
                  <td className="px-6 py-4 text-xs">{formatLocal(l.startsAt)}</td>
                  <td className="px-6 py-4">{l.durationMins} mins</td>
                  <td className="px-6 py-4">
                    {l.status === 'upcoming' ? (
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3">Join</button>
                    ) : (
                        <button className="text-gray-500 hover:text-gray-700 text-sm font-medium mr-3">Notes</button>
                    )}
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // ------------------------------------------
  // --- 3. Tutors View (Populated) ---
  // ------------------------------------------
  const renderTutors = () => (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">👨‍🏫 Find Your Tutor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div 
            key={tutor.id} 
            className="rounded-xl border border-gray-200 shadow-sm bg-white p-5 space-y-3 flex flex-col hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300"
          >
            <div className="flex items-center space-x-4 border-b pb-3">
                <img className="w-12 h-12 rounded-full object-cover border border-gray-100" src={tutor.image} alt={tutor.name} />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tutor.name.split('(')[0].trim()}</h3>
                    <p className="text-sm text-gray-500">{tutor.language} Tutor</p>
                </div>
            </div>
            
            <p className="text-xs text-gray-600 flex-grow italic line-clamp-2">"{tutor.bio}"</p>
            
            <div className="flex justify-between items-center text-sm">
                <span className="text-yellow-600 font-bold">⭐ {tutor.rating}</span>
                <span className="text-gray-500">{tutor.bookedLessons} lessons booked</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {tutor.specialties.map(spec => (
                    <span key={spec} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                        {spec}
                    </span>
                ))}
            </div>

            <div className="pt-3 flex justify-end">
                <button 
                    onClick={() => setSelectedTutor(tutor)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm"
                >
                    View & Book
                </button>
            </div>
          </div>
        ))}
      </div>
      <TutorModal tutor={selectedTutor} onClose={() => setSelectedTutor(null)} />
    </>
  );

  // ------------------------------------------
  // --- 4. Exercises View (Populated) ---
  // ------------------------------------------
  const renderExercises = () => (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">📝 Language Exercises</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-green-500/10 transition duration-300">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{exercises.filter(e => e.status === 'Completed').length}</p>
          <p className="text-xs text-gray-500 mt-1">Exercises finished.</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{exercises.filter(e => e.status === 'In Progress' || e.status === 'Not Started').length}</p>
          <p className="text-xs text-gray-500 mt-1">Exercises due soon.</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-yellow-500/10 transition duration-300">
          <p className="text-sm text-gray-500">Needs Review</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{exercises.filter(e => e.status === 'Pending Review').length}</p>
          <p className="text-xs text-gray-500 mt-1">Submitted work awaiting tutor feedback.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-200">To-Do List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Language</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exercises.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition duration-100">
                  <td className="px-6 py-4 font-medium">{e.dueDate}</td>
                  <td className="px-6 py-4 text-gray-900">{e.title}</td>
                  <td className="px-6 py-4">{e.type}</td>
                  <td className="px-6 py-4">{e.language}</td>
                  <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                  <td className="px-6 py-4">
                    {!e.completed && e.status !== 'Pending Review' ? (
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Start</button>
                    ) : e.status === 'Pending Review' ? (
                        <span className="text-xs text-gray-500 italic">Awaiting Feedback</span>
                    ) : (
                        <span className="text-xs text-green-600">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
  
  // ------------------------------------------
  // --- 5. Payments View (Populated + Data Viz) ---
  // ------------------------------------------
  const renderPayments = () => {
    const monthlySpending = payments
      .filter(p => p.type === 'debit' && p.status === 'Paid') 
      .reduce((acc: Record<string, number>, p) => {
        const month = new Date(p.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + p.amount;
        return acc;
      }, {});
    
    // Ensure chart months are consistently present
    const spendingData = {
        'Jul': monthlySpending.Jul || 0,
        'Aug': monthlySpending.Aug || 0,
        'Sep': monthlySpending.Sep || 0,
        'Oct': monthlySpending.Oct || 0,
    };
    
    const walletBalance = payments.reduce((balance, p) => {
        // Initial mock balance: $45.00 
        if (p.type === 'credit' && p.status === 'Paid') return balance + p.amount;
        if (p.type === 'debit' && p.status === 'Paid') return balance - p.amount;
        return balance;
    }, 45.00); 

    const totalDebit = payments.filter(p => p.type === 'debit' && p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

    return (
      <>
        <h1 className="text-3xl font-bold tracking-tight mb-6">💸 Payments & Billing (USD)</h1>
        
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-green-500/10 transition duration-300 cursor-pointer">
            <p className="text-sm text-gray-500 font-medium">Wallet Balance</p>
            <p className="text-4xl font-bold text-green-600 mt-1">${walletBalance.toFixed(2)}</p>
            <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 font-medium shadow-sm">
              Top Up Wallet
            </button>
          </div>
          <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-gray-200 transition duration-200 cursor-pointer">
            <p className="text-sm text-gray-500">Total Spent YTD</p>
            <p className="text-2xl font-bold text-gray-900">${totalDebit.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">On lessons and materials.</p>
          </div>
          <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md hover:ring-2 ring-yellow-500/10 transition duration-200 cursor-pointer">
            <p className="text-sm text-gray-500">Pending Invoices</p>
            <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'Pending').length}</p>
            <p className="text-sm text-gray-500 mt-1">Lessons pending payment.</p>
          </div>
        </div>

        {/* Data Visualization: Monthly Spending Trend */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white mb-6 hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300">
            <ApexLineChartMock data={spendingData} title="Monthly Spending Trend" unit="USD" />
        </div>

        {/* Transaction History Table */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-200">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                 {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition duration-100">
                    <td className="px-6 py-4 text-sm">{p.date}</td>
                    <td className="px-6 py-4">{p.description}</td>
                    <td className={`px-6 py-4 font-semibold ${p.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {p.type === 'credit' ? '+' : '-'}${p.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{p.method}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };
  
  // ------------------------------------------
  // --- 6. Goals View (Populated) ---
  // ------------------------------------------
  const renderGoals = () => (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">🎯 Goals & Learning Roadmap</h1>
      
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-xl border border-gray-200 shadow-sm bg-white p-6 hover:shadow-md hover:ring-2 ring-indigo-500/10 transition duration-300">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{goal.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Target: **{goal.target}** | Due: {goal.dueDate}</p>
              </div>
              <StatusBadge status={goal.status} />
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-gray-700">Progress: {goal.progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-700 ${goal.progress === 100 ? 'bg-green-600' : 'bg-indigo-600'}`} 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium border">
                    Update Goal
                </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ------------------------------------------
  // --- 7. Messages View (Populated) ---
  // ------------------------------------------
  const renderMessages = () => (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">💬 Message Inbox</h1>
      
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white divide-y divide-gray-100">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`p-4 flex justify-between items-center transition duration-150 ${m.read ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100 border-l-4 border-indigo-600'}`}
          >
            <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${m.read ? 'bg-gray-400' : 'bg-indigo-600'}`} title={m.read ? "Read" : "Unread"}></div>
                <div>
                    <div className="text-sm font-semibold text-gray-900">{m.from} 
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${m.type === 'Tutor' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {m.type}
                        </span>
                    </div>
                    <p className={`text-sm mt-1 ${m.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{m.text}</p>
                </div>
            </div>
            <div className="text-right flex flex-col items-end">
                <span className="text-xs text-gray-400">{m.time}</span>
                <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ------------------------------------------
  // --- 8. Settings View (FIXED & Populated) ---
  // ------------------------------------------
  const renderSettings = () => (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">⚙️ Account Settings & Preferences</h1>
      
      <div className="space-y-8">
        {/* Profile Settings Card */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input 
                        type="text" 
                        value={settingsForm.name} 
                        onChange={(e) => handleSettingsChange('name', e.target.value)} 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={initialStudent.email} disabled className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Timezone</label>
                    <select 
                        value={settingsForm.timezone}
                        onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option>Africa/Harare</option>
                        <option>Europe/London</option>
                        <option>America/New_York</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Target Language</label>
                    <input type="text" value={initialStudent.targetLanguage} disabled className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" />
                </div>
            </div>
        </div>

        {/* Notification Settings Card */}
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                    <label className="text-sm font-medium text-gray-700">Email Notifications for Lessons</label>
                    <input 
                        type="checkbox" 
                        checked={settingsForm.notificationEmail} 
                        onChange={(e) => handleSettingsChange('notificationEmail', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                    <label className="text-sm font-medium text-gray-700">SMS Notifications for Reminders</label>
                    <input 
                        type="checkbox" 
                        checked={settingsForm.notificationSMS} 
                        onChange={(e) => handleSettingsChange('notificationSMS', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-end">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-base font-medium shadow-md">
                Save Changes
            </button>
        </div>
      </div>
    </>
  );
  
  // --- Main Render Logic ---
  const renderContent = () => {
    switch (activeView) {
      case "Lessons": return renderLessons();
      case "Tutors": return renderTutors();
      case "Exercises": return renderExercises();
      case "Goals": return renderGoals();
      case "Payments": return renderPayments(); 
      case "Messages": return renderMessages();
      case "Settings": return renderSettings();
      case "Dashboard":
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 py-8">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white rounded-xl p-4 shadow-lg border border-gray-200 h-fit sticky top-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                LZ
              </div>
              <div>
                <div className="text-sm font-bold"></div>
                <div className="text-xs text-gray-500">{initialStudent.name}</div>
              </div>
            </div>

            <nav className="space-y-1 text-sm">
              {([
                "Dashboard",
                "Lessons",
                "Tutors",
                "Exercises",
                "Goals",
                "Payments",
                "Messages",
                "Settings",
              ] as DashboardView[]).map((view) => (
                <a
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`block py-2 px-3 rounded-md cursor-pointer transition duration-150 ${
                    activeView === view
                      ? "bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {view}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}