'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

// Helper function to generate a URL-friendly slug
const createSlug = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
};

export default function CreateInstructorProfile() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    country: '',
    language: '',
    is_native: false,
    expertise: '',
    qualifications: '',
    years_experience: '',
    price: '',
    description: '',
    video_intro_url: '',
    social_links: '',
    slug: '',
    image_url: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: createSlug(prev.name),
      }));
    }
  }, [formData.name]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, image_url: files ? files[0] : null }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceValue = parseFloat(formData.price) || 0;

      let imagePath = '';
      if (formData.image_url) {
        const fileExt = formData.image_url.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `instructors/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('instructor-images')
          .upload(filePath, formData.image_url);

        if (uploadError) throw uploadError;

        imagePath = filePath;
      }
      
      const insertData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number || null,
        country: formData.country.trim(),
        language: formData.language || null,
        is_native: formData.is_native,
        expertise: formData.expertise.trim(),
        qualifications: formData.qualifications || null,
        years_experience: formData.years_experience ? parseInt(formData.years_experience, 10) : null,
        price: priceValue,
        description: formData.description.trim(),
        video_intro_url: formData.video_intro_url || null,
        social_links: formData.social_links || null,
        slug: formData.slug.trim(),
        image_url: imagePath || null,
        createdAt: new Date().toISOString(),
      };

      const { error } = await supabase.from('Instructor').insert([insertData]);

      if (error) throw error;

      router.push(`/tutors/${formData.slug.trim()}`);
    } catch (err: any) {
      console.error('Error creating profile:', err);
      alert('Failed to create profile. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Your Teaching Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of educators and start connecting with students worldwide
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    name="phone_number"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    name="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Profile URL */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Profile URL
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Slug *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                    /tutors/
                  </span>
                  <input
                    name="slug"
                    placeholder="jane-smith"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className={`${inputClasses} rounded-r-lg border-l-0`}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">This will be your unique profile URL</p>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <input
                    name="language"
                    placeholder="English, Spanish, French..."
                    value={formData.language}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_native"
                      checked={formData.is_native}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Native Speaker</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level of Expertise</label>
                  <input
                    name="expertise"
                    placeholder="Mathematics, Programming, Language Arts..."
                    value={formData.expertise}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    name="years_experience"
                    type="number"
                    placeholder="5"
                    min="0"
                    value={formData.years_experience}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications & Certifications</label>
                  <input
                    name="qualifications"
                    placeholder="PhD in Mathematics, TESOL Certified, etc."
                    value={formData.qualifications}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Pricing
              </h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    name="price"
                    type="number"
                    placeholder="25.00"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`${inputClasses} pl-8`}
                  />
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Profile Content
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                  <textarea
                    name="description"
                    placeholder="Tell students about your teaching style, experience, and what makes you unique..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`${inputClasses} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      name="image_url"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-sm text-gray-500">Upload a professional photo (JPG, PNG, GIF)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Introduction URL</label>
                  <input
                    name="video_intro_url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.video_intro_url}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  <p className="mt-2 text-sm text-gray-500">Optional: Add a video introduction to showcase your teaching style</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Link</label>
                  <input
                    name="social_links"
                    placeholder="https://linkedin.com/in/yourname"
                    value={formData.social_links}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-300 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Profile...
                  </span>
                ) : (
                  'Create Your Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
