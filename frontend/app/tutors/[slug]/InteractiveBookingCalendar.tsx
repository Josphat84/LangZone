// app/tutors/[slug]/InteractiveBookingCalendar.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Calendar, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TimeSlot {
  id: string;
  time: string;
  status: "available" | "booked" | "selected";
  bookedBy?: string;
}

interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

interface InteractiveBookingCalendarProps {
  tutorId: string;
  isTutor?: boolean;
}

const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const InteractiveBookingCalendar: React.FC<InteractiveBookingCalendarProps> = ({
  tutorId,
  isTutor = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const sample: Record<string, DaySchedule> = {};
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      const slots: TimeSlot[] = HOURS.map((time) => ({
        id: `${dateStr}-${time}`,
        time,
        status: Math.random() > 0.7 ? "booked" : "available",
        bookedBy: Math.random() > 0.7 ? "Student Name" : undefined,
      }));

      sample[dateStr] = { date: dateStr, slots };
    }

    setSchedule(sample);
  }, [tutorId]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleSlotClick = (slot: TimeSlot, date: Date) => {
    if (isPastDate(date) || slot.status === "booked") return;

    if (isTutor) {
      const dateStr = formatDate(date);
      setSchedule((prev) => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          slots: prev[dateStr].slots.map((s) =>
            s.id === slot.id
              ? { ...s, status: s.status === "available" ? "booked" : "available" }
              : s
          ),
        },
      }));
    } else {
      setSelectedSlot(slot);
      setSelectedDate(date);
    }
  };

  const bookSlot = () => {
    if (!selectedSlot || !selectedDate) return;
    const dateStr = formatDate(selectedDate);

    setSchedule((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        slots: prev[dateStr].slots.map((s) =>
          s.id === selectedSlot.id ? { ...s, status: "booked", bookedBy: "You" } : s
        ),
      },
    }));

    setSelectedSlot(null);
    setSelectedDate(null);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));

    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  // ----- Month View -----
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>{monthName}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) return <div key={index} className="h-20" />;
            const availableSlots = schedule[formatDate(day)]?.slots.filter((s) => s.status === "available").length || 0;
            const isSelected = selectedDate && formatDate(day) === formatDate(selectedDate);
            const isPast = isPastDate(day);

            let badgeVariant: "default" | "secondary" | "destructive" | "warning" = "default";
            if (availableSlots === 0) badgeVariant = "destructive";
            else if (availableSlots >= 5) badgeVariant = "secondary";
            else badgeVariant = "warning";

            return (
              <Button
                key={day.toISOString()}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`h-20 p-2 flex flex-col items-center justify-center ${
                  isPast ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                } ${isToday(day) ? "ring-2 ring-amber-400" : ""}`}
                onClick={() => !isPast && setSelectedDate(day)}
                disabled={isPast}
              >
                <div>{day.getDate()}</div>
                {!isPast && (
                  <Badge variant={badgeVariant} className="mt-1 text-xs">
                    {availableSlots > 0 ? `${availableSlots} slots` : "Full"}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  // ----- Week View -----
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);

    return (
      <div className="overflow-x-auto">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <div className="w-16"></div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="flex-1 p-2 text-center border-l border-gray-200 dark:border-gray-700"
            >
              <div className="font-medium">
                {day.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex">
          <div className="flex flex-col w-16 border-r border-gray-200 dark:border-gray-700">
            {HOURS.map((hour) => (
              <div key={hour} className="h-16 flex items-center justify-center text-xs text-muted-foreground">
                {hour}
              </div>
            ))}
          </div>

          {weekDays.map((day) => {
            const daySchedule = schedule[formatDate(day)];
            return (
              <div
                key={day.toISOString()}
                className="flex-1 flex flex-col border-l border-gray-200 dark:border-gray-700"
              >
                {HOURS.map((hour) => {
                  const slot = daySchedule?.slots.find((s) => s.time === hour);
                  if (!slot) return <div key={hour} className="h-16 border-b"></div>;

                  let bgClass = "bg-secondary/20";
                  if (slot.status === "booked") bgClass = "bg-destructive/20";
                  if (selectedSlot?.id === slot.id) bgClass = "bg-warning/30 ring-2 ring-blue-400";

                  return (
                    <div
                      key={slot.id}
                      className={`h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer ${bgClass} transition-all hover:scale-105`}
                      onClick={() => handleSlotClick(slot, day)}
                    >
                      {slot.status === "booked" && slot.bookedBy ? (
                        <div className="flex items-center space-x-1 text-xs">
                          <User className="w-3 h-3" />
                          <span>{slot.bookedBy}</span>
                        </div>
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ----- Day View -----
  const renderDayView = () => {
    if (!selectedDate) return <p>Select a date to see hourly slots</p>;
    const daySchedule = schedule[formatDate(selectedDate)];
    if (!daySchedule) return null;

    return (
      <div className="overflow-x-auto">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <div className="w-16 font-medium">Time</div>
          <div className="flex-1 p-2 text-center border-l border-gray-200 dark:border-gray-700">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col w-16 border-r border-gray-200 dark:border-gray-700">
            {HOURS.map((hour) => (
              <div key={hour} className="h-16 flex items-center justify-center text-xs text-muted-foreground">
                {hour}
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col border-l border-gray-200 dark:border-gray-700">
            {HOURS.map((hour) => {
              const slot = daySchedule.slots.find((s) => s.time === hour);
              if (!slot) return <div key={hour} className="h-16 border-b"></div>;

              let bgClass = "bg-secondary/20";
              if (slot.status === "booked") bgClass = "bg-destructive/20";
              if (selectedSlot?.id === slot.id) bgClass = "bg-warning/30 ring-2 ring-blue-400";

              return (
                <div
                  key={slot.id}
                  className={`h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer ${bgClass} transition-all hover:scale-105`}
                  onClick={() => handleSlotClick(slot, selectedDate)}
                >
                  {slot.status === "booked" && slot.bookedBy ? (
                    <div className="flex items-center space-x-1 text-xs">
                      <User className="w-3 h-3" />
                      <span>{slot.bookedBy}</span>
                    </div>
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dark/Light toggle */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? (
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </div>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "month" | "week" | "day")}>
        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
        </TabsList>

        <TabsContent value="month">{renderMonthView()}</TabsContent>
        <TabsContent value="week">{renderWeekView()}</TabsContent>
        <TabsContent value="day">{renderDayView()}</TabsContent>
      </Tabs>

      {!isTutor && selectedSlot && selectedDate && (
        <Button onClick={bookSlot} className="w-full mt-4">
          Book {selectedSlot.time} on {selectedDate.toLocaleDateString()}
        </Button>
      )}
    </div>
  );
};

export default InteractiveBookingCalendar;
