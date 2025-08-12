//[slug]/BookingCalendar.tsx

'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { addHours, format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';

interface BookingCalendarProps {
  instructor: {
    id: string;
    name: string;
    price?: number | null;
    zoom_link?: string | null;
  };
  workingHours?: string | null;
  timezone?: string | null;
}

export default function BookingCalendar({ instructor, workingHours, timezone }: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Parse working hours or use default (9am-5pm)
  const defaultHours = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const availableTimes = workingHours 
    ? workingHours.split(',').map(t => t.trim()) 
    : defaultHours;

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    // In a real app, you would send this to your backend
    console.log('Booking session with:', {
      instructorId: instructor.id,
      date: date?.toISOString(),
      time: selectedTime,
      price: instructor.price,
    });
    setBookingConfirmed(true);
  };

  if (bookingConfirmed) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Session Booked!</h4>
        <p className="text-gray-600 mb-4">
          Your session with {instructor.name} is confirmed for {date && format(date, 'MMMM d, yyyy')} at {selectedTime}.
        </p>
        {instructor.zoom_link && (
          <a 
            href={instructor.zoom_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Join Zoom Meeting
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
          disabled={(date) => date < new Date()}
        />
      </div>

      {date && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">
            Available times for {format(date, 'MMMM d, yyyy')}
            {timezone && ` (${timezone})`}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTime && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Session Duration</span>
            <span className="font-medium">1 hour</span>
          </div>
          {instructor.price && (
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Price</span>
              <span className="font-bold text-lg">${instructor.price.toFixed(2)}</span>
            </div>
          )}
          <Button 
            onClick={handleBooking}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Confirm Booking
          </Button>
        </div>
      )}
    </div>
  );
}