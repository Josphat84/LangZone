//app/faq/page.tsx
'use client';


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  BookOpen,
  CreditCard,
  RefreshCw,
  Users,
  Video,
  Calendar
} from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
};

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const faqs: FAQItem[] = [
    {
      question: "How do I find an instructor?",
      answer: "You can use our 'Find Instructors' page to browse by language, specialty, availability, and price. You can also view instructor profiles to learn more about their experience and teaching style. Our advanced filters help you find the perfect match for your learning goals.",
      category: "Getting Started",
      icon: <Search className="h-5 w-5" />
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept major credit cards (Visa, MasterCard, Amex) and PayPal. All payments are securely processed through our platform with industry-standard encryption. You can also set up automatic payments for recurring lessons.",
      category: "Payments",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "If you're not satisfied with your first lesson with a new instructor, please contact our support team within 24 hours, and we'll review your case for a potential refund or credit. We also offer a satisfaction guarantee for our premium courses.",
      category: "Payments",
      icon: <RefreshCw className="h-5 w-5" />
    },
    {
      question: "How do I become an instructor on LangZone?",
      answer: "Visit our 'Become an Instructor' page and fill out the application form. We review applications to ensure instructors meet our quality standards and language proficiency requirements. The process typically takes 3-5 business days, and we provide training resources to help you get started.",
      category: "Instructors",
      icon: <Users className="h-5 w-5" />
    },
    {
      question: "Are lessons conducted live?",
      answer: "Yes, all one-on-one lessons and most group courses are conducted live via our integrated virtual classroom, which supports video, audio, and chat functions. We also offer recorded sessions for review and some self-paced courses.",
      category: "Lessons",
      icon: <Video className="h-5 w-5" />
    },
    {
      question: "What if I need to reschedule or cancel a lesson?",
      answer: "You can reschedule or cancel lessons directly from your dashboard. Please note that our cancellation policy requires at least 24 hours' notice to avoid being charged for the lesson. Emergency cancellations are reviewed on a case-by-case basis.",
      category: "Lessons",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      question: "What languages are available on the platform?",
      answer: "We offer instruction in over 50 languages, from popular choices like Spanish, French, and Mandarin to less common languages like Finnish and Swahili. New languages are added regularly based on demand.",
      category: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      question: "How do group lessons work?",
      answer: "Group lessons accommodate 3-8 students of similar proficiency levels. They're more affordable than one-on-one sessions and provide opportunities to practice with peers. You can join existing groups or request to start a new one.",
      category: "Lessons",
      icon: <Users className="h-5 w-5" />
    }
  ];

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Getting Started': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Payments': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Instructors': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Lessons': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      'All': 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    };
    return colors[category] || colors['All'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <HelpCircle className="h-4 w-4 mr-1" />
              Help Center
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-3">
                Questions
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Find quick answers to common questions about LangZone's language learning platform.
              Can't find what you're looking for? We're here to help!
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Categories</CardTitle>
                <CardDescription>Filter by topic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full justify-start text-left ${
                      selectedCategory === category 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category}
                    <span className="ml-auto text-xs">
                      {category === 'All' ? faqs.length : faqs.filter(faq => faq.category === category).length}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Need More Help Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white mt-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Still Need Help?
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Our support team is here to assist you with any questions.
                </p>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - FAQ Items */}
          <div className="lg:col-span-3">
            {searchTerm && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800">
                  <span className="font-medium">{filteredFAQs.length}</span> result{filteredFAQs.length !== 1 ? 's' : ''} found for 
                  <span className="font-medium"> "{searchTerm}"</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                const isExpanded = expandedItems.includes(index);
                return (
                  <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                    <div 
                      className="cursor-pointer"
                      onClick={() => toggleExpanded(index)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                              {faq.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getCategoryColor(faq.category)}`}
                                >
                                  {faq.category}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-900 leading-snug">
                                {faq.question}
                              </CardTitle>
                            </div>
                          </div>
                          <div className="ml-4 mt-2">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="pt-0">
                          <Separator className="mb-4" />
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </CardContent>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredFAQs.length === 0 && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm text-center py-12">
                <CardContent>
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or browse our categories.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}