// app/tutors/[slug]/InteractiveBookingCalendar.tsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Calendar, CheckCircle2, XCircle, Moon, Sun } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  status: 'available' | 'booked' | 'selected';
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

const InteractiveBookingCalendar: React.FC<InteractiveBookingCalendarProps> = ({ tutorId, isTutor = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme helper function
  const getThemeClasses = () => ({
    background: isDarkMode ? 'bg-gray-900' : 'bg-white',
    cardBackground: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    borderHover: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    hoverBackground: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    selectedBackground: isDarkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500',
    todayBackground: isDarkMode 
      ? 'bg-gradient-to-br from-amber-900 to-orange-900 border-amber-600' 
      : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300',
    available: isDarkMode 
      ? 'border-green-600 bg-green-900 hover:bg-green-800 text-green-300'
      : 'border-green-300 bg-green-50 hover:bg-green-100 text-green-700',
    booked: isDarkMode 
      ? 'border-red-600 bg-red-900 text-red-300'
      : 'border-red-300 bg-red-50 text-red-700',
    selected: isDarkMode 
      ? 'border-blue-600 bg-blue-900 text-blue-300'
      : 'border-blue-300 bg-blue-50 text-blue-700',
    button: isDarkMode 
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-100 text-gray-600 hover:text-gray-800',
    activeButton: isDarkMode 
      ? 'bg-gray-600 text-blue-300'
      : 'bg-white text-blue-600'
  });

  // Generate sample data
  useEffect(() => {
    const generateSampleSchedule = () => {
      const sampleSchedule: Record<string, DaySchedule> = {};
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const timeSlots = [
          '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
        ].map((time) => ({
          id: `${dateStr}-${time}`,
          time,
          status: (Math.random() > 0.7 ? 'booked' : 'available') as 'booked' | 'available',
          bookedBy: Math.random() > 0.7 ? 'Student Name' : undefined
        }));

        sampleSchedule[dateStr] = { date: dateStr, slots: timeSlots };
      }
      
      setSchedule(sampleSchedule);
    };

    generateSampleSchedule();
  }, [tutorId]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getAvailableSlots = (date: Date) => {
    const dateStr = formatDate(date);
    return schedule[dateStr]?.slots.filter(slot => slot.status === 'available').length || 0;
  };

  const handleSlotClick = (slot: TimeSlot, date: Date) => {
    if (isPastDate(date) || slot.status === 'booked') return;
    
    if (isTutor) {
      // Toggle availability for tutor
      const dateStr = formatDate(date);
      setSchedule(prev => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          slots: prev[dateStr].slots.map(s => 
            s.id === slot.id 
              ? { ...s, status: s.status === 'available' ? 'booked' : 'available' }
              : s
          )
        }
      }));
    } else {
      // Select slot for student booking
      setSelectedSlot(slot);
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const bookSlot = () => {
    if (!selectedSlot || !selectedDate) return;
    
    const dateStr = formatDate(selectedDate);
    setSchedule(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        slots: prev[dateStr].slots.map(s => 
          s.id === selectedSlot.id 
            ? { ...s, status: 'booked' as const, bookedBy: 'You' }
            : s
        )
      }
    }));
    
    setSelectedSlot(null);
    setSelectedDate(null);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const theme = getThemeClasses();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${theme.text}`}>{monthName}</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigateMonth(-1)}
              className={`p-2 rounded-lg transition-colors ${theme.hoverBackground}`}
            >
              <ChevronLeft className={`w-5 h-5 ${theme.text}`} />
            </button>
            <button 
              onClick={() => navigateMonth(1)}
              className={`p-2 rounded-lg transition-colors ${theme.hoverBackground}`}
            >
              <ChevronRight className={`w-5 h-5 ${theme.text}`} />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`text-center text-sm font-medium ${theme.textMuted} py-2`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-20" />;
            }

            const availableSlots = getAvailableSlots(day);
            const isSelected = selectedDate && formatDate(day) === formatDate(selectedDate);
            const isPast = isPastDate(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !isPast && setSelectedDate(day)}
                disabled={isPast}
                className={`
                  h-20 p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105
                  ${isSelected 
                    ? theme.selectedBackground + ' shadow-lg'
                    : `${theme.border} ${theme.hoverBackground}`
                  }
                  ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                  ${isToday(day) ? theme.todayBackground : theme.background}
                `}
              >
                <div className={`text-sm font-medium ${theme.text}`}>
                  {day.getDate()}
                </div>
                {!isPast && (
                  <div className="mt-1">
                    {availableSlots > 0 ? (
                      <div className={`
                        text-xs px-2 py-1 rounded-full
                        ${availableSlots >= 5 ? 
                          isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700' :
                          availableSlots >= 3 ? 
                          isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700' :
                          isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}
                      `}>
                        {availableSlots} slots
                      </div>
                    ) : (
                      <div className={`text-xs ${theme.textMuted}`}>Full</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDaySlots = (date: Date) => {
    const dateStr = formatDate(date);
    const daySchedule = schedule[dateStr];
    const theme = getThemeClasses();
    
    if (!daySchedule) return null;

    return (
      <div className="space-y-3">
        <h4 className={`font-semibold ${theme.text} flex items-center`}>
          <Calendar className="w-4 h-4 mr-2" />
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {daySchedule.slots.map(slot => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot, date)}
              disabled={isPastDate(date) || (slot.status === 'booked' && !isTutor)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105
                ${slot.status === 'available' 
                  ? theme.available
                  : slot.status === 'booked'
                  ? theme.booked
                  : theme.selected
                }
                ${selectedSlot?.id === slot.id ? 'ring-4 ring-blue-200 shadow-lg' : ''}
                ${isPastDate(date) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{slot.time}</span>
              </div>
              
              {slot.status === 'available' && (
                <div className="flex items-center justify-center mt-1">
                  <CheckCircle2 className={`w-3 h-3 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                </div>
              )}
              
              {slot.status === 'booked' && (
                <div className="mt-1">
                  <div className="flex items-center justify-center">
                    <XCircle className={`w-3 h-3 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </div>
                  {slot.bookedBy && (
                    <div className="text-xs mt-1 flex items-center justify-center">
                      <User className="w-2 h-2 mr-1" />
                      {slot.bookedBy}
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const theme = getThemeClasses();

  return (
    <div className={`p-6 transition-colors duration-300 ${theme.background}`}>
      {/* Dark Mode Toggle & View Mode Selector */}
      <div className="flex justify-between items-center mb-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
            ${isDarkMode 
              ? 'bg-yellow-500 hover:bg-yellow-400 text-yellow-900' 
              : 'bg-gray-700 hover:bg-gray-800 text-yellow-400'
            }
          `}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="text-sm font-medium">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span className="text-sm font-medium">Dark</span>
            </>
          )}
        </button>

        {/* View Mode Selector */}
        <div className={`flex rounded-lg p-1 ${theme.cardBackground}`}>
          {(['month', 'week', 'day'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-4 py-2 rounded-md capitalize transition-all duration-200
                ${viewMode === mode 
                  ? `${theme.activeButton} shadow-md` 
                  : theme.button}
              `}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === 'month' && renderMonthView()}
      
      {/* Time Slots for Selected Date */}
      {selectedDate && (
        <div className={`mt-8 p-6 rounded-lg ${theme.cardBackground}`}>
          {renderDaySlots(selectedDate)}
          
          {/* Booking Button for Students */}
          {!isTutor && selectedSlot && (
            <div className="mt-6 text-center">
              <button
                onClick={bookSlot}
                className={`
                  px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg
                  ${isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                  }
                `}
              >
                Book {selectedSlot.time} on {selectedDate.toLocaleDateString()}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className={`mt-6 p-4 rounded-lg ${theme.cardBackground}`}>
        <h5 className={`font-medium ${theme.text} mb-3`}>Legend:</h5>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 border-2 rounded ${
              isDarkMode 
                ? 'bg-green-900 border-green-600' 
                : 'bg-green-100 border-green-300'
            }`}></div>
            <span className={theme.text}>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 border-2 rounded ${
              isDarkMode 
                ? 'bg-red-900 border-red-600' 
                : 'bg-red-100 border-red-300'
            }`}></div>
            <span className={theme.text}>Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 border-2 rounded ${
              isDarkMode 
                ? 'bg-blue-900 border-blue-600' 
                : 'bg-blue-100 border-blue-300'
            }`}></div>
            <span className={theme.text}>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 border-2 rounded ${
              isDarkMode 
                ? 'bg-gradient-to-br from-amber-900 to-orange-900 border-amber-600' 
                : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
            }`}></div>
            <span className={theme.text}>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBookingCalendar;