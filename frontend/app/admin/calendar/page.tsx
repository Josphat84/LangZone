//app/admin/calendar/page.tsx



// Update the import path to the correct location of AvailabilityCalendar

import AvailabilityCalendar from "@/app/tutors/[slug]/AvailabilityCalendar";


export default function MasterCalendarPage() {
  const masterTutorId = "master-tutor-id"; // Replace with actual master tutor ID
  return (
    <div>
      <h1>Master Calendar</h1>
      <AvailabilityCalendar tutorId={masterTutorId} />
    </div>
  );
}
