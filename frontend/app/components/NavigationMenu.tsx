
// app/components/NavigationMenu.tsx
"use client";
import Link from "next/link";

export default function NavigationMenu() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100">
      <Link href="/about-us">about-us</Link>
      <Link href="/admin/feedback">admin/feedback</Link>
      <Link href="/ai-practice-tools">ai-practice-tools</Link>
      <Link href="/blog">blog</Link>
      <Link href="/careers">careers</Link>
      <Link href="/chat">chat</Link>
      <Link href="/community">community</Link>
      <Link href="/contact-us">contact-us</Link>
      <Link href="/courses">courses</Link>
      <Link href="/create-new-profile">create-new-profile</Link>
      <Link href="/dashboard/tutor">dashboard/tutor</Link>
      <Link href="/faq">faq</Link>
      <Link href="/help-center">help-center</Link>
      <Link href="/instructors">instructors</Link>
      <Link href="/instructors/[id]">instructors/[id]</Link>
      <Link href="/josphat_full_profile">josphat_full_profile</Link>
      <Link href="/kids">kids</Link>
      <Link href="/learning-guides">learning-guides</Link>
      <Link href="/">Home</Link>
      <Link href="/privacy-policy">privacy-policy</Link>
      <Link href="/resources">resources</Link>
      <Link href="/sign-up-in">sign-up-in</Link>
      <Link href="/sitemap">sitemap</Link>
      <Link href="/terms-of-service">terms-of-service</Link>
      <Link href="/test-supabase">test-supabase</Link>
      <Link href="/translate-demo">translate-demo</Link>
      <Link href="/tutors/[slug]">tutors/[slug]</Link>
    </nav>
  );
}
