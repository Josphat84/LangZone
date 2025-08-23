// students/[slug]/StudentBookingCalendar.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  View,
  Event as RBCEvent,
} from "react-big-calendar";
import { parse, format, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

type AvailabilityRow = {
  id: string;
  tutor_id: string;
  start_time: string; // ISO
  end_time: string;   // ISO
  status: "available" | "booked";
};

type CalendarEvent = RBCEvent & {
  id: string;
  start: Date;
  end: Date;
  title: string;
};

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StudentBookingCalendar({
  tutorId,
  studentId,
}: {
  tutorId: string;
  studentId: string;
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>(Views.WEEK);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("tutor_id", tutorId)
      .eq("status", "available")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Fetch availability failed:", error.message);
      setLoading(false);
      return;
    }

    const mapped: CalendarEvent[] =
      (data as AvailabilityRow[]).map((row) => ({
        id: row.id,
        title: "Available",
        start: new Date(row.start_time),
        end: new Date(row.end_time),
        allDay: false,
      })) ?? [];

    setEvents(mapped);
    setLoading(false);
  }, [tutorId]);

  // Initial load
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Realtime: listen only for this tutor's availability changes
  useEffect(() => {
    const channel = supabase
      .channel("availability-student-" + tutorId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "availability",
          filter: `tutor_id=eq.${tutorId}`,
        },
        () => {
          // Any insert/update/delete for this tutor → refresh
          fetchAvailability();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tutorId, fetchAvailability]);

  // Concurrency-safe booking:
  // 1) UPDATE availability SET status='booked' WHERE id = ? AND status='available' (returns 1 row if we won the race)
  // 2) If success, INSERT into bookings
  // 3) If insert fails, revert availability back to 'available'
  const handleSelectEvent = async (event: CalendarEvent) => {
    const confirm = window.confirm(
      `Book this slot?\n${event.start.toLocaleString()} - ${event.end.toLocaleString()}`
    );
    if (!confirm) return;

    // Step 1: try to claim the slot
    const { data: updated, error: updateErr } = await supabase
      .from("availability")
      .update({ status: "booked" })
      .eq("id", event.id)
      .eq("status", "available")
      .select()
      .single();

    if (updateErr || !updated) {
      // Either already booked by someone else or update failed
      alert("Sorry, that slot was just taken. Please pick another one.");
      await fetchAvailability();
      return;
    }

    // Step 2: write booking record
    const { error: insertErr } = await supabase.from("bookings").insert({
      student_id: studentId,
      tutor_id: tutorId,
      availability_id: event.id,
      status: "confirmed",
    });

    if (insertErr) {
      console.error("Booking insert failed:", insertErr.message);
      // Step 3: revert the slot so it becomes available again
      await supabase
        .from("availability")
        .update({ status: "available" })
        .eq("id", event.id)
        .eq("status", "booked");
      alert("We couldn’t complete the booking. Please try again.");
      await fetchAvailability();
      return;
    }

    alert("Booking confirmed! 🎉");
    // Optimistic update: remove the slot locally
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const components = useMemo(
    () => ({
      event: ({ title }: { title: string }) => (
        <div className="font-semibold text-green-600">{title}</div>
      ),
    }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Book a Slot</h3>
        {loading && (
          <span className="text-sm text-gray-500 animate-pulse">Loading…</span>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <div style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.WEEK}
            view={view}
            onView={setView}
            selectable={false}          // read-only for students
            onSelectEvent={handleSelectEvent}
            step={30}
            timeslots={2}
            popup
            components={components}
            tooltipAccessor={null}
            messages={{
              today: "Today",
              previous: "Back",
              next: "Next",
            }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Click on an <span className="font-semibold text-green-700">Available</span> slot to book.
      </p>
    </div>
  );
}
