//tutor availability calendar
//tutors/[slug]/AvailabilityCalendar.tsx

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  View,
  Views,
} from "react-big-calendar";
import { parse, format, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

type AvailabilityRow = {
  id: string;
  tutor_id: string;
  start_time: string; // ISO
  end_time: string;   // ISO
  status: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
  getDay,
  locales,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AvailabilityCalendar({
  tutorId,
}: {
  tutorId: string;
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
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Fetch availability failed:", error.message);
      setLoading(false);
      return;
    }

    const mapped =
      (data as AvailabilityRow[]).map((row) => ({
        id: row.id,
        title: "Available",
        start: new Date(row.start_time),
        end: new Date(row.end_time),
      })) ?? [];

    setEvents(mapped);
    setLoading(false);
  }, [tutorId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Add a new slot (drag-select on the calendar)
  const handleSelectSlot = async (slot: SlotInfo) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);

    // Example: minimum 30 minutes
    if (end.getTime() <= start.getTime()) return;

    const { data, error } = await supabase
      .from("availability")
      .insert({
        tutor_id: tutorId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: "available",
      })
      .select()
      .single();

    if (error) {
      console.error("Insert failed:", error.message);
      return;
    }

    setEvents((prev) => [
      ...prev,
      {
        id: data.id,
        title: "Available",
        start,
        end,
      },
    ]);
  };

  // Delete an availability by clicking it
  const handleSelectEvent = async (event: CalendarEvent) => {
    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("id", event.id);

    if (error) {
      console.error("Delete failed:", error.message);
      return;
    }

    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const components = useMemo(
    () => ({
      event: ({ title }: { title: string }) => (
        <div className="font-semibold">{title}</div>
      ),
    }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Tutor Availability</h3>
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
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            step={30}            // 30-minute grid
            timeslots={2}        // 1 hour = 2 slots
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
        Tip: drag on the calendar to add availability. Click an availability to
        remove it.
      </p>
    </div>
  );
}
