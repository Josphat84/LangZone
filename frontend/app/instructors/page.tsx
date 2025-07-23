'use client';

import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Instructor {
  id: string;
  name: string;
  email: string;
  language: string;
  expertise: string;
  price: number;
  description: string;
  country: string;
  is_native: boolean;
  image_url: string | null;
  createdAt: string;
  zoom_link?: string;
  paypal_link?: string;
  wise_link?: string;
  calendar_link?: string;
  whatsapp?: string;
  linkedin?: string;
}

interface Review {
  id: string;
  instructor_id: string;
  student_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Modal Components
function ReviewModal({ instructor, isOpen, onClose, onSubmit }: {
  instructor: Instructor;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string; student_name: string }) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [studentName, setStudentName] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim() && comment.trim() && rating > 0) {
      onSubmit({ rating, comment, student_name: studentName });
      setRating(0);
      setComment('');
      setStudentName('');
      setHoveredRating(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Review {instructor.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating {rating > 0 && <span className="text-blue-600">({rating}/5)</span>}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
                      star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select a rating</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Share your experience..."
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rating === 0}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  rating === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CommentsModal({ instructor, isOpen, onClose, reviews }: {
  instructor: Instructor;
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
}) {
  if (!isOpen) return null;

  const sortedReviews = [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Reviews for {instructor.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            {sortedReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              sortedReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {review.student_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{review.student_name}</span>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                      <span className="text-gray-300">{'⭐'.repeat(5 - review.rating)}</span>
                      <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// New Quick Booking Modal
function QuickBookingModal({ instructor, isOpen, onClose }: {
  instructor: Instructor;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [lessonType, setLessonType] = useState('trial');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send booking data to your backend
    alert(`Booking request sent to ${instructor.name}!\nDate: ${selectedDate}\nTime: ${selectedTime}\nType: ${lessonType}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Quick Book with {instructor.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
          
          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="trial">🎯 Trial Lesson (30 min) - $15</option>
                <option value="regular">📚 Regular Lesson (60 min) - ${instructor.price}</option>
                <option value="intensive">🚀 Intensive Session (90 min) - ${Math.round(instructor.price * 1.4)}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// New component to render locale date only on client
function InstructorJoinDate({ createdAt }: { createdDate: string }) {
  const [joinDate, setJoinDate] = useState('');

  useEffect(() => {
    setJoinDate(new Date(createdAt).toLocaleDateString());
  }, [createdAt]);

  return <span className="text-gray-500 text-xs">Joined {joinDate}</span>;
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [likes, setLikes] = useState<{[key: string]: number}>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [reviews, setReviews] = useState<{[key: string]: Review[]}>({});
  const [viewedProfiles, setViewedProfiles] = useState<Set<string>>(new Set());
  
  // Modal states
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<string | null>(null);

  useEffect(() => {
    fetchInstructors();
    fetchReviews();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Instructor')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching instructors:', error);
        setError('Failed to load instructors');
        return;
      }

      setInstructors(data || []);
      
      // Initialize likes at 0 for each instructor
      const initialLikes: {[key: string]: number} = {};
      data?.forEach(instructor => {
        initialLikes[instructor.id] = 0;
      });
      setLikes(initialLikes);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const reviewsByInstructor: {[key: string]: Review[]} = {};
        data.forEach(review => {
          if (!reviewsByInstructor[review.instructor_id]) {
            reviewsByInstructor[review.instructor_id] = [];
          }
          reviewsByInstructor[review.instructor_id].push(review);
        });
        setReviews(reviewsByInstructor);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    const { data } = supabase.storage.from('instructor-images').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const toggleFavorite = (instructorId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(instructorId)) {
      newFavorites.delete(instructorId);
    } else {
      newFavorites.add(instructorId);
    }
    setFavorites(newFavorites);
  };

  const toggleLike = (instructorId: string) => {
    const newUserLikes = new Set(userLikes);
    const newLikes = { ...likes };
    
    if (newUserLikes.has(instructorId)) {
      newUserLikes.delete(instructorId);
      newLikes[instructorId] = Math.max(0, newLikes[instructorId] - 1);
    } else {
      newUserLikes.add(instructorId);
      newLikes[instructorId] = (newLikes[instructorId] || 0) + 1;
    }
    
    setUserLikes(newUserLikes);
    setLikes(newLikes);
  };

  const markAsViewed = (instructorId: string) => {
    setViewedProfiles(prev => new Set([...prev, instructorId]));
  };

  const handleZoomClick = (zoomLink?: string) => {
    if (zoomLink) {
      window.open(zoomLink, '_blank');
    } else {
      window.open('https://zoom.us/join', '_blank');
    }
  };

  const handleCalendarBooking = (instructorName: string, email: string, calendarLink?: string) => {
    if (calendarLink) {
      window.open(calendarLink, '_blank');
    } else {
      window.open(`https://calendly.com/schedule-lesson?instructor=${encodeURIComponent(instructorName)}`, '_blank');
    }
  };

  const handleWhatsApp = (phone?: string, name?: string) => {
    if (phone) {
      const message = `Hi ${name}, I'm interested in taking language lessons with you!`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const submitReview = async (instructorId: string, reviewData: { rating: number; comment: string; student_name: string }) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          instructor_id: instructorId,
          student_name: reviewData.student_name,
          rating: reviewData.rating,
          comment: reviewData.comment,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error submitting review:', error);
        return;
      }

      const newReview = data[0] as Review;
      setReviews(prev => ({
        ...prev,
        [instructorId]: [...(prev[instructorId] || []), newReview]
      }));
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const getAverageRating = (instructorId: string) => {
    const instructorReviews = reviews[instructorId] || [];
    if (instructorReviews.length === 0) return 0;
    const sum = instructorReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / instructorReviews.length).toFixed(1);
  };

  // Enhanced filtering and sorting
  const filteredAndSortedInstructors = instructors
    .filter((instructor) => {
      const matchesSearch =
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLanguage = !languageFilter || instructor.language === languageFilter;
      
      const matchesPrice = !priceFilter || 
        (priceFilter === 'under25' && instructor.price < 25) ||
        (priceFilter === '25to50' && instructor.price >= 25 && instructor.price <= 50) ||
        (priceFilter === 'over50' && instructor.price > 50);

      return matchesSearch && matchesLanguage && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return parseFloat(getAverageRating(b.id)) - parseFloat(getAverageRating(a.id));
        case 'popular':
          return (likes[b.id] || 0) - (likes[a.id] || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const availableLanguages = [...new Set(instructors.map((i) => i.language))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading instructors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchInstructors}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Language Instructors</h1>
              <p className="mt-2 text-gray-600 text-lg">
                Find your perfect language teacher ({filteredAndSortedInstructors.length} instructor
                {filteredAndSortedInstructors.length !== 1 ? 's' : ''})
              </p>
            </div>
            <Link
              href="/create-new-profile"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Become an Instructor
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search by name, expertise, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                  <svg className="absolute left-3 top-4 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">🌍 All Languages</option>
                {availableLanguages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">💰 All Prices</option>
                <option value="under25">Under $25/hr</option>
                <option value="25to50">$25-50/hr</option>
                <option value="over50">Over $50/hr</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">📅 Newest First</option>
                <option value="price-low">💵 Price: Low to High</option>
                <option value="price-high">💸 Price: High to Low</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="popular">🔥 Most Liked</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setLanguageFilter('');
                    setPriceFilter('');
                    setSortBy('newest');
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructors List */}
        {filteredAndSortedInstructors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-500 text-xl mb-6">
              {instructors.length === 0
                ? 'No instructors found.'
                : 'No instructors match your search criteria.'}
            </p>
            {instructors.length === 0 && (
              <Link
                href="/create-new-profile"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🎯 Be the First Instructor
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {filteredAndSortedInstructors.map((instructor, index) => {
              const isExpanded = expandedCard === instructor.id;
              const isFavorite = favorites.has(instructor.id);
              const isLiked = userLikes.has(instructor.id);
              const isViewed = viewedProfiles.has(instructor.id);
              const instructorReviews = reviews[instructor.id] || [];
              const averageRating = getAverageRating(instructor.id);
              const responseTime = Math.floor(Math.random() * 4) + 1; // Random 1-4 hours
              
              return (
                <div
                  key={instructor.id}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isExpanded ? 'ring-2 ring-blue-500' : ''
                  } ${isViewed ? 'opacity-95' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${
                      index % 4 === 0 ? '#f8fafc to #e2e8f0' :
                      index % 4 === 1 ? '#fef7cd to #fef3c7' :
                      index % 4 === 2 ? '#ecfdf5 to #d1fae5' :
                      '#fdf2f8 to #fce7f3'
                    })`
                  }}
                  onClick={() => markAsViewed(instructor.id)}
                >
                  <div className={`${isExpanded ? 'lg:flex' : 'md:flex'} items-start`}>
                    {/* Profile Image Section */}
                    <div className={`${isExpanded ? 'lg:w-80' : 'md:w-72'} relative`}>
                      <div className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                        {instructor.image_url ? (
                          <img
                            src={getImageUrl(instructor.image_url) || ''}
                            alt={instructor.name}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                            <div className="text-blue-600 text-8xl font-bold drop-shadow-lg">
                              {instructor.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        
                        {/* New Badge for New Instructors */}
                        {new Date().getTime() - new Date(instructor.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                            ✨ NEW
                          </div>
                        )}

                        {/* Favorite Button - Top Right */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(instructor.id);
                          }}
                          className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
                        >
                          {isFavorite ? (
                            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </button>

                        {/* Online Status with More Dynamic Info */}
                        <div className="absolute bottom-4 right-4 space-y-2">
                          <div className="bg-green-500 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            Online
                          </div>
                        </div>

                        {/* Country and Native - Bottom Left */}
                        <div className="absolute bottom-4 left-4 space-y-1">
                          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                            📍 {instructor.country}
                          </div>
                          {instructor.is_native && (
                            <div className="bg-green-500 bg-opacity-90 text-white px-2 py-1 rounded text-xs font-bold">
                              🎯 Native
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="flex-1 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              🗣️ {instructor.language}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-bold">
                              🎯 {instructor.expertise}
                            </span>
                            {averageRating > 0 && (
                              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                ⭐ {averageRating}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-green-600 mb-1">${instructor.price}</div>
                          <div className="text-sm text-gray-500 font-medium">per hour</div>
                          <div className="text-xs text-green-600 mt-1 font-medium">💳 Trial: $15</div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <p className={`text-gray-700 leading-relaxed ${
                          isExpanded ? 'text-lg' : 'text-base line-clamp-2'
                        }`}>
                          {instructor.description}
                        </p>
                        {instructor.description.length > 120 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(isExpanded ? null : instructor.id);
                            }}
                            className="text-blue-600 text-sm mt-2 hover:underline font-medium"
                          >
                            {isExpanded ? '👆 Show less' : '👇 Read more'}
                          </button>
                        )}
                      </div>

                      {/* Action Buttons Grid */}
                      <div className="space-y-4">
                        {/* Primary Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowBookingModal(instructor.id);
                            }}
                            className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-bold"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            📅 Quick Book
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleZoomClick(instructor.zoom_link);
                            }}
                            className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-bold"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 11.5 6h-8zM22 8.5a1.5 1.5 0 0 0-3 0v7a1.5 1.5 0 0 0 3 0v-7z"/>
                            </svg>
                            🎥 Join Zoom
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCalendarBooking(instructor.name, instructor.email, instructor.calendar_link);
                            }}
                            className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-bold"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ⏰ Schedule
                          </button>
                        </div>

                        {/* Elegant Payment & Contact Links */}
                        <div className="flex items-center justify-center gap-6 py-4">
                          <a
                            href={instructor.paypal_link || "https://paypal.me/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-yellow-50 transition-all duration-200"
                            title="Pay with PayPal"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-yellow-600">PayPal</span>
                          </a>

                          <a
                            href={instructor.wise_link || "https://wise.com/"}
                            target="_blank"  
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="group flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-purple-50 transition-all duration-200"
                            title="Pay with Wise"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600">Wise</span>
                          </a>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsApp(instructor.whatsapp || "+1234567890", instructor.name);
                            }}
                            className="group flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-green-50 transition-all duration-200"
                            title="Chat on WhatsApp"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-green-600">WhatsApp</span>
                          </button>

                          <a
                            href={`mailto:${instructor.email}?subject=Language Lesson Inquiry&body=Hi ${instructor.name}, I'm interested in taking ${instructor.language} lessons with you!`}
                            onClick={(e) => e.stopPropagation()}
                            className="group flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            title="Send Email"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-gray-700">Email</span>
                          </a>

                          {instructor.linkedin && (
                            <a
                              href={instructor.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="group flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                              title="View LinkedIn Profile"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </div>
                              <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">LinkedIn</span>
                            </a>
                          )}
                        </div>

                        {/* Interactive Features */}
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(instructor.id);
                            }}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105 font-bold text-sm ${
                              isLiked 
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                            }`}
                          >
                            <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                              {isLiked ? (
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              )}
                            </svg>
                            {likes[instructor.id] || 0} Likes
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCommentsModal(instructor.id);
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-lg transform hover:scale-105 font-bold text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {instructorReviews.length} Reviews
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowReviewModal(instructor.id);
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 rounded-lg hover:from-yellow-200 hover:to-yellow-300 transition-all duration-200 shadow-lg transform hover:scale-105 font-bold text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Rate
                          </button>
                        </div>

                        {/* Enhanced Stats & Info Bar */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <InstructorJoinDate createdAt={instructor.createdAt} />
                            {averageRating > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  ⭐ {averageRating} ({instructorReviews.length} reviews)
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>Response: ~{responseTime}h</span>
                            {isViewed && (
                              <span className="text-blue-600 font-medium">👁️ Viewed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Booking Modal */}
      {showBookingModal && (
        <QuickBookingModal
          instructor={instructors.find(i => i.id === showBookingModal)!}
          isOpen={!!showBookingModal}
          onClose={() => setShowBookingModal(null)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          instructor={instructors.find(i => i.id === showReviewModal)!}
          isOpen={!!showReviewModal}
          onClose={() => setShowReviewModal(null)}
          onSubmit={(reviewData) => submitReview(showReviewModal, reviewData)}
        />
      )}

      {/* Comments Modal */}
      {showCommentsModal && (
        <CommentsModal
          instructor={instructors.find(i => i.id === showCommentsModal)!}
          isOpen={!!showCommentsModal}
          onClose={() => setShowCommentsModal(null)}
          reviews={reviews[showCommentsModal] || []}
        />
      )}
    </div>
  );
}