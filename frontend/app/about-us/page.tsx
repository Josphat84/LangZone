// frontend/app/about-us/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Framer motion fade-in animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">

      {/* Hero Section with Gradient Shimmer */}
      <main className="container mx-auto px-6 py-12 space-y-16">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <Card className="bg-white shadow-lg rounded-xl p-10 text-center">
            <CardContent className="space-y-6">
              {/* Shimmering Gradient Heading */}
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-teal-400 via-cyan-500 to-purple-500 bg-clip-text text-transparent animate-gradient-shimmer">
                About LangZone
              </h1>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                At LangZone, we believe that learning a new language should be an
                empowering, accessible, and enjoyable journey for everyone. We
                connect passionate language learners with expert instructors from
                around the globe, fostering a vibrant community dedicated to
                linguistic and cultural exchange.
              </p>
              <Button variant="default" size="lg">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mission Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <Card className="bg-white shadow-lg rounded-xl p-10 text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-gray-900">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our mission is to break down language barriers and build bridges
                between cultures by providing personalized, high-quality language
                education. We strive to make authentic language learning accessible
                to anyone, anywhere, empowering them to communicate confidently and
                explore the world with new eyes.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values Section */}
        <section className="space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            These principles guide everything we do, from designing our platform to
            supporting our community.
          </p>
          <ScrollArea className="max-h-[650px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Accessibility",
                  description:
                    "Everyone, regardless of location or background, should have the opportunity to learn. We keep our platform affordable and user-friendly.",
                  icon: "🌐",
                  gradient: "from-teal-400 to-cyan-500",
                },
                {
                  title: "Community",
                  description:
                    "We foster a supportive and engaging global community of learners and instructors.",
                  icon: "👥",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  title: "Effectiveness",
                  description:
                    "We provide effective learning tools and experienced instructors who deliver tangible progress.",
                  icon: "🎯",
                  gradient: "from-orange-400 to-rose-500",
                },
                {
                  title: "Innovation",
                  description:
                    "We integrate the latest educational technologies to enhance the learning experience.",
                  icon: "💡",
                  gradient: "from-lime-400 to-emerald-500",
                },
                {
                  title: "Passion",
                  description:
                    "We are passionate about languages, cultures, and empowering individuals to connect with the world.",
                  icon: "❤️",
                  gradient: "from-pink-400 to-red-500",
                },
              ].map((value, i) => (
                <motion.div
                  key={value.title}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                  className="cursor-pointer"
                >
                  <Card className="p-8 rounded-xl flex flex-col h-full border border-gray-100">
                    <div
                      className={`text-5xl mb-4 w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r ${value.gradient} text-white shadow-lg transition-transform duration-300 hover:scale-110`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      {value.title}
                    </h3>
                    <p className="text-gray-700 text-center flex-grow">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Team Section */}
        <section className="space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            We're a dedicated group of language enthusiasts, educators, and
            technologists committed to transforming how the world learns languages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Jane Doe",
                role: "Co-founder & CEO",
                bio: "With a background in linguistics and a passion for education, Jane envisioned LangZone as a global classroom.",
                image: "/images/image_299f1c.png",
              },
              {
                name: "John Smith",
                role: "Head of Product",
                bio: "John leverages his expertise in software development to build intuitive and effective learning tools.",
                image: "/images/image_299397.jpg",
              },
              {
                name: "Emily White",
                role: "Lead Educator",
                bio: "Emily ensures our curriculum is engaging and aligned with the best language acquisition practices.",
                image: "/images/default-avatar.jpg",
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ scale: 1.03, boxShadow: "0 12px 25px rgba(0,0,0,0.15)" }}
                className="cursor-pointer"
              >
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                  <Avatar className="mx-auto mb-4 w-32 h-32">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <Badge className="mb-2">{member.role}</Badge>
                  <p className="text-gray-700 text-sm">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, boxShadow: "0 12px 25px rgba(0,0,0,0.2)" }}
        >
          <Card className="bg-teal-700 text-white rounded-xl shadow-lg text-center p-12">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold">
                Ready to Start Your Language Journey?
              </h2>
              <p className="text-lg max-w-2xl mx-auto">
                Explore our diverse range of instructors and find the perfect match
                to help you achieve your linguistic goals.
              </p>
              <Link href="/" passHref>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-teal-700 hover:bg-gray-100 shadow-md"
                >
                  Find Your Instructor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <style jsx global>{`
        @keyframes gradient-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-shimmer {
          background-size: 200% 200%;
          animation: gradient-shimmer 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
