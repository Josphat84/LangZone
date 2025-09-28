// app/ai-learning-hub/page.tsx
'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trophy, Gem, Star } from "lucide-react";

type AIModel = { id: string; name: string; description: string; examplePrompt: string };
type QuizQuestion = { question: string; options: string[]; answer: number };
type Challenge = { id: number; title: string; description: string; xp: number; isCompleted: boolean };

const AI_MODELS: AIModel[] = [
  { id: "gpt-4", name: "GPT-4", description: "Advanced text generation LLM.", examplePrompt: "Explain quantum physics simply." },
  { id: "dall-e", name: "DALL·E", description: "Generates images from text.", examplePrompt: "Draw a cat surfing a wave." },
  { id: "whisper", name: "Whisper", description: "Automatic speech recognition.", examplePrompt: "Transcribe audio file." },
];

const AI_QUIZ: QuizQuestion[] = [
  { question: "What does 'LLM' stand for?", options: ["Large Language Model","Logical Learning Module","Linear Language Machine"], answer: 0 },
  { question: "Which AI model generates images from text?", options: ["GPT-4","DALL·E","Whisper"], answer: 1 },
  { question: "Which task is Whisper specialized for?", options: ["Text summarization","Image generation","Speech recognition"], answer: 2 },
];

const AI_CHALLENGES: Challenge[] = [
  { id: 1, title: "Simple Prompt", description: "Write a creative prompt for GPT-4.", xp: 10, isCompleted: false },
  { id: 2, title: "Image Fun", description: "Create a prompt to generate a funny image with DALL·E.", xp: 15, isCompleted: false },
  { id: 3, title: "Transcribe Audio", description: "Use Whisper to transcribe a short audio.", xp: 20, isCompleted: false },
];

export default function AILearningHubPage() {
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [challenges, setChallenges] = useState(AI_CHALLENGES);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [gems, setGems] = useState(10);
  const [activeTab, setActiveTab] = useState<"prompt"|"models"|"quiz"|"challenges">("prompt");
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGeneratePrompt = () => {
    if (!prompt) return;
    setGeneratedPrompt(`🎯 AI Prompt for "${selectedModel}": "${prompt}"`);
  };

  const handleQuizAnswer = (index: number) => {
    if (AI_QUIZ[quizIndex].answer === index) setScore(score + 1);
    if (quizIndex + 1 < AI_QUIZ.length) setQuizIndex(quizIndex + 1);
    else { setShowScore(true); triggerConfetti(); }
  };

  const completeChallenge = (id: number, xpReward: number) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, isCompleted: true } : c));
    const newXp = xp + xpReward;
    let newLevel = level;
    let newGems = gems + 5;
    if (newXp >= level * 50) { newLevel += 1; newGems += 10; triggerConfetti(); }
    setXp(newXp % (level * 50));
    setLevel(newLevel);
    setGems(newGems);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const tabColors: Record<string, string> = {
    prompt: "bg-indigo-50 border-indigo-200",
    models: "bg-teal-50 border-teal-200",
    quiz: "bg-amber-50 border-amber-200",
    challenges: "bg-pink-50 border-pink-200"
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 relative">

      {showConfetti && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-start pt-20 pointer-events-none z-50">
          <span className="text-4xl">🎉✨</span>
        </div>
      )}

      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-800">AI Learning Hub 🌟</h1>
        <p className="text-gray-600">Learn AI, practice, and earn rewards!</p>
      </header>

      <Separator />

      {/* Tabs */}
      <div className="flex justify-center gap-4">
        {["prompt","models","quiz","challenges"].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className={`p-6 rounded-2xl shadow-md border-2 ${tabColors[activeTab]}`}>
        {activeTab === "prompt" && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input placeholder="Enter your prompt..." value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-1"/>
              <Select onValueChange={setSelectedModel} value={selectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={handleGeneratePrompt}>Generate</Button>
            </div>
            {generatedPrompt && <div className="p-4 bg-white rounded-xl shadow text-indigo-700 font-medium">{generatedPrompt}</div>}
          </div>
        )}

        {activeTab === "models" && (
          <div className="space-y-4">
            {AI_MODELS.map(model => (
              <Card key={model.id} className="p-4 bg-white rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="font-bold text-lg">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <p className="text-xs mt-1 font-mono bg-gray-100 p-1 rounded">{model.examplePrompt}</p>
                </div>
                <Button className="mt-2 md:mt-0">Explore</Button>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-4">
            {showScore ? (
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg">Quiz Completed! 🎉</h3>
                <p>Score: {score} / {AI_QUIZ.length}</p>
                <Button onClick={() => { setScore(0); setQuizIndex(0); setShowScore(false); }}>Retry</Button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg">{AI_QUIZ[quizIndex].question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AI_QUIZ[quizIndex].options.map((opt,i) => (
                    <Button key={i} variant="outline" onClick={() => handleQuizAnswer(i)}>{opt}</Button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="space-y-4">
            {challenges.map(ch => (
              <div key={ch.id} className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                <div>
                  <h3 className="font-bold">{ch.title}</h3>
                  <p className="text-sm text-muted-foreground">{ch.description}</p>
                </div>
                <Button onClick={() => completeChallenge(ch.id, ch.xp)} disabled={ch.isCompleted}>
                  {ch.isCompleted ? "Completed" : `Complete (+${ch.xp} XP)`}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Separator />

      {/* Progress Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-yellow-50 rounded-2xl shadow-md text-center border border-yellow-200">
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-2"><Trophy className="text-yellow-500"/> Level & XP</CardTitle>
          </CardHeader>
          <CardContent className="font-bold">{level} (XP: {xp}/{level*50})</CardContent>
        </Card>
        <Card className="p-6 bg-blue-50 rounded-2xl shadow-md text-center border border-blue-200">
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-2"><Gem className="text-blue-500"/> Gems</CardTitle>
          </CardHeader>
          <CardContent className="font-bold">{gems}</CardContent>
        </Card>
        <Card className="p-6 bg-purple-50 rounded-2xl shadow-md text-center border border-purple-200">
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-2"><Star className="text-purple-500"/> Completed Challenges</CardTitle>
          </CardHeader>
          <CardContent className="font-bold">{challenges.filter(c => c.isCompleted).length}/{challenges.length}</CardContent>
        </Card>
      </section>
    </div>
  );
}
