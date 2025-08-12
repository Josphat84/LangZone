// app/tutors/[slug]/ClientFeatures.tsx
'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  country?: string | null;
  language?: string | null;
  is_native: boolean;
  expertise?: string | null;
  qualifications?: string | null;
  years_experience?: number | null;
  price?: number | null;
  description?: string | null;
  video_intro_url?: string | null;
  social_links?: string | null;
  slug: string;
  image_url?: string | null;
  rating?: number | null;
  createdAt?: string | null;
}

interface ClientFeaturesProps {
  instructor: Instructor;
}

// Simple calendar component without external dependencies
const SimpleCalendar = ({ onDateSelect, selectedDates }: { 
  onDateSelect: (date: Date) => void;
  selectedDates: Date[];
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }
  
  const isSelected = (date: Date) => {
    return selectedDates.some(selected => 
      selected.toDateString() === date.toDateString()
    );
  };
  
  const isPastDate = (date: Date) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateOnly < todayOnly;
  };
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => !isPastDate(date) && onDateSelect(date)}
            disabled={isPastDate(date)}
            className={`
              p-2 text-sm rounded-lg transition-colors
              ${!isCurrentMonth(date) 
                ? 'text-gray-300' 
                : isPastDate(date)
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-900 hover:bg-blue-50'
              }
              ${isSelected(date) 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : ''
              }
            `}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ClientFeatures({ instructor }: ClientFeaturesProps) {
  const [availability, setAvailability] = useState<Date[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'files'>('calendar');

  // Fetch existing availability and resources
  useEffect(() => {
    fetchAvailability();
    fetchResources();
  }, []);

  async function fetchAvailability() {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('instructor_id', instructor.id);
    
    if (!error && data) {
      setAvailability(data.map((item: any) => new Date(item.available_date)));
    }
  }

  async function fetchResources() {
    const { data, error } = await supabase.storage
      .from('instructor-files')
      .list(`${instructor.id}`);
    
    if (!error && data) {
      setResources(data);
    }
  }

  async function handleDateSelect(date: Date) {
    // Check if date is already selected
    const isAlreadySelected = availability.some(
      selected => selected.toDateString() === date.toDateString()
    );

    if (isAlreadySelected) {
      // Remove from availability
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('instructor_id', instructor.id)
        .eq('available_date', date.toISOString().split('T')[0]);

      if (!error) {
        setAvailability(availability.filter(
          selected => selected.toDateString() !== date.toDateString()
        ));
      }
    } else {
      // Add to availability
      const { error } = await supabase
        .from('availability')
        .insert([{ 
          instructor_id: instructor.id, 
          available_date: date.toISOString().split('T')[0]
        }]);

      if (!error) {
        setAvailability([...availability, date]);
      }
    }
  }

  async function handleFileUpload() {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('instructor-files')
          .upload(`${instructor.id}/${fileName}`, file, { 
            upsert: true 
          });

        if (error) {
          console.error('Upload error:', error);
        }
      }
      
      // Refresh resources list
      await fetchResources();
      
      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setFiles(null);
      
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteFile(fileName: string) {
    const { error } = await supabase.storage
      .from('instructor-files')
      .remove([`${instructor.id}/${fileName}`]);

    if (!error) {
      setResources(resources.filter(file => file.name !== fileName));
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            Availability
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'files'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Resources
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'calendar' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Set Your Availability
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                Click on dates to toggle your availability. Students can book sessions on selected dates.
              </p>
              
              <SimpleCalendar 
                onDateSelect={handleDateSelect}
                selectedDates={availability}
              />

              {availability.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Available Dates ({availability.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availability.slice(0, 5).map((date, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    ))}
                    {availability.length > 5 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{availability.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Resources
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                Share teaching materials, syllabi, or other resources with your students.
              </p>

              {/* File Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Files
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={(e) => setFiles(e.target.files)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, PPT, PPTX up to 10MB
                    </p>
                  </div>
                </div>

                {files && files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Selected Files:
                    </h4>
                    <ul className="space-y-1">
                      {Array.from(files).map((file, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={!files || files.length === 0 || uploading}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Upload Files'
                  )}
                </button>
              </div>

              {/* Resources List */}
              {resources.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Resources ({resources.length})
                  </h4>
                  <div className="space-y-3">
                    {resources.map((file) => (
                      <div key={file.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.metadata?.size ? `${(file.metadata.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/instructor-files/${instructor.id}/${file.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.name)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}