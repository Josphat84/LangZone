// app/tutors/[slug]/AvailabilityCalendar.tsx
"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  View,
  Views,
  EventInteractionArgs,
} from "react-big-calendar";
import { 
    parse, 
    format, 
    startOfWeek, 
    getDay, 
    setHours, 
    setMinutes, 
    isAfter,
    differenceInMinutes,
    addDays,
    isWeekend
} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"; 
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label"; 
import { Input } from "@/components/ui/input";   
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast, { Toaster } from "react-hot-toast"; 
import { ArrowRight, Trash2, Clock, Pencil, Repeat2, Globe, Calendar as CalendarIcon, User } from 'lucide-react'; 

// --- Types ---
export type AvailabilityStatus = "available" | "booked" | "pending"; 

type AvailabilityRow = {
  id: string;
  tutor_id: string; 
  start_time: string;
  end_time: string;
  status: AvailabilityStatus;
  comment: string | null;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: AvailabilityStatus; 
  comment: string | null;
  durationMinutes: number; 
};

type ModalState = {
    isOpen: boolean;
    type: 'add' | 'edit' | 'bulk' | 'book'; 
    slot?: SlotInfo;
    event?: CalendarEvent;
};
  
// --- Localizer setup ---
const locales = { "en-US": require("date-fns/locale/en-US") };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// --- Supabase Client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PLACEHOLDER_TUTOR_ID = "00000000-0000-0000-0000-000000000000";
const AVAILABLE_STATUS: AvailabilityStatus = "available";

// ====================================================================
// TIMEZONE UTILITIES
// ====================================================================

const getUserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const formatTimeIn24Hour = (date: Date): string => {
  return format(date, 'HH:mm');
};

const formatDateTimeIn24Hour = (date: Date): string => {
  return format(date, 'PPP HH:mm');
};

// ====================================================================
// useAvailability Hook 
// ====================================================================

const useAvailability = () => { 
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const mapRowToEvent = (row: AvailabilityRow): CalendarEvent => {
      const start = new Date(row.start_time);
      const end = new Date(row.end_time);
      return {
          id: row.id,
          title: row.status === AVAILABLE_STATUS ? "Available" : row.status === "booked" ? "Booked" : "Pending",
          start: start, 
          end: end,
          status: row.status,
          comment: row.comment, 
          durationMinutes: differenceInMinutes(end, start), 
      };
  };

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("availability").select("*").order("start_time", { ascending: true });
    if (error) {
      console.error("Fetch availability failed:", error.message);
      toast.error("Failed to fetch availability.");
      setLoading(false);
      return;
    }
    
    // Filter and validate slots to ensure they're within bounds (00:00 to 23:00)
    const mapped = (data as AvailabilityRow[])
      .map(mapRowToEvent)
      .filter(event => {
        const startHour = event.start.getHours();
        const endHour = event.end.getHours();
        const endMinutes = event.end.getMinutes();
        
        // Only keep events that start before 23:00 and end at or before 23:00
        return startHour < 23 && (endHour < 23 || (endHour === 23 && endMinutes === 0));
      }) ?? [];
      
    setEvents(mapped);
    setLoading(false);
  }, []); 

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    channel = supabase
      .channel(`availability:global`)
      .on("postgres_changes", { event: "*", schema: "public", table: "availability" }, (payload) => {
        const newRow = payload.new as AvailabilityRow | null;
        const oldRow = payload.old as AvailabilityRow | null;

        if (payload.eventType === "INSERT" && newRow) {
          setEvents((prev) => [...prev, mapRowToEvent(newRow)]);
          toast.success("New slot created!");
        } else if (payload.eventType === "UPDATE" && newRow) {
          setEvents((prev) => prev.map((e) => (e.id === newRow.id ? mapRowToEvent(newRow) : e)));
          toast("Slot updated!", { icon: '🔄' });
        } else if (payload.eventType === "DELETE" && oldRow) {
          setEvents((prev) => prev.filter((e) => e.id !== oldRow.id));
          toast.error("A slot was deleted.");
        }
      })
      .subscribe();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []); 

  const addAvailability = async (start: Date, end: Date) => {
    const tempId = `temp-${Date.now()}`;
    const newEvent: CalendarEvent = { 
        id: tempId, 
        title: "Available (Adding...)", 
        start, end, 
        status: AVAILABLE_STATUS, 
        comment: null, 
        durationMinutes: differenceInMinutes(end, start), 
    };

    setEvents((prev) => [...prev, newEvent]);
    toast.loading('Adding new slot...', { id: tempId });

    const insertData = {
        tutor_id: PLACEHOLDER_TUTOR_ID, 
        start_time: start.toISOString(), 
        end_time: end.toISOString(),     
        status: AVAILABLE_STATUS,
        comment: null, 
    };

    const { data, error } = await supabase
      .from("availability")
      .insert(insertData)
      .select()
      .single();

    if (error || !data) {
        setEvents((prev) => prev.filter((e) => e.id !== tempId));
        console.error("Supabase INSERT Error:", JSON.stringify(error, null, 2)); 
        const errorMessage = error?.message || error?.details || 'A database error occurred.';
        toast.error(`Failed to add slot: ${errorMessage}`, { id: tempId });
        return;
    }

    setEvents((prev) => prev.map((e) => (e.id === tempId ? mapRowToEvent(data as AvailabilityRow) : e)));
    toast.success("Availability slot added!", { id: tempId });
  };
  
  const addBulkAvailability = async (slots: { start: Date, end: Date }[], comment: string | null) => {
    if (slots.length === 0) return;

    const toastId = toast.loading(`Adding ${slots.length} recurring slots...`);

    const insertData = slots.map(slot => ({
        tutor_id: PLACEHOLDER_TUTOR_ID, 
        start_time: slot.start.toISOString(), 
        end_time: slot.end.toISOString(),     
        status: AVAILABLE_STATUS,
        comment: comment || null,
    }));

    const { data, error } = await supabase
        .from("availability")
        .insert(insertData)
        .select();

    if (error || !data) {
        console.error("Supabase BULK INSERT Error:", JSON.stringify(error, null, 2)); 
        const errorMessage = error?.message || error?.details || 'A database error occurred.';
        toast.error(`Failed to add bulk slots: ${errorMessage}`, { id: toastId });
        return;
    }

    const newEvents = (data as AvailabilityRow[]).map(mapRowToEvent);
    setEvents(prev => [...prev, ...newEvents]);
    toast.success(`${newEvents.length} availability slots created!`, { id: toastId });
  };

  const deleteAvailability = async (eventId: string) => {
    const deletedEvent = events.find(e => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId)); 

    const { error } = await supabase.from("availability").delete().eq("id", eventId);

    if (error) {
      toast.error("Failed to delete slot.");
      if (deletedEvent) {
        setEvents((prev) => [...prev, deletedEvent]); 
      }
      return;
    }

    toast.success("Availability slot deleted!");
  };
  
  const updateTimeSlot = async (
    event: CalendarEvent, 
    newStart: Date, 
    newEnd: Date, 
    newStatus: AvailabilityStatus | undefined = undefined, 
    newComment: string | null | undefined = undefined
  ) => {
    const originalEvent = events.find(e => e.id === event.id);
    if (!originalEvent) return;

    const isOverlapping = events.some(e => {
        if (e.id === event.id) return false; 
        return newStart < e.end && newEnd > e.start;
    });

    if (isOverlapping) {
        toast.error("Cannot move/resize slot: This creates an overlap.", { id: event.id });
        setEvents(prev => prev.map(e => e.id === event.id ? originalEvent : e)); 
        return;
    }
    
    setEvents(prev => prev.map(e => e.id === event.id ? { 
        ...e, 
        start: newStart, end: newEnd,
        status: newStatus ?? e.status, 
        comment: newComment === undefined ? e.comment : newComment,
        title: (newStatus ?? e.status) === "booked" ? "Booked" : (newStatus ?? e.status) === "available" ? "Available" : "Pending",
        durationMinutes: differenceInMinutes(newEnd, newStart) 
    } : e));
    toast.loading('Saving changes...', { id: event.id });

    const { data: dbData, error: fetchError } = await supabase
        .from("availability")
        .select(`tutor_id`) 
        .eq('id', event.id)
        .single();
    
    if (fetchError || !dbData) {
        toast.error(`Error: Could not retrieve original slot data.`, { id: event.id });
        setEvents(prev => prev.map(e => e.id === event.id ? originalEvent : e));
        return;
    }
    const dbRow = dbData as Pick<AvailabilityRow, 'tutor_id'>;

    const finalComment = newComment === undefined ? originalEvent.comment : (newComment === '' ? null : newComment);
    
    const updatePayload: Partial<AvailabilityRow> = {
        start_time: newStart.toISOString(), 
        end_time: newEnd.toISOString(),     
        status: newStatus ?? originalEvent.status, 
        comment: finalComment, 
        tutor_id: dbRow.tutor_id, 
    };
    
    const { error } = await supabase.from("availability")
        .update(updatePayload)
        .eq("id", event.id);

    if (error) {
        console.error("Supabase UPDATE Error:", error);
        toast.error(`Failed to update slot. Error: ${error.details || error.message}`, { id: event.id });
        setEvents(prev => prev.map(e => e.id === event.id ? originalEvent : e));
        return;
    }
    
    toast.success("Slot updated successfully.", { id: event.id });
  };

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Separate effect for handling payment returns
  useEffect(() => {
    // Check if returning from payment
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking) {
      const bookingData = JSON.parse(pendingBooking);
      
      // Check URL parameters for payment status
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      
      if (paymentStatus === 'success') {
        toast.success('Payment successful! Your booking has been confirmed.', { duration: 5000 });
        
        // Find and update the slot status to booked
        setTimeout(() => {
          const event = events.find(e => e.id === bookingData.eventId);
          if (event) {
            updateTimeSlot(
              event, 
              new Date(bookingData.startTime), 
              new Date(bookingData.endTime), 
              'booked',
              'Booked by student - Payment confirmed'
            );
          }
        }, 500);
      } else if (paymentStatus === 'cancelled') {
        toast.error('Payment cancelled. The slot remains available.', { duration: 4000 });
      }
      
      // Clear the session storage and URL parameters
      sessionStorage.removeItem('pendingBooking');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [events, updateTimeSlot]);

  return {
    events,
    loading,
    addAvailability,
    addBulkAvailability, 
    deleteAvailability,
    updateTimeSlot,
  };
};

// ====================================================================
// Custom Components
// ====================================================================

const EventWrapper: React.FC<{ event: CalendarEvent; onSelect: (event: CalendarEvent) => void; }> = ({ event, onSelect }) => {
    
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        onSelect(event);
    }

    return (
        <div 
            className="group relative h-full w-full cursor-pointer transition-transform hover:scale-105"
            onClick={handleEditClick} 
        >
            <div className="text-xs font-semibold h-full flex flex-col justify-center px-2">
                <div className="flex items-center space-x-1">
                    <span className="truncate">{event.title}</span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 bg-white/20">
                        {event.durationMinutes}m
                    </Badge>
                </div>
                <div className="text-[10px] opacity-90 mt-0.5">
                    {formatTimeIn24Hour(event.start)} - {formatTimeIn24Hour(event.end)}
                </div>
                {event.comment && (
                    <span className="text-[10px] italic opacity-75 overflow-hidden whitespace-nowrap text-ellipsis mt-0.5">
                        {event.comment}
                    </span>
                )}
            </div>
        </div>
    );
};

const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate("PREV");
    const goToNext = () => toolbar.onNavigate("NEXT");
    const goToToday = () => toolbar.onNavigate("TODAY");
    const setView = (view: View) => () => toolbar.onView(view);
    
    const openBulkModal = toolbar.openBulkModal;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 shadow-lg border border-blue-100 dark:border-gray-600">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          <Button onClick={goToToday} variant="outline" size="sm" className="font-medium dark:bg-gray-700 dark:text-gray-100">
            Today
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <Button onClick={goToBack} variant="ghost" size="sm" className="rounded-none border-r">
              ←
            </Button>
            <Button onClick={goToNext} variant="ghost" size="sm" className="rounded-none">
              →
            </Button>
          </div>
          
          <Button 
            onClick={openBulkModal} 
            variant="default" 
            size="sm" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md"
          >
            <Repeat2 size={14} className="mr-1" /> Recurring
          </Button>
        </div>
        
        <div className="text-center mb-3 sm:mb-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {toolbar.label}
          </h2>
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Globe size={12} />
            <span className="font-mono">{getUserTimezone()}</span>
          </div>
        </div>
        
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-inner">
          <Button 
            onClick={setView(Views.MONTH)} 
            variant={toolbar.view === Views.MONTH ? "default" : "ghost"} 
            size="sm"
            className={toolbar.view === Views.MONTH ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Month
          </Button>
          <Button 
            onClick={setView(Views.WEEK)} 
            variant={toolbar.view === Views.WEEK ? "default" : "ghost"} 
            size="sm"
            className={toolbar.view === Views.WEEK ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Week
          </Button>
          <Button 
            onClick={setView(Views.DAY)} 
            variant={toolbar.view === Views.DAY ? "default" : "ghost"} 
            size="sm"
            className={toolbar.view === Views.DAY ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            Day
          </Button>
        </div>
      </div>
    );
};

// ====================================================================
// Main Component
// ====================================================================

export default function AvailabilityCalendar() { 
  const { events, loading, addAvailability, addBulkAvailability, deleteAvailability, updateTimeSlot } = useAvailability(); 
  const [view, setView] = useState<View>(Views.WEEK); 
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: 'add' });
  const [viewMode, setViewMode] = useState<'tutor' | 'student'>('tutor');

  const openBulkModal = useCallback(() => setModalState({ isOpen: true, type: 'bulk' }), []);

  const handleSelectSlot = (slot: SlotInfo) => {
    if (viewMode === 'tutor' && isAfter(new Date(slot.end), new Date(slot.start))) {
      // Validate that the slot is within bounds (00:00 to 23:59)
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      
      // Check if times are within the same day
      if (slotStart.getDate() !== slotEnd.getDate()) {
        toast.error("Cannot create slots that span multiple days. Please select within a single day.");
        return;
      }
      
      setModalState({ isOpen: true, type: 'add', slot });
    }
  };

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (viewMode === 'tutor') {
      setModalState({ isOpen: true, type: 'edit', event });
    } else if (viewMode === 'student') {
      // Student view - only allow booking available slots
      if (event.status === 'available') {
        setModalState({ isOpen: true, type: 'book', event });
      } else {
        toast.error(`This slot is ${event.status}. Only available slots can be booked.`);
      }
    }
  }, [viewMode]);
  
  const handleEventDrop = (data: EventInteractionArgs<CalendarEvent>) => {
    if (viewMode === 'tutor') {
      const { event, start, end } = data;
      
      // Validate that the event stays within the same day
      if (start.getDate() !== end.getDate()) {
        toast.error("Cannot move slots across multiple days.");
        // Revert the event position
        setEvents(prev => prev.map(e => e.id === event.id ? event : e));
        return;
      }
      
      updateTimeSlot(event, start, end);
    }
  };

  const handleEventResize = (data: EventInteractionArgs<CalendarEvent>) => {
    if (viewMode === 'tutor') {
      const { event, start, end } = data;
      
      // Validate that the event stays within the same day
      if (start.getDate() !== end.getDate()) {
        toast.error("Cannot resize slots across multiple days.");
        // Revert the event size
        setEvents(prev => prev.map(e => e.id === event.id ? event : e));
        return;
      }
      
      updateTimeSlot(event, start, end);
    }
  };
  
  const handleModalSubmit = async (
    action: 'save' | 'delete',
    event: CalendarEvent,
    newStatus: AvailabilityStatus, 
    newComment: string,
    newStart: Date,
    newEnd: Date
  ) => {
    if (action === 'delete') {
        await deleteAvailability(event.id);
    } else if (action === 'save') {
        await updateTimeSlot(event, newStart, newEnd, newStatus, newComment);
    }
    setModalState({ isOpen: false, type: 'add' });
  };

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    let bgColor, borderColor, textColor;
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    switch (event.status) {
        case "available":
            bgColor = isDarkMode ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"; 
            borderColor = "#047857"; 
            textColor = isDarkMode ? "#ECFDF5" : "#065f46"; 
            break;
        case "booked":
            bgColor = isDarkMode ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"; 
            borderColor = "#b91c1c"; 
            textColor = isDarkMode ? "#FEE2E2" : "#991b1b";
            break;
        case "pending":
            bgColor = isDarkMode ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"; 
            borderColor = "#d97706"; 
            textColor = isDarkMode ? "#FEF3C7" : "#92400e";
            break;
        default:
            bgColor = isDarkMode ? "#4b5563" : "#f3f4f6";
            borderColor = "#9ca3af";
            textColor = isDarkMode ? "#E5E7EB" : "#374151";
    }

    return {
      style: {
        background: bgColor,
        borderLeft: `5px solid ${borderColor}`,
        color: textColor,
        borderRadius: "8px",
        padding: "4px 8px",
        fontWeight: 600,
        fontSize: '0.75rem',
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
      },
    };
  }, []);

  const components = useMemo(
    () => ({
      eventWrapper: (props: any) => (
        <EventWrapper 
            {...props} 
            onSelect={handleSelectEvent} 
        />
      ),
      toolbar: (props: any) => <CustomToolbar {...props} openBulkModal={openBulkModal} />,
    }),
    [handleSelectEvent, openBulkModal]
  );
  
  const parseTime = useCallback((date: Date, timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return setMinutes(setHours(date, hours), minutes);
  }, []);

  // MODALS
  const EditSlotModal = () => {
    const event = modalState.event!; 
    
    const [status, setStatus] = useState<AvailabilityStatus>(event.status);
    const [comment, setComment] = useState<string>(event.comment || '');
    const [startTimeStr, setStartTimeStr] = useState(formatTimeIn24Hour(event.start));
    const [endTimeStr, setEndTimeStr] = useState(formatTimeIn24Hour(event.end));

    const newStartCandidate = parseTime(event.start, startTimeStr);
    const newEndCandidate = parseTime(event.end, endTimeStr);
    const calculatedDuration = differenceInMinutes(newEndCandidate, newStartCandidate);

    const handleSave = () => {
        if (!isAfter(newEndCandidate, newStartCandidate)) {
            toast.error("End time must be after start time.");
            return;
        }

        handleModalSubmit('save', event, status, comment, newStartCandidate, newEndCandidate);
    };
    
    return (
      <Dialog open={modalState.isOpen && modalState.type === 'edit'} onOpenChange={() => setModalState({ isOpen: false, type: 'add' })}>
        <DialogContent className="sm:max-w-2xl dark:bg-gray-900 border-2 border-blue-100 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <Pencil size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              Edit Availability Slot
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
            
            <div className={`flex items-center space-x-3 text-sm p-4 rounded-xl border-2 ${
              calculatedDuration > 0 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
            }`}>
              <Clock size={20} className="text-blue-500" />
              <div>
                <p className="font-semibold">Duration: {calculatedDuration} minutes</p>
                {calculatedDuration <= 0 && <p className="text-xs mt-1">⚠️ Invalid time range</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold dark:text-gray-200 flex items-center">
                  <CalendarIcon size={14} className="mr-2" />
                  Start Time ({format(event.start, 'MMM dd')})
                </Label>
                <Input 
                  type="time" 
                  value={startTimeStr}
                  onChange={(e) => setStartTimeStr(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold dark:text-gray-200 flex items-center">
                  <CalendarIcon size={14} className="mr-2" />
                  End Time ({format(event.end, 'MMM dd')})
                </Label>
                <Input 
                  type="time" 
                  value={endTimeStr}
                  onChange={(e) => setEndTimeStr(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold dark:text-gray-200">Status</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant={status === 'available' ? 'default' : 'outline'} 
                  onClick={() => setStatus('available')}
                  className={`h-16 ${status === 'available' ? 'bg-green-600 hover:bg-green-700 shadow-lg' : 'dark:bg-gray-700 dark:border-gray-600'}`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs font-semibold">Available</div>
                  </div>
                </Button>
                <Button 
                  variant={status === 'booked' ? 'destructive' : 'outline'} 
                  onClick={() => setStatus('booked')}
                  className={`h-16 ${status === 'booked' ? 'shadow-lg' : 'dark:bg-gray-700 dark:border-gray-600'}`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs font-semibold">Booked</div>
                  </div>
                </Button>
                <Button 
                  variant={status === 'pending' ? 'secondary' : 'outline'} 
                  onClick={() => setStatus('pending')}
                  className={`h-16 ${status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 shadow-lg' : 'dark:bg-gray-700 dark:border-gray-600'}`}
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs font-semibold">Pending</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold dark:text-gray-200">Comments/Notes</Label>
              <Textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add details or notes..."
                className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between p-4 border-t-2 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={() => handleModalSubmit('delete', event, status, comment, new Date(), new Date())}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setModalState({ isOpen: false, type: 'add' })}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                disabled={calculatedDuration <= 0}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  const AddSlotModal = () => {
    const slot = modalState.slot!;
    const durationMinutes = differenceInMinutes(new Date(slot.end), new Date(slot.start));

    return (
        <Dialog open={modalState.isOpen && modalState.type === 'add'} onOpenChange={() => setModalState({ isOpen: false, type: 'add' })}>
            <DialogContent className="sm:max-w-lg dark:bg-gray-900 border-2 border-green-100 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="dark:text-white flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                        <Clock size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      Confirm New Availability Slot
                    </DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Review the details below before adding this availability slot
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-4 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <ArrowRight size={18} className="text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start Time</p>
                          <p className="font-bold text-lg dark:text-white">
                            {formatDateTimeIn24Hour(new Date(slot.start))}
                          </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <ArrowRight size={18} className="text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">End Time</p>
                          <p className="font-bold text-lg dark:text-white">
                            {formatDateTimeIn24Hour(new Date(slot.end))}
                          </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                        <div className="flex items-center space-x-2">
                          <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold dark:text-white">Duration:</span>
                        </div>
                        <Badge className="text-lg px-4 py-1 bg-blue-600">{durationMinutes} minutes</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <Globe size={14} />
                      <span>Timezone: {getUserTimezone()}</span>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setModalState({ isOpen: false, type: 'add' })}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => { 
                        addAvailability(new Date(slot.start), new Date(slot.end)); 
                        setModalState({ isOpen: false, type: 'add' }); 
                      }} 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Add Slot
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  };
  
  const RecurringSlotModal = () => {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('12:00');
    const [durationWeeks, setDurationWeeks] = useState('4');
    const [days, setDays] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 0: false });
    const [comment, setComment] = useState('');

    const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handleDayToggle = (day: number) => {
        setDays(prev => ({ ...prev, [day]: !prev[day as keyof typeof prev] }));
    };

    const selectedDaysCount = Object.values(days).filter(d => d).length;
    const totalSlotsToCreate = selectedDaysCount * parseInt(durationWeeks || '0');

    const handleBulkSubmit = () => {
        const start = parseTime(new Date(), startTime);
        const end = parseTime(new Date(), endTime);
        const weeks = parseInt(durationWeeks);
        
        if (!isAfter(end, start)) {
            toast.error("End time must be after start time.", { id: 'time-error' });
            return;
        }
        if (Object.values(days).every(d => d === false)) {
            toast.error("Please select at least one day of the week.");
            return;
        }

        const newSlots: { start: Date, end: Date }[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        for (let i = 0; i < weeks * 7; i++) {
            const currentDate = addDays(today, i);
            const currentDay = getDay(currentDate);

            if (days[currentDay as keyof typeof days]) {
                const slotStart = parseTime(currentDate, startTime);
                const slotEnd = parseTime(currentDate, endTime);
                newSlots.push({ start: slotStart, end: slotEnd });
            }
        }

        if (newSlots.length > 0) {
            addBulkAvailability(newSlots, comment);
            setModalState({ isOpen: false, type: 'add' });
        } else {
             toast.error("No slots generated. Check your duration and selected days.");
        }
    };
    
    return (
        <Dialog open={modalState.isOpen && modalState.type === 'bulk'} onOpenChange={() => setModalState({ isOpen: false, type: 'add' })}>
            <DialogContent className="sm:max-w-3xl dark:bg-gray-900 border-2 border-purple-100 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold dark:text-white flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                        <Repeat2 size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      Create Recurring Availability
                    </DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Set up multiple availability slots at once with a recurring schedule
                    </DialogDescription>
                </DialogHeader>
                
                <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="font-semibold dark:text-gray-200">Start Time (24h)</Label>
                            <Input 
                              type="time" 
                              value={startTime} 
                              onChange={(e) => setStartTime(e.target.value)} 
                              className="dark:bg-gray-700 dark:text-white text-lg font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold dark:text-gray-200">End Time (24h)</Label>
                            <Input 
                              type="time" 
                              value={endTime} 
                              onChange={(e) => setEndTime(e.target.value)} 
                              className="dark:bg-gray-700 dark:text-white text-lg font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold dark:text-gray-200">Duration</Label>
                            <Select value={durationWeeks} onValueChange={setDurationWeeks}>
                                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                                    <SelectValue placeholder="Select weeks" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:text-white">
                                    {[1, 2, 4, 8, 12, 24].map(w => (
                                        <SelectItem key={w} value={String(w)}>{w} Week{w > 1 ? 's' : ''}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <Label className="font-semibold dark:text-gray-200">Select Days to Repeat</Label>
                        <div className="grid grid-cols-7 gap-2">
                            {WEEK_DAYS.map((day, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <Label className="text-xs mb-2 font-semibold text-gray-600 dark:text-gray-400">{day}</Label>
                                    <button 
                                        onClick={() => handleDayToggle(index)} 
                                        className={`w-full h-16 flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                                            days[index as keyof typeof days]
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-700 text-white shadow-lg scale-105'
                                            : (isWeekend(new Date(2025, 0, index + 5))) 
                                                ? 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500'
                                                : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        <span className="font-bold text-2xl">{day.substring(0, 1)}</span>
                                        {days[index as keyof typeof days] && (
                                          <span className="text-xs mt-1">✓</span>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold dark:text-gray-200">Optional Notes</Label>
                        <Textarea 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="e.g., 'Only for advanced students' or 'Morning sessions only'"
                            className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                      <span className="font-semibold dark:text-white">Total slots to create:</span>
                      <Badge className="text-xl px-4 py-2 bg-purple-600">{totalSlotsToCreate}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <Globe size={14} />
                      <span>All times will be created in your timezone: <span className="font-mono font-semibold">{getUserTimezone()}</span></span>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setModalState({ isOpen: false, type: 'add' })}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleBulkSubmit} 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      disabled={totalSlotsToCreate === 0}
                    >
                      Generate {totalSlotsToCreate} Slots
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  };

  // Student Booking Modal
  const BookingModal = () => {
    const event = modalState.event!;
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const durationMinutes = event.durationMinutes;
    const pricePerHour = 25; // You can make this dynamic based on tutor
    const totalPrice = ((durationMinutes / 60) * pricePerHour).toFixed(2);

    const handleBooking = () => {
      // Store booking details in sessionStorage
      const bookingDetails = {
        eventId: event.id,
        startTime: event.start.toISOString(),
        endTime: event.end.toISOString(),
        duration: durationMinutes,
        price: totalPrice,
        returnUrl: window.location.href
      };
      
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingDetails));
      
      // Close booking modal and open payment modal
      setShowPaymentModal(true);
    };

    return (
      <>
        <Dialog open={modalState.isOpen && modalState.type === 'book' && !showPaymentModal} onOpenChange={() => setModalState({ isOpen: false, type: 'add' })}>
          <DialogContent className="sm:max-w-lg dark:bg-gray-900 border-2 border-blue-100 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold dark:text-white flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <CalendarIcon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                Book This Session
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Review session details and proceed to payment
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Clock size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Session Time</p>
                    <p className="font-bold text-lg dark:text-white">
                      {formatDateTimeIn24Hour(event.start)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      to {formatTimeIn24Hour(event.end)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock size={18} className="text-blue-500" />
                    <span className="font-semibold dark:text-white">Duration:</span>
                  </div>
                  <Badge className="text-base px-3 py-1 bg-blue-600">{durationMinutes} minutes</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💰</span>
                    <span className="font-semibold dark:text-white">Rate:</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">${pricePerHour}/hour</span>
                </div>

                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border-2 border-green-200 dark:border-green-700">
                  <span className="font-bold text-lg dark:text-white">Total Amount:</span>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">${totalPrice}</span>
                </div>

                {event.comment && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300 font-semibold mb-1">Tutor Note:</p>
                    <p className="text-sm text-yellow-900 dark:text-yellow-200">{event.comment}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Globe size={14} />
                  <span>Time shown in your timezone: <span className="font-mono font-semibold">{getUserTimezone()}</span></span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setModalState({ isOpen: false, type: 'add' })}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBooking} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isProcessing}
              >
                Proceed to Payment →
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setModalState({ isOpen: false, type: 'add' });
          }}
          amount={totalPrice}
          bookingDetails={{
            eventId: event.id,
            startTime: event.start,
            endTime: event.end,
            duration: durationMinutes
          }}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            setModalState({ isOpen: false, type: 'add' });
            // Update slot to booked
            updateTimeSlot(event, event.start, event.end, 'booked', 'Booked by student - Payment confirmed');
            toast.success('Payment successful! Your session has been booked.', { duration: 5000 });
          }}
        />
      </>
    );
  };

  // Payment Modal Component
  const PaymentModal = ({ isOpen, onClose, amount, bookingDetails, onPaymentSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    amount: string;
    bookingDetails: any;
    onPaymentSuccess: () => void;
  }) => {
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
      { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Amex' },
      { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Pay with PayPal account' },
      { id: 'googlepay', name: 'Google Pay', icon: '🔵', description: 'Quick checkout' },
      { id: 'wise', name: 'Wise', icon: '🌐', description: 'International payments' },
    ];

    const formatCardNumber = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      const groups = numbers.match(/.{1,4}/g);
      return groups ? groups.join(' ') : numbers;
    };

    const formatExpiryDate = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length >= 2) {
        return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
      }
      return numbers;
    };

    const handlePayment = async () => {
      if (!selectedMethod) {
        toast.error('Please select a payment method');
        return;
      }

      if (selectedMethod === 'card') {
        if (!cardNumber || !cardName || !expiryDate || !cvv) {
          toast.error('Please fill in all card details');
          return;
        }
        if (cardNumber.replace(/\s/g, '').length !== 16) {
          toast.error('Invalid card number');
          return;
        }
        if (cvv.length !== 3) {
          toast.error('Invalid CVV');
          return;
        }
      }

      setIsProcessing(true);

      // Simulate payment processing
      toast.loading('Processing payment...', { id: 'payment-processing' });

      // Simulate API call delay
      setTimeout(() => {
        // Simulate success (in production, handle actual payment API response)
        const success = Math.random() > 0.1; // 90% success rate for demo

        if (success) {
          toast.success('Payment successful!', { id: 'payment-processing' });
          sessionStorage.removeItem('pendingBooking');
          onPaymentSuccess();
        } else {
          toast.error('Payment failed. Please try again.', { id: 'payment-processing' });
          setIsProcessing(false);
        }
      }, 2500);
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl dark:bg-gray-900 border-2 border-green-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <span className="text-2xl">💳</span>
              </div>
              Complete Payment
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Choose your preferred payment method and complete the transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
            
            {/* Amount Summary */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Amount to pay:</span>
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">${amount}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Session: {formatDateTimeIn24Hour(bookingDetails.startTime)} ({bookingDetails.duration} min)
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold dark:text-white">Select Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedMethod === method.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg scale-105'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{method.icon}</span>
                      <div>
                        <div className="font-semibold dark:text-white">{method.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Payment Form */}
            {selectedMethod === 'card' && (
              <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg dark:text-white mb-4">Card Details</h3>
                
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">Card Number</Label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="text-lg font-mono dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-gray-200">Cardholder Name</Label>
                  <Input
                    type="text"
                    placeholder="JOHN DOE"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="dark:text-gray-200">Expiry Date</Label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      className="font-mono dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-gray-200">CVV</Label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                      className="font-mono dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs text-blue-800 dark:text-blue-300">Your payment information is encrypted and secure</span>
                </div>
              </div>
            )}

            {/* Other Payment Methods Info */}
            {selectedMethod && selectedMethod !== 'card' && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center space-y-4">
                  <div className="text-6xl">{paymentMethods.find(m => m.id === selectedMethod)?.icon}</div>
                  <h3 className="font-semibold text-lg dark:text-white">
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You will be redirected to complete your payment securely with {paymentMethods.find(m => m.id === selectedMethod)?.name}.
                  </p>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      💡 <strong>Demo Mode:</strong> This is a demonstration. In production, you'll be redirected to the actual payment provider.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between p-4 border-t-2 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Pay ${amount}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Main Render
  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <Toaster position="top-right" />
      
      <Card className="shadow-2xl border-none bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-3xl transition-colors">
        <CardHeader className="space-y-4 border-b-2 dark:border-gray-700 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tutor Availability Calendar
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Manage and view tutoring sessions across timezones
              </p>
            </div>
            {loading && (
              <Badge variant="outline" className="animate-pulse border-blue-500 text-blue-600 dark:text-blue-400">
                <Clock size={14} className="mr-1" />
                Loading...
              </Badge>
            )}
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'tutor' | 'student')} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="tutor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <User size={16} className="mr-2" />
                Tutor View
              </TabsTrigger>
              <TabsTrigger value="student" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <Globe size={16} className="mr-2" />
                Student View
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {viewMode === 'student' && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-300 flex items-center">
                <Globe size={16} className="mr-2" />
                <span className="font-semibold">Student Mode:</span>
                <span className="ml-2">All times displayed in your local timezone ({getUserTimezone()}). Click on available slots to book!</span>
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-semibold">Available</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="font-semibold">Booked</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold">Pending</span>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-gray-200 shadow-2xl p-6 bg-white dark:bg-gray-900 dark:border-gray-700 transition-all duration-300">
            <div style={{ height: 800 }} className="dark-calendar-override"> 
              <Calendar
                localizer={localizer} 
                events={events} 
                startAccessor="start" 
                endAccessor="end" 
                view={view} 
                onView={setView}
                selectable={viewMode === 'tutor'}
                resizable={viewMode === 'tutor'}
                draggableAccessor={() => viewMode === 'tutor'}
                onEventDrop={handleEventDrop} 
                onEventResize={handleEventResize} 
                onSelectSlot={handleSelectSlot} 
                step={30} 
                timeslots={2} 
                popup={false} 
                components={components} 
                eventPropGetter={eventStyleGetter} 
                tooltipAccessor={null}
                dayLayoutAlgorithm="no-overlap" 
                min={new Date(1970, 0, 1, 0, 0, 0)} 
                max={new Date(1970, 0, 1, 23, 0, 0)} 
                formats={{
                  timeGutterFormat: 'HH:mm',
                  eventTimeRangeFormat: ({ start, end }) => 
                    `${formatTimeIn24Hour(start)} - ${formatTimeIn24Hour(end)}`,
                  agendaTimeRangeFormat: ({ start, end }) => 
                    `${formatTimeIn24Hour(start)} - ${formatTimeIn24Hour(end)}`,
                }}
              />
            </div>
          </div>
          
        </CardContent>
        
        {modalState.type === 'add' && modalState.slot && <AddSlotModal />}
        {modalState.type === 'edit' && modalState.event && <EditSlotModal />}
        {modalState.type === 'bulk' && <RecurringSlotModal />}
        {modalState.type === 'book' && modalState.event && <BookingModal />}
      </Card>

      <style jsx global>{`
        .rbc-time-slot {
          min-height: 40px;
        }
        .rbc-timeslot-group {
          min-height: 80px;
        }
        .rbc-time-header-content {
          border-left: 2px solid #e5e7eb;
        }
        .dark .rbc-time-header-content {
          border-left: 2px solid #374151;
        }
        .rbc-current-time-indicator {
          background-color: #ef4444;
          height: 2px;
        }
        .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .rbc-today {
          background-color: #dbeafe;
        }
        .dark .rbc-today {
          background-color: #1e3a8a;
        }
        .rbc-time-content {
          border-top: 2px solid #e5e7eb;
        }
        .dark .rbc-time-content {
          border-top: 2px solid #374151;
        }
      `}</style>
    </div>
  );
}