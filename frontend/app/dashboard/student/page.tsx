"use client";

import React, { useState } from "react";
// All styling relies on Tailwind CSS classes to mimic Shadcn/ui components.

// --- Shadcn Style Utility Components (Used across all views) ---

// Status Badge Helper (Shadcn style - subtle, rounded with icon)
const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  let icon = "○";
  
  if (status.includes("upcoming") || status.includes("Not Started") || status.includes("Pending")) {
    colorClass = "bg-indigo-100 text-indigo-700 border border-indigo-200";
    icon = "⏳";
  } else if (status.includes("Completed") || status.includes("Paid")) {
    colorClass = "bg-green-100 text-green-700 border border-green-200";
    icon = "✓";
  } else if (status.includes("In Progress") || status.includes("Review")) {
    colorClass = "bg-yellow-100 text-yellow-700 border border-yellow-200";
    icon = "⟳";
  } else if (status.includes("cancelled")) {
    colorClass = "bg-red-100 text-red-700 border border-red-200";
    icon = "✕";
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${colorClass} transition-all duration-200 hover:scale-105`}>
      <span>{icon}</span>
      <span>{status}</span>
    </span>
  );
};

// **Shadcn Style** Progress Ring (Level Progress) - Enhanced with animation
const CustomProgressRing = ({ percentage, size = 150, stroke = 12 }: { percentage: number, size?: number, stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center relative transition-all duration-300 hover:scale-105 group" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle className="text-gray-200" strokeWidth={stroke} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle
          className="text-indigo-600 transition-all duration-1000 ease-out" 
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900 transition-all duration-300 group-hover:scale-110">{percentage}%</span>
        <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">to next level</span>
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

// **Shadcn Style** Gamification Scorecard - Enhanced with visual improvements
const GamificationScorecard = ({ score, rank, badge }: { score: number, rank: string, badge: string }) => {
    return (
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-xl hover:scale-105 hover:border-indigo-300 transition-all duration-300 group">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700 group-hover:text-indigo-600 transition-colors">
                <span className="text-2xl mr-2">✨</span> Learner XP Score
            </h3>
            <div className="flex justify-between items-end mb-4">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total XP Earned</p>
                    <p className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {score.toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Rank</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                      <span className="text-xl">💎</span> {rank}
                    </p>
                </div>
            </div>
            <div className="pt-4 border-t-2 border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Next Milestone:</p>
                <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg inline-block">
                  🎯 {badge}
                </p>
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

// 🌍  Student Dashboard - Complete Component
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

  // State for mutable settings form
  const [settingsForm, setSettingsForm] = useState({
      name: initialStudent.name,
      timezone: initialStudent.timezone,
      notificationEmail: initialStudent.notificationEmail,
      notificationSMS: initialStudent.notificationSMS,
  });

  // Handler for input changes
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
    { id: 1, from: "Tutor A (Sarah)", text: "Remember to review yesterday's notes on Modal Verbs. See you tomorrow!", time: "1h ago", read: false, type: "Tutor" },
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
                <span className="text-yellow-700 font-bold"> {tutor.rating}</span>
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
  // --- 1. Dashboard View ---
  // ------------------------------------------
  const renderDashboard = () => (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome back, <span className="text-indigo-600">{initialStudent.name}</span> 
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            You're at <span className="font-semibold text-indigo-600">{initialStudent.level}</span> in {initialStudent.targetLanguage}. Keep your {initialStudent.streak}-day streak going! 
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105 h-11 px-6 py-2 whitespace-nowrap"
        >
          <span className="mr-2">+</span> Quick Book
        </button>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        
        {/* Left Section: Core Activity & Charts */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Progress & Gamification Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {/* Streak Card - Enhanced */}
            <div className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center group">
                <p className="text-xs text-orange-700 font-semibold uppercase tracking-wider mb-1">Daily Streak</p>
                <div className="relative">
                  <p className="text-6xl font-extrabold text-orange-600 transition-all duration-300 group-hover:scale-110">{initialStudent.streak}</p>
                  <span className="absolute -top-2 -right-6 text-3xl animate-pulse">🔥</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">consecutive days</p>
                <div className="mt-3 w-full bg-orange-200 rounded-full h-1.5">
                  <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">2 days to milestone 🎯</p>
            </div>
            {/* Gamification Scorecard */}
            <div className="sm:col-span-2">
                <GamificationScorecard score={progress.gamificationScore} rank={progress.rank} badge={progress.nextBadge} />
            </div>
          </div>

          {/* Line Chart for Monthly Progress */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-lg transition-all duration-300">
            <ApexLineChartMock data={progress.monthlyLearningHours} title="Learning Trend" unit="Hours" />
          </div>
          
          {/* Upcoming Lesson - Enhanced */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
            <div className="flex flex-col space-y-1.5 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📅</span> Next Lesson
              </h3>
            </div>
            <div className="p-5">
              {lessons.filter(l => l.status === "upcoming").slice(0, 1).map((l) => (
                <div key={l.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 border-2 border-indigo-200 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 hover:shadow-md transition-all duration-300 gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-indigo-900 mb-2">{l.title}</div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                      <span className="flex items-center gap-1">
                        <span>👨‍🏫</span>
                        <span className="font-medium">{l.tutor.split('(')[0].trim()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🕐</span>
                        <span>{formatLocal(l.startsAt)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{l.durationMins} mins</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                    <button
                      className="flex-1 lg:flex-none inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:shadow-lg hover:scale-105 h-10 px-5 gap-2"
                    >
                      <span></span> Join Call
                    </button>
                    <button
                        onClick={() => setActiveView("Lessons")}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 h-10 px-5"
                    >
                        Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Section: Visualizations & Goals */}
        <aside className="space-y-6">
          
          {/* Level Progress VISUALIZATION */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="text-lg font-semibold mb-4 flex justify-center items-center text-gray-800 gap-2">
                <span className="text-xl"></span> Level Mastery
            </h3>
            <div className="mb-4 flex justify-center">
              <CustomProgressRing percentage={progress.levelProgress} />
            </div>
            <p className="text-sm text-gray-700 font-semibold mt-3">
              {initialStudent.level} Progress
            </p>
            <p className="text-xs text-indigo-600 mt-2 bg-indigo-50 py-2 px-3 rounded-lg inline-block">
              📊 12 lessons to next assessment
            </p>
          </div>
          
          {/* Skill Proficiency Radar Chart */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-lg transition-all duration-300">
            <MockSkillRadarChart skills={progress.skillRating} />
          </div>
          
          {/* Doughnut Chart for Time Allocation */}
          <div className="rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-lg transition-all duration-300">
            <EnhancedDoughnutChart data={progress.lessonTimeAllocation} />
          </div>

        </aside>
      </div>
    </>
  );

  // ------------------------------------------
  // --- 2. Lessons View ---
  // ------------------------------------------
  const renderLessons = () => (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">📚 Lesson History & Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your upcoming and past sessions</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 h-10 px-5">
          <span className="mr-2">+</span> Schedule New
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border shadow-sm p-6 bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-indigo-700 font-medium">Total Hours</p>
            <span className="text-2xl">📖</span>
          </div>
          <p className="text-4xl font-bold text-indigo-600">{progress.totalHours}</p>
          <p className="text-xs text-gray-600 mt-1">hrs of learning time</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-700 font-medium">Upcoming</p>
            <span className="text-2xl">⏰</span>
          </div>
          <p className="text-4xl font-bold text-green-600">{lessons.filter(l => l.status === 'upcoming').length}</p>
          <p className="text-xs text-gray-600 mt-1">sessions scheduled</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-yellow-700 font-medium">Completed</p>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{lessons.filter(l => l.status === 'completed').length}</p>
          <p className="text-xs text-gray-600 mt-1">finished sessions</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-md bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">All Sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Lesson Title</th>
                <th className="px-6 py-4">Tutor</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {lessons.map((l) => (
                <tr key={l.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-6 py-4"><StatusBadge status={l.status} /></td>
                  <td className="px-6 py-4 font-medium text-gray-900">{l.title}</td>
                  <td className="px-6 py-4 text-gray-700">{l.tutor}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{formatLocal(l.startsAt)}</td>
                  <td className="px-6 py-4 text-gray-700">{l.durationMins} mins</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {l.status === 'upcoming' ? (
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline">Join</button>
                      ) : (
                          <button className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline">Notes</button>
                      )}
                      <button className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline">Cancel</button>
                    </div>
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
  // --- 3. Tutors View ---
  // ------------------------------------------
  const renderTutors = () => (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">👨‍🏫 Find Your Tutor</h1>
          <p className="text-sm text-gray-500 mt-1">Browse and connect with expert language tutors</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 h-10 px-5">
          <span className="mr-2">🔍</span> Search Tutors
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div 
            key={tutor.id} 
            className="rounded-xl border border-gray-200 shadow-md bg-white p-6 space-y-4 flex flex-col hover:shadow-xl hover:scale-105 hover:border-indigo-300 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                <div className="relative">
                  <img className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 group-hover:border-indigo-400 transition-colors" src={tutor.image} alt={tutor.name} />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{tutor.name.split('(')[0].trim()}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <span>🌍</span> {tutor.language} Tutor
                    </p>
                </div>
            </div>
            
            <p className="text-sm text-gray-600 flex-grow italic line-clamp-2 bg-gray-50 p-3 rounded-lg border border-gray-100">"{tutor.bio}"</p>
            
            <div className="flex justify-between items-center text-sm py-2">
                <span className="flex items-center gap-1 text-yellow-600 font-bold">
                  <span></span> {tutor.rating}
                </span>
                <span className="text-gray-500 text-xs">{tutor.bookedLessons} lessons booked</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {tutor.specialties.map(spec => (
                    <span key={spec} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors">
                        {spec}
                    </span>
                ))}
            </div>

            <div className="pt-4 flex gap-2">
                <button 
                    onClick={() => setSelectedTutor(tutor)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                    View Profile
                </button>
            </div>
          </div>
        ))}
      </div>
      <TutorModal tutor={selectedTutor} onClose={() => setSelectedTutor(null)} />
    </>
  );

  // ------------------------------------------
  // --- 4. Exercises View ---
  // ------------------------------------------
  const renderExercises = () => (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">📝 Language Exercises</h1>
          <p className="text-sm text-gray-500 mt-1">Track your assignments and practice activities</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 h-10 px-5">
          <span className="mr-2">+</span> New Exercise
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border shadow-sm p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-700 font-medium">Completed</p>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-4xl font-bold text-green-600">{exercises.filter(e => e.status === 'Completed').length}</p>
          <p className="text-xs text-gray-600 mt-1">exercises finished</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-gradient-to-br from-indigo-50 to-blue-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-indigo-700 font-medium">In Progress</p>
            <span className="text-2xl"></span>
          </div>
          <p className="text-4xl font-bold text-indigo-600">{exercises.filter(e => e.status === 'In Progress' || e.status === 'Not Started').length}</p>
          <p className="text-xs text-gray-600 mt-1">tasks pending</p>
        </div>
        <div className="rounded-xl border shadow-sm p-6 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-yellow-700 font-medium">Under Review</p>
            <span className="text-2xl"></span>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{exercises.filter(e => e.status === 'Pending Review').length}</p>
          <p className="text-xs text-gray-600 mt-1">awaiting feedback</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-md bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Exercise Dashboard</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {exercises.map((e) => (
                <tr key={e.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-gray-900">{e.dueDate}</td>
                  <td className="px-6 py-4 text-gray-900">{e.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                      {e.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{e.language}</td>
                  <td className="px-6 py-4"><StatusBadge status={e.status} /></td>
                  <td className="px-6 py-4">
                    {!e.completed && e.status !== 'Pending Review' ? (
                        <button className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                          Start →
                        </button>
                    ) : e.status === 'Pending Review' ? (
                        <span className="text-xs text-yellow-600 italic font-medium">⏳ Awaiting Feedback</span>
                    ) : (
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">✓ Complete</span>
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
  // --- 5. Payments View ---
  // ------------------------------------------
  const renderPayments = () => {
    const monthlySpending = payments
      .filter(p => p.type === 'debit' && p.status === 'Paid') 
      .reduce((acc: Record<string, number>, p) => {
        const month = new Date(p.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + p.amount;
        return acc;
      }, {});
    
    const spendingData = {
        'Jul': monthlySpending.Jul || 0,
        'Aug': monthlySpending.Aug || 0,
        'Sep': monthlySpending.Sep || 0,
        'Oct': monthlySpending.Oct || 0,
    };
    
    const walletBalance = payments.reduce((balance, p) => {
        if (p.type === 'credit' && p.status === 'Paid') return balance + p.amount;
        if (p.type === 'debit' && p.status === 'Paid') return balance - p.amount;
        return balance;
    }, 45.00); 

    const totalDebit = payments.filter(p => p.type === 'debit' && p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

    return (
      <>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">💸 Payments & Billing</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your wallet and view transaction history</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <p className="text-sm text-green-700 font-medium mb-2">Wallet Balance</p>
            <p className="text-4xl font-bold text-green-600">${walletBalance.toFixed(2)}</p>
            <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 font-medium shadow-sm transition-all">
              Top Up Wallet
            </button>
          </div>
          <div className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
            <p className="text-sm text-gray-500">Total Spent YTD</p>
            <p className="text-2xl font-bold text-gray-900">${totalDebit.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">On lessons and materials</p>
          </div>
          <div className="rounded-xl border shadow-sm p-6 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
            <p className="text-sm text-yellow-700 font-medium">Pending Invoices</p>
            <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'Pending').length}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting payment</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 shadow-sm bg-white mb-6 hover:shadow-lg transition-all duration-300">
            <ApexLineChartMock data={spendingData} title="Monthly Spending Trend" unit="USD" />
        </div>

        <div className="rounded-xl border border-gray-200 shadow-md bg-white overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
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
  // --- 6. Goals View ---
  // ------------------------------------------
  const renderGoals = () => (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">🎯 Goals & Learning Roadmap</h1>
          <p className="text-sm text-gray-500 mt-1">Set and track your language learning milestones</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 h-10 px-5">
          <span className="mr-2">+</span> New Goal
        </button>
      </div>
      
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-xl border-2 border-gray-200 shadow-md bg-white p-6 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{goal.progress === 100 ? '🏆' : '🎯'}</span>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{goal.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span>🎓</span> {goal.target}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span>📅</span> Due {goal.dueDate}
                  </span>
                </div>
              </div>
              <StatusBadge status={goal.status} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="font-bold text-indigo-600">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${goal.progress === 100 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'}`} 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              {goal.progress < 100 && (
                <p className="text-xs text-gray-500 italic">
                  {100 - goal.progress}% remaining to reach your target
                </p>
              )}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium border border-gray-200 transition-colors">
                    View Details
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-md transition-all hover:shadow-lg">
                    Update Progress
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <span className="text-6xl mb-4 block">🎯</span>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No goals set yet</h3>
          <p className="text-gray-500 mb-4">Start tracking your progress by creating your first learning goal</p>
          <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-indigo-600 text-white shadow-md hover:shadow-lg h-10 px-6">
            Create Your First Goal
          </button>
        </div>
      )}
    </>
  );

  // ------------------------------------------
  // --- 7. Messages View ---
  // ------------------------------------------
  const renderMessages = () => {
    const unreadCount = messages.filter(m => !m.read).length;
    
    return (
      <>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">💬 Message Inbox</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 h-10 px-5">
            <span className="mr-2">✉️</span> Compose
          </button>
        </div>
        
        <div className="rounded-xl border border-gray-200 shadow-md bg-white divide-y divide-gray-100 overflow-hidden">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 ${m.read ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100 border-l-4 border-indigo-600'}`}
            >
              <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${m.read ? 'bg-gray-300' : 'bg-indigo-600 animate-pulse'}`} title={m.read ? "Read" : "Unread"}></div>
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${m.read ? 'text-gray-900' : 'text-indigo-900'}`}>{m.from}</span>
                        <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${m.type === 'Tutor' ? 'bg-blue-100 text-blue-700 border border-blue-200' : m.type === 'System' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                            {m.type}
                        </span>
                      </div>
                      <p className={`text-sm ${m.read ? 'text-gray-600' : 'text-gray-800 font-medium'} line-clamp-2`}>{m.text}</p>
                  </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className="text-xs text-gray-500 whitespace-nowrap">{m.time}</span>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline whitespace-nowrap transition-colors">
                    Reply →
                  </button>
              </div>
            </div>
          ))}
        </div>
        
        {messages.length === 0 && (
          <div className="text-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
            <p className="text-gray-500">Your inbox is empty. Messages from tutors and administrators will appear here</p>
          </div>
        )}
      </>
    );
  };

  // ------------------------------------------
  // --- 8. Settings View ---
  // ------------------------------------------
  const renderSettings = () => (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">⚙️ Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences</p>
      </div>
      
      <div className="space-y-6">
        {/* Profile Settings Card */}
        <div className="rounded-xl border border-gray-200 shadow-md bg-white p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <span className="text-xl">👤</span>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <span>📝</span> Full Name
                    </label>
                    <input 
                        type="text" 
                        value={settingsForm.name} 
                        onChange={(e) => handleSettingsChange('name', e.target.value)} 
                        className="w-full border-2 border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-400" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <span>📧</span> Email Address
                    </label>
                    <input 
                        type="email" 
                        value={initialStudent.email} 
                        disabled 
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" 
                    />
                    <p className="text-xs text-gray-500 italic">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <span>🌍</span> Timezone
                    </label>
                    <select 
                        value={settingsForm.timezone}
                        onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:border-gray-400 cursor-pointer"
                    >
                        <option>Africa/Harare</option>
                        <option>Europe/London</option>
                        <option>America/New_York</option>
                        <option>Asia/Tokyo</option>
                        <option>Australia/Sydney</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <span>🎯</span> Target Language
                    </label>
                    <input 
                        type="text" 
                        value={initialStudent.targetLanguage} 
                        disabled 
                        className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" 
                    />
                    <p className="text-xs text-gray-500 italic">Contact support to change</p>
                </div>
            </div>
        </div>

        {/* Notification Settings Card */}
        <div className="rounded-xl border border-gray-200 shadow-md bg-white p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <span className="text-xl">🔔</span>
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                        <span>📧</span> Email Notifications
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Receive lesson reminders and updates via email</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={settingsForm.notificationEmail} 
                        onChange={(e) => handleSettingsChange('notificationEmail', e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all" 
                      />
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 group">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                        <span>📱</span> SMS Reminders
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Get text message reminders before lessons</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={settingsForm.notificationSMS} 
                        onChange={(e) => handleSettingsChange('notificationSMS', e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all" 
                      />
                    </div>
                </div>
            </div>
        </div>

        {/* Learning Preferences Card */}
        <div className="rounded-xl border border-gray-200 shadow-md bg-white p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <span className="text-xl">📚</span>
              <h2 className="text-xl font-semibold text-gray-900">Learning Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Current Level</label>
                    <div className="p-3 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                      <span className="text-sm font-bold text-indigo-700">{initialStudent.level}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Daily Streak</label>
                    <div className="p-3 bg-orange-50 border-2 border-orange-200 rounded-lg">
                      <span className="text-sm font-bold text-orange-700 flex items-center gap-2">
                        🔥 {initialStudent.streak} days
                      </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-base font-medium border-2 border-gray-200 transition-all">
                Cancel
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 text-base font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
                💾 Save Changes
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 py-8">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-200 h-fit sticky top-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-200">
              
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide"></div>
                <div className="text-xs text-gray-600 truncate">{initialStudent.name}</div>
              </div>
            </div>

            <nav className="space-y-1.5 text-sm">
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
                  className={`flex items-center py-2.5 px-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeView === view
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-md scale-105"
                      : "hover:bg-gray-100 text-gray-700 hover:text-indigo-600 hover:scale-102"
                  }`}
                >
                  <span className={`mr-2 ${activeView === view ? 'text-lg' : ''}`}>
                    {view === "Dashboard" && "📊"}
                    {view === "Lessons" && "📚"}
                    {view === "Tutors" && "👨‍🏫"}
                    {view === "Exercises" && "📝"}
                    {view === "Goals" && "🎯"}
                    {view === "Payments" && "💳"}
                    {view === "Messages" && "💬"}
                    {view === "Settings" && "⚙️"}
                  </span>
                  {view}
                </a>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <button className="w-full py-2.5 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                🚪 Logout
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-gray-200">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}