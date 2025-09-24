// app/kids/page.tsx

'use client';

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Gem,
  Trophy,
  Lock,
  CheckCircle,
  Flame,
  User as UserIcon,
  Gift,
} from "lucide-react";

// --- Types ---
type User = {
  id: string;
  name: string;
  role: "Member" | "Tutor" | "Admin";
  avatarUrl: string;
};

// --- Mock Users ---
const MOCK_USERS: User[] = [
  { id: "user-1", name: "Anna", role: "Member", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Anna" },
  { id: "user-2", name: "David", role: "Tutor", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=David" },
  { id: "user-3", name: "Maria", role: "Member", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Maria" },
  { id: "user-4", name: "You", role: "Member", avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=You" },
];

// --- Learning Paths ---
const LEARNING_PATHS = [
  {
    id: 1,
    title: "Animal Adventure",
    icon: "🦁",
    color: "bg-pink-100",
    lessons: [
      { id: 101, title: "Farm Animals", xp: 10, isLocked: false },
      { id: 102, title: "Jungle Animals", xp: 15, isLocked: false },
      { id: 103, title: "Sea Animals", xp: 20, isLocked: true },
    ],
  },
  {
    id: 2,
    title: "Space Quest",
    icon: "🚀",
    color: "bg-blue-100",
    lessons: [
      { id: 201, title: "Planets", xp: 15, isLocked: false },
      { id: 202, title: "Stars", xp: 20, isLocked: true },
      { id: 203, title: "Galaxies", xp: 25, isLocked: true },
    ],
  },
];

export default function KidsPage() {
  // --- State ---
  const [progress, setProgress] = useState({ level: 1, xp: 50, xpToNextLevel: 100 });
  const [rewards, setRewards] = useState({ gems: 25 });
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Audio Refs ---
  const dingRef = useRef<HTMLAudioElement | null>(null);
  const levelUpRef = useRef<HTMLAudioElement | null>(null);
  const lockedRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (ref: React.RefObject<HTMLAudioElement>) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play();
    }
  };

  // --- Handle lesson start ---
  const handleStartLesson = (lessonId: number, xp: number, isLocked: boolean) => {
    if (isLocked) {
      playSound(lockedRef);
      alert("🔒 This lesson is locked! Complete earlier lessons to unlock.");
      return;
    }

    if (!completedLessons.includes(lessonId)) {
      const newXp = progress.xp + xp;
      let newLevel = progress.level;
      let newXpToNextLevel = progress.xpToNextLevel;
      let newGems = rewards.gems + 5;

      if (newXp >= newXpToNextLevel) {
        newLevel += 1;
        newXpToNextLevel = newLevel * 100;
        newGems += 10;
        playSound(levelUpRef);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        alert(`🎉 Woohoo! You reached Level ${newLevel}!`);
      } else {
        playSound(dingRef);
      }

      setRewards({ gems: newGems });
      setProgress({ level: newLevel, xp: newXp % newXpToNextLevel, xpToNextLevel });
      setCompletedLessons([...completedLessons, lessonId]);

      alert(`✅ Lesson completed! You earned ${xp} XP and 5 gems!`);
    } else {
      alert("✨ You've already completed this lesson!");
    }
  };

  const getGreeting = () =>
    progress.level > 1
      ? `Awesome job! You're now Level ${progress.level}!`
      : "Hi, little learner! 🎈 Ready for a new adventure?";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 relative">

      {/* Tailwind Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random()}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Hidden audio elements */}
      <audio ref={dingRef} src="/sounds/ding.mp3" preload="auto" />
      <audio ref={levelUpRef} src="/sounds/level-up.mp3" preload="auto" />
      <audio ref={lockedRef} src="/sounds/error.mp3" preload="auto" />

      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-blue-600">🎉 Kids Corner</h1>
        <p className="text-xl text-gray-700 font-medium">
          Learn, play, and collect rewards!
        </p>
      </header>

      <Separator />

      {/* Mascot Greeting */}
      <div className="flex items-center justify-center gap-4 bg-purple-50 p-4 rounded-full shadow-lg animate-bounce">
        <img
          src="https://i.ibb.co/L6D8sJk/mascot.gif"
          alt="Mascot"
          className="w-16 h-16 rounded-full"
        />
        <span className="text-lg md:text-xl font-bold text-purple-800">{getGreeting()}</span>
      </div>

      {/* Progress */}
      <section className="bg-yellow-50 p-6 rounded-3xl shadow-lg border-2 border-yellow-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-yellow-700 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={32} />
            My Progress
          </CardTitle>
          <div className="text-2xl font-bold flex items-center gap-2 text-blue-600">
            <Gem className="text-blue-500 fill-blue-500" size={28} />
            {rewards.gems}
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="font-bold text-lg">Level {progress.level}</p>
            <p className="text-sm text-muted-foreground">
              {progress.xp}/{progress.xpToNextLevel} XP
            </p>
            <Progress
              value={(progress.xp / progress.xpToNextLevel) * 100}
              className="w-full h-4 mt-2 [&>div]:bg-yellow-400"
            />
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-purple-600">🌟 Learning Paths</h2>
        {LEARNING_PATHS.map((path) => (
          <Card
            key={path.id}
            className={`${path.color} p-6 rounded-3xl shadow-md border-2 border-purple-200`}
          >
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{path.icon}</span>
                <CardTitle className="text-2xl font-bold">{path.title}</CardTitle>
              </div>
              <p className="text-sm font-semibold">
                {completedLessons.filter((id) =>
                  path.lessons.some((lesson) => lesson.id === id)
                ).length}
                /{path.lessons.length} Lessons
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {path.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {completedLessons.includes(lesson.id) ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <Flame className="text-orange-500" size={24} />
                    )}
                    <div>
                      <h3 className="font-bold">{lesson.title}</h3>
                      <p className="text-xs text-muted-foreground">+{lesson.xp} XP</p>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      handleStartLesson(lesson.id, lesson.xp, lesson.isLocked)
                    }
                    disabled={lesson.isLocked}
                    variant={
                      completedLessons.includes(lesson.id) ? "secondary" : "default"
                    }
                    className="text-lg py-6"
                  >
                    {lesson.isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : completedLessons.includes(lesson.id) ? (
                      "Completed"
                    ) : (
                      "Play"
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Shop + Parents Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-red-50 rounded-3xl shadow-md border-2 border-red-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-700 flex items-center justify-center gap-2">
              <Gift className="text-red-500" size={28} />
              Gem Shop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">Spend gems on fun rewards & virtual stickers!</p>
            <div className="flex justify-center">
              <Button size="lg" className="text-lg py-6">
                Go to Shop
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 bg-blue-50 rounded-3xl shadow-md border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
              <UserIcon className="text-blue-500" size={28} />
              Parents' Corner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              Track your child’s progress and celebrate their achievements.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setShowParentDashboard(!showParentDashboard)}
              >
                {showParentDashboard ? "Hide" : "Show"} Dashboard
              </Button>
            </div>
            {showParentDashboard && (
              <div className="mt-4 p-4 bg-white rounded-xl">
                <h4 className="font-bold text-lg mb-2">📊 Progress Report</h4>
                <p>Lessons Completed: {completedLessons.length} / 6</p>
                <p>Current XP: {progress.xp}</p>
                <p>Total Gems: {rewards.gems}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
