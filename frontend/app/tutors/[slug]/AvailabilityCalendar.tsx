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

// NOTE: Assuming Shadcn components are correctly aliased and imported
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; 
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label"; 
import { Input } from "@/components/ui/input";   
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import toast, { Toaster } from "react-hot-toast"; 
import { ArrowRight, Trash2, Clock, Pencil, Repeat2 } from 'lucide-react'; 

// --- Types ---
export type AvailabilityStatus = "available" | "booked" | "pending"; 

type AvailabilityRow = {
  id: string;
  tutor_id: string; 
  start_time: string; // UTC ISO string
  end_time: string;   // UTC ISO string
  status: AvailabilityStatus;
  comment: string | null;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date; // Localized Date object
  end: Date;   // Localized Date object
  status: AvailabilityStatus; 
  comment: string | null;
  durationMinutes: number; 
};

type ModalState = {
    isOpen: boolean;
    type: 'add' | 'edit' | 'bulk'; 
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

// ====================================================================
// SECTION 1: useAvailability Hook 
// ====================================================================

const PLACEHOLDER_TUTOR_ID = "00000000-0000-0000-0000-000000000000";
const AVAILABLE_STATUS: AvailabilityStatus = "available";

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
    const mapped = (data as AvailabilityRow[]).map(mapRowToEvent) ?? [];
    setEvents(mapped);
    setLoading(false);
  }, []); 

  // Real-time Subscription (Kept for completeness)
  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    channel = supabase
      .channel(`availability:global`)
      .on("postgres_changes", { event: "*", schema: "public", table: "availability" }, (payload) => {
        const newRow = payload.new as AvailabilityRow | null;
        const oldRow = payload.old as AvailabilityRow | null;

        if (payload.eventType === "INSERT" && newRow) {
          setEvents((prev) => [...prev, mapRowToEvent(newRow)]);
          toast.success("New slot created by another device!");
        } else if (payload.eventType === "UPDATE" && newRow) {
          setEvents((prev) => prev.map((e) => (e.id === newRow.id ? mapRowToEvent(newRow) : e)));
          toast("Slot status updated!", { icon: '🔄' });
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

  // Single Slot Add
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
        const errorMessage = error?.message || error?.details || 'A database error occurred. Check console for details.';
        toast.error(`Failed to add slot: ${errorMessage}`, { id: tempId });
        return;
    }

    setEvents((prev) => prev.map((e) => (e.id === tempId ? mapRowToEvent(data as AvailabilityRow) : e)));
    toast.success("Availability slot added!", { id: tempId });
  };
  
  // Bulk Slot Addition
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
        const errorMessage = error?.message || error?.details || 'A database error occurred. Check console for details.';
        toast.error(`Failed to add bulk slots: ${errorMessage}`, { id: toastId });
        return;
    }

    const newEvents = (data as AvailabilityRow[]).map(mapRowToEvent);
    setEvents(prev => [...prev, ...newEvents]);
    toast.success(`${newEvents.length} availability slots created!`, { id: toastId });
  };


  // Delete Availability
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
  
  // Update function (includes overlap check)
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
        toast.error("Cannot move/resize slot: This creates an overlap with an existing slot.", { id: event.id });
        setEvents(prev => prev.map(e => e.id === event.id ? originalEvent : e)); 
        return;
    }
    
    // Optimistic Update
    setEvents(prev => prev.map(e => e.id === event.id ? { 
        ...e, 
        start: newStart, end: newEnd,
        status: newStatus ?? e.status, 
        comment: newComment === undefined ? e.comment : newComment,
        title: (newStatus ?? e.status) === "booked" ? "Booked" : (newStatus ?? e.status) === "available" ? "Available" : "Pending",
        durationMinutes: differenceInMinutes(newEnd, newStart) 
    } : e));
    toast.loading('Saving changes...', { id: event.id });

    // Fetch tutor_id for update payload safety
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
// SECTION 2: Custom Components (Streamlined for Tutor Focus)
// ====================================================================

// EVENT WRAPPER: Now only handles the click to open the Edit Modal.
const EventWrapper: React.FC<{ event: CalendarEvent; onSelect: (event: CalendarEvent) => void; }> = ({ event, onSelect }) => {
    
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        onSelect(event); // <-- This is the only action on click
    }

    return (
        <div 
            className="group relative h-full w-full cursor-pointer"
            onClick={handleEditClick} 
        >
            <div className="text-xs font-medium h-full flex flex-col justify-center px-1">
                <div className="flex items-center space-x-1">
                    <span className="truncate">{event.title}</span>
                    <span className="text-gray-600 dark:text-gray-400 font-normal">
                        ({event.durationMinutes} min) 
                    </span>
                </div>
                {event.comment && <span className="text-xs italic opacity-80 overflow-hidden whitespace-nowrap text-ellipsis">{event.comment}</span>}
            </div>
        </div>
    );
};

// Custom Toolbar (with Bulk Add Button)
const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate("PREV");
    const goToNext = () => toolbar.onNavigate("NEXT");
    const goToToday = () => toolbar.onNavigate("TODAY");
    const setView = (view: View) => () => toolbar.onView(view);
    
    const openBulkModal = toolbar.openBulkModal;

    return (
      <div className="flex justify-between items-center mb-4 p-3 rounded-lg bg-gray-50 shadow-inner dark:bg-gray-800 dark:border-gray-700 transition-colors border">
        <div className="flex space-x-2">
          <Button onClick={goToToday} variant="outline" size="sm" className="text-xs dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">Today</Button>
          <Button onClick={goToBack} variant="outline" size="sm" className="text-xs dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">←</Button>
          <Button onClick={goToNext} variant="outline" size="sm" className="text-xs dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">→</Button>
          
          <Button 
            onClick={openBulkModal} 
            variant="default" 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-xs"
          >
            <Repeat2 size={14} className="mr-1" /> Add Recurring
          </Button>
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-wide">
            {toolbar.label}
            {/* TIMEZONE CLARIFICATION */}
            <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400 font-mono">
                ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </span> 
        </h2>
        <div className="flex space-x-1">
          <Button onClick={setView(Views.MONTH)} variant={toolbar.view === Views.MONTH ? "default" : "outline"} size="sm">Month</Button>
          <Button onClick={setView(Views.WEEK)} variant={toolbar.view === Views.WEEK ? "default" : "outline"} size="sm">Week</Button>
          <Button onClick={setView(Views.DAY)} variant={toolbar.view === Views.DAY ? "default" : "outline"} size="sm">Day</Button>
        </div>
      </div>
    );
  };
  

// ====================================================================
// SECTION 3: AvailabilityCalendar Component (Main Render)
// ====================================================================

export default function AvailabilityCalendar() { 
  const { events, loading, addAvailability, addBulkAvailability, deleteAvailability, updateTimeSlot } = useAvailability(); 
  const [view, setView] = useState<View>(Views.WEEK); 
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: 'add' });

  const openBulkModal = useCallback(() => setModalState({ isOpen: true, type: 'bulk' }), []);

  // --- Modal Handlers ---
  const handleSelectSlot = (slot: SlotInfo) => {
    if (isAfter(new Date(slot.end), new Date(slot.start))) {
      setModalState({ isOpen: true, type: 'add', slot });
    }
  };

  // Called when a user clicks on an existing event
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setModalState({ isOpen: true, type: 'edit', event });
  }, []);
  
  // Drag/Resize Handlers (No change)
  const handleEventDrop = (data: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = data;
    updateTimeSlot(event, start, end);
  };

  const handleEventResize = (data: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = data;
    updateTimeSlot(event, start, end);
  };
  
  // Generic Submit Handler for single slot edit/delete (No change)
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

  // --- Event Styling and Components ---
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    let bgColor, borderColor, textColor;
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    switch (event.status) {
        case "available":
            bgColor = isDarkMode ? "#10b981" : "#dcfce7"; 
            borderColor = "#047857"; 
            textColor = isDarkMode ? "#ECFDF5" : "#047857"; 
            break;
        case "booked":
            bgColor = isDarkMode ? "#ef4444" : "#fee2e2"; 
            borderColor = "#b91c1c"; 
            textColor = isDarkMode ? "#FEE2E2" : "#b91c1c";
            break;
        case "pending":
            bgColor = isDarkMode ? "#facc15" : "#fffbeb"; 
            borderColor = "#a16207"; 
            textColor = isDarkMode ? "#FFFBEB" : "#a16207";
            break;
        default:
            bgColor = isDarkMode ? "#4b5563" : "#f3f4f6";
            borderColor = "#9ca3af";
            textColor = isDarkMode ? "#E5E7EB" : "#374151";
    }

    return {
      style: {
        backgroundColor: bgColor,
        borderLeft: `4px solid ${borderColor}`,
        color: textColor,
        borderRadius: "4px",
        padding: "2px 4px",
        fontWeight: 600,
        fontSize: '0.8rem',
        boxShadow: event.status === "pending" ? "0 0 5px rgba(250, 204, 21, 0.6)" : 'none', 
      },
    };
  }, []);

  const components = useMemo(
    () => ({
      // Passes the onSelect handler directly to the wrapper
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
  
  // Helper for time parsing in modals
  const parseTime = useCallback((date: Date, timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return setMinutes(setHours(date, hours), minutes);
  }, []);


  // Modal for editing an existing slot
  const EditSlotModal = () => {
    // We can rely on modalState.event existing because we only open this modal when it's present
    const event = modalState.event!; 
    
    const [status, setStatus] = useState<AvailabilityStatus>(event.status);
    const [comment, setComment] = useState<string>(event.comment || '');
    const [startTimeStr, setStartTimeStr] = useState(format(event.start, 'HH:mm'));
    const [endTimeStr, setEndTimeStr] = useState(format(event.end, 'HH:mm'));

    // Recalculate duration whenever time strings change
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
        <DialogContent className="sm:max-w-lg dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white flex items-center"><Pencil size={20} className="mr-2 text-blue-500" /> Edit Availability Slot</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-6">
            
             <div className={`flex items-center space-x-2 text-sm p-2 rounded-lg 
                             ${calculatedDuration > 0 ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                <Clock size={18} className="text-blue-500" />
                <p>Calculated Duration: <span className="font-bold">{calculatedDuration} minutes</span></p>
                {calculatedDuration <= 0 && <span className="ml-4 font-bold">⚠️ Error: Invalid time range</span>}
            </div>
            
            {/* Time Editor */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="startTime" className="font-semibold dark:text-gray-300">Start Time ({format(event.start, 'MMM dd')})</Label>
                    <Input 
                        id="startTime" type="time" value={startTimeStr}
                        onChange={(e) => setStartTimeStr(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="endTime" className="font-semibold dark:text-gray-300">End Time ({format(event.end, 'MMM dd')})</Label>
                    <Input 
                        id="endTime" type="time" value={endTimeStr}
                        onChange={(e) => setEndTimeStr(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>

            {/* Status Selector */}
            <div className="flex flex-col space-y-3">
                <Label className="font-semibold dark:text-gray-300">Status</Label>
                <div className="flex space-x-2">
                    <Button 
                        variant={status === 'available' ? 'default' : 'outline'} 
                        onClick={() => setStatus('available')}
                        className={`flex-1 ${status === 'available' ? 'bg-green-600 hover:bg-green-700' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >✅ Available</Button>
                    <Button 
                        variant={status === 'booked' ? 'destructive' : 'outline'} 
                        onClick={() => setStatus('booked')}
                        className={`flex-1 ${status === 'booked' ? 'bg-red-600 hover:bg-red-700' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >🚫 Booked</Button>
                    <Button 
                        variant={status === 'pending' ? 'secondary' : 'outline'} 
                        onClick={() => setStatus('pending')}
                        className={`flex-1 ${status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >⏳ Pending</Button>
                </div>
            </div>

            {/* Comment Editor */}
            <div className="flex flex-col space-y-2">
                <Label className="font-semibold dark:text-gray-300">Comments/Notes</Label>
                <Textarea 
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="Add details or notes..."
                    className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
          </div>

          <DialogFooter className="flex justify-between p-4 border-t dark:border-gray-700">
            {/* Delete button is here for centralized action */}
            <Button 
                variant="outline" onClick={() => handleModalSubmit('delete', event, status, comment, new Date(), new Date())}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-red-400"
            ><Trash2 size={16} className="mr-2" /> Delete Slot</Button>
            <div>
                <Button variant="outline" className="mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600" onClick={() => setModalState({ isOpen: false, type: 'add' })}>Cancel</Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={calculatedDuration <= 0}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Modal for adding a single slot (unchanged logic)
  const AddSlotModal = () => {
    const slot = modalState.slot!;
    const durationMinutes = differenceInMinutes(new Date(slot.end), new Date(slot.start));

    return (
        <Dialog open={modalState.isOpen && modalState.type === 'add'} onOpenChange={() => setModalState({ isOpen: false, type: 'add' })}>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle className="dark:text-white">Confirm New Availability Slot</DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-3 dark:text-gray-300 border-t dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <ArrowRight size={16} className="text-blue-500" />
                        <p className="text-sm font-medium">
                            **Start:** {format(new Date(slot.start), 'PPP p')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ArrowRight size={16} className="text-blue-500" />
                        <p className="text-sm font-medium">
                            **End:** {format(new Date(slot.end), 'PPP p')}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={16} />
                        <p>Duration: <span className="font-semibold">{durationMinutes} minutes</span></p>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setModalState({ isOpen: false, type: 'add' })}>Cancel</Button>
                    <Button onClick={() => { addAvailability(new Date(slot.start), new Date(slot.end)); setModalState({ isOpen: false, type: 'add' }); }} >Add Slot</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  };
  
  // Modal for Recurring Slots (unchanged logic)
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
            <DialogContent className="sm:max-w-xl dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold dark:text-white flex items-center"><Repeat2 size={20} className="mr-2 text-purple-500" /> Create Recurring Availability</DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time (Daily)</Label>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label>End Time (Daily)</Label>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label>For # of Weeks</Label>
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
                        <Label className="font-semibold dark:text-gray-300">Days to Repeat</Label>
                        <div className="flex justify-between space-x-1">
                            {WEEK_DAYS.map((day, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <Label className="text-xs mb-1 font-medium text-gray-500 dark:text-gray-400">{day}</Label>
                                    <div 
                                        onClick={() => handleDayToggle(index)} 
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg border cursor-pointer transition-all ${
                                            days[index as keyof typeof days]
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                            : (isWeekend(new Date(2025, 0, index + 5))) 
                                                ? 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
                                                : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="font-bold text-sm">{day.substring(0, 1)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label className="font-semibold dark:text-gray-300">Optional Comments/Notes</Label>
                        <Textarea 
                            value={comment} onChange={(e) => setComment(e.target.value)}
                            placeholder="e.g., 'Only for advanced students'"
                            className="min-h-[50px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 border-t pt-4">
                        *This will create {Object.values(days).filter(d => d).length * parseInt(durationWeeks || '0')} new slots starting today in your **{Intl.DateTimeFormat().resolvedOptions().timeZone}** timezone.
                    </p>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setModalState({ isOpen: false, type: 'add' })}>Cancel</Button>
                    <Button onClick={handleBulkSubmit} className="bg-purple-600 hover:bg-purple-700">Generate and Add Slots</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  };


  // --- Render ---
  return (
    <Card className="shadow-2xl border-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-2xl transition-colors min-w-[700px]">
        <Toaster /> 
      
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b dark:border-gray-700 pb-4">
            <CardTitle className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">Tutor Availability Calendar</CardTitle>
            {loading && <span className="text-sm text-blue-500 dark:text-blue-300 animate-pulse font-medium">Loading All Slots...</span>}
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
            <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full shadow-md"></div>
                    <span className="font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full shadow-md"></div>
                    <span className="font-medium">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full shadow-md"></div>
                    <span className="font-medium">Pending</span>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 shadow-xl p-4 bg-white dark:bg-gray-900 dark:border-gray-700 transition-all duration-300">
                <div style={{ height: 750 }} className="dark-calendar-override"> 
                    <Calendar
                        localizer={localizer} events={events} startAccessor="start" endAccessor="end" view={view} onView={setView}
                        selectable resizable draggableAccessor={() => true}
                        onEventDrop={handleEventDrop} onEventResize={handleEventResize} 
                        onSelectSlot={handleSelectSlot} 
                        step={30} timeslots={2} popup={false} 
                        components={components} eventPropGetter={eventStyleGetter} tooltipAccessor={null}
                        dayLayoutAlgorithm="no-overlap" 
                        min={new Date(1970, 0, 1, 6, 0, 0)} max={new Date(1970, 0, 1, 23, 0, 0)} 
                    />
                </div>
            </div>
            
        </CardContent>
        
        {modalState.type === 'add' && modalState.slot && <AddSlotModal />}
        {modalState.type === 'edit' && modalState.event && <EditSlotModal />}
        {modalState.type === 'bulk' && <RecurringSlotModal />}
    </Card>
  );
}