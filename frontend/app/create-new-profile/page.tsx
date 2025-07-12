// frontend/app/create-new-profile/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from "next/image";
import axios from 'axios';


// Example: For your "Become an Instructor" form
interface InstructorFormData {
  name: string;
  email: string;
  language: string;
  expertise: string;
  price: number;
  description: string;
  country: string;
  isNative: boolean;
  image: File | null;
  // Add other fields as they exist in your form
}

export default function CreateNewProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: '',
    expertise: 'Community Instructor',
    price: '',
    description: '',
    country: '',
    isNative: false,
    image: null,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.language || formData.language === 'Select Language') errors.language = 'Language is required';
    if (!formData.price) errors.price = 'Price is required';
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) errors.price = 'Price must be a positive number';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.country || formData.country === 'Select Country') errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (validateForm()) {
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          language: formData.language,
          expertise: formData.expertise,
          price: parseFloat(formData.price),
          description: formData.description,
          country: formData.country,
          is_native: formData.isNative,
          image_url: formData.image ? `/images/${formData.image.name}` : "/images/default-avatar.jpg",
          rating: 0.0,
          reviews: 0,
        };

        const response = await axios.post('http://localhost:8000/api/instructors/', payload);
        console.log('Instructor created:', response.data);
        setFormSubmitted(true);
      } catch (error) {
        console.error('Error creating instructor:', error.response ? error.response.data : error.message);
        let errorMessage = 'Failed to create profile. Please try again.';
        if (error.response && error.response.data) {
            if (error.response.data.email && error.response.data.email[0].includes('already exists')) {
                errorMessage = 'This email is already registered. Please use a different one.';
            } else {
                errorMessage += ' ' + JSON.stringify(error.response.data);
            }
        }
        setSubmitError(errorMessage);
      }
    } else {
      console.log('Form has errors:', formErrors);
    }
  };

  const commonInputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400";
  const labelClasses = "block text-gray-700 text-sm font-semibold mb-2";
  const errorClasses = "text-red-500 text-xs mt-1";


  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 text-center max-w-md w-full">
          <Image src="/icons/success-check.svg" alt="Success" width={80} height={80} className="mx-auto mb-6"/>
          <h2 className="text-3xl font-bold text-teal-700 mb-4">Profile Created Successfully!</h2>
          <p className="text-gray-700 mb-6">Thank you for joining LangZone. Your profile is now under review and will be live shortly.</p>
          <Link href="/" className="bg-teal-600 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-teal-700 transition-colors shadow-md">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-teal-700">
            <Image src="/icons/logo-icon.svg" alt="App Logo" width={28} height={28} />
            <span>LangZone</span>
          </Link>
          <nav className="flex space-x-5">
            <Link href="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Find Instructors</Link>
            <Link href="/enterprise" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Enterprise Solutions</Link>
            <Link href="/courses" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Courses</Link>
            <Link href="/create-new-profile" className="text-teal-600 font-medium transition-colors">Become an Instructor</Link>
            <Link href="/about-us" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">About Us</Link>{/* Added About Us link */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Become an Instructor</h1>
          <p className="text-gray-700 text-lg mb-8 text-center">
            Join our community of passionate language educators. Fill out the form below to create your profile.
          </p>

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={labelClasses}>Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={commonInputClasses}
                  placeholder="John Doe"
                  required
                />
                {formErrors.name && <p className={errorClasses}>{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Email Address:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={commonInputClasses}
                  placeholder="john.doe@example.com"
                  required
                />
                {formErrors.email && <p className={errorClasses}>{formErrors.email}</p>}
              </div>
            </div>

            {/* Language and Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="language" className={labelClasses}>Language you will teach:</label>
                <div className="relative">
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className={`${commonInputClasses} appearance-none pr-8`}
                    required
                  >
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                    <option value="Mandarin">Mandarin Chinese</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Russian">Russian</option>
                    <option value="Italian">Italian</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Swedish">Swedish</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                  </div>
                </div>
                {formErrors.language && <p className={errorClasses}>{formErrors.language}</p>}
              </div>
              <div>
                <label htmlFor="expertise" className={labelClasses}>Your Expertise:</label>
                <div className="relative">
                  <select
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    className={`${commonInputClasses} appearance-none pr-8`}
                  >
                    <option value="Community Instructor">Community Instructor</option>
                    <option value="Native Speaker">Native Speaker</option>
                    <option value="Certified Educator">Certified Educator</option>
                    <option value="Language Specialist">Language Specialist</option>
                    <option value="ESL Specialist">ESL Specialist</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className={labelClasses}>Price per lesson ($USD):</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={commonInputClasses}
                  placeholder="e.g., 25"
                  min="1"
                  step="0.01"
                  required
                />
                {formErrors.price && <p className={errorClasses}>{formErrors.price}</p>}
              </div>
              <div>
                <label htmlFor="country" className={labelClasses}>Your Country of Residence:</label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`${commonInputClasses} appearance-none pr-8`}
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="Spain">Spain</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="China">China</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Russia">Russia</option>
                    <option value="Italy">Italian</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Hindi">Hindi</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.5 4.5z"/></svg>
                  </div>
                </div>
                {formErrors.country && <p className={errorClasses}>{formErrors.country}</p>}
              </div>
            </div>

            {/* Description and Native Speaker */}
            <div>
              <label htmlFor="description" className={labelClasses}>Tell us about yourself and your teaching style:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={commonInputClasses}
                placeholder="Hi, I'm [Your Name] and I love teaching [Language]! My lessons focus on..."
                required
              ></textarea>
              {formErrors.description && <p className={errorClasses}>{formErrors.description}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNative"
                name="isNative"
                checked={formData.isNative}
                onChange={handleChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="isNative" className="ml-2 block text-gray-900 text-sm">
                I am a native speaker of the language I will teach.
              </label>
            </div>

            {/* Profile Image Upload */}
            <div>
              <label htmlFor="image" className={labelClasses}>Upload a profile image:</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              <p className="text-gray-500 text-xs mt-1">PNG, JPG, up to 5MB. Clear, well-lit photo of your face.</p>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-md"
            >
              Create My Profile
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-6 text-center mt-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-8">
            <div>
              <h6 className="font-bold text-white mb-4">LangZone</h6>
              <ul className="space-y-2">
                <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>{/* Added About Us link */}
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white mb-4">Learn</h6>
              <ul className="space-y-2">
                <li><Link href="/learn/english" className="hover:text-white transition-colors">Learn English</Link></li>
                <li><Link href="/learn/spanish" className="hover:text-white transition-colors">Learn Spanish</Link></li>
                <li><Link href="/learn/french" className="hover:text-white transition-colors">Learn French</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white mb-4">Support</h6>
              <ul className="space-y-2">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold text-white mb-4">Connect</h6>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885V5H9v3z"/></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.892-.959-2.173-1.559-3.591-1.559-3.447 0-6.227 2.78-6.227 6.227 0 .486.058.96.173 1.411-5.18-.26-9.77-2.73-12.898-6.472-.538.924-.848 1.996-.848 3.13 0 2.152 1.097 4.045 2.766 5.158-.807-.025-1.568-.247-2.228-.616v.086c0 3.02 2.13 5.544 4.935 6.107-.464.12-.953.187-1.456.187-.359 0-.709-.035-1.05-.1 1.04-.325 1.92-1.274 2.144-2.268 2.457 1.921 5.626 3.324 9.407 3.324 11.3 0 17.5-9.314 17.5-17.498 0-.486-.025-.96-.075-1.424.97-.699 1.81-1.593 2.47-2.585z"/></svg>
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LangZone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}