// app/instructors/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';

export default function InstructorProfile() {
  const params = useParams();
  const instructorId = params.id; // dynamic segment

  return (
    <div>
      <h1>Instructor Profile: {instructorId}</h1>
      {/* Fetch and display full details using the ID or slug */}
    </div>
  );
}
