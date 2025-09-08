// frontend/app/careers/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Language Instructor (Multiple Languages)",
      type: "Remote | Part-time/Full-time",
      description: "Teach your native language to students worldwide through our platform.",
      responsibilities: [
        "Deliver high-quality language instruction",
        "Create engaging lesson plans",
        "Provide constructive feedback",
        "Maintain professional communication"
      ],
      requirements: [
        "Native or near-native proficiency",
        "Teaching experience",
        "Bachelor's degree or equivalent",
        "Reliable internet connection"
      ]
    },
    {
      title: "Frontend Developer",
      type: "Remote | Full-time",
      description: "Help build and improve our learning platform with modern web technologies.",
      responsibilities: [
        "Develop new user-facing features",
        "Optimize application performance",
        "Collaborate with design team",
        "Write clean, maintainable code"
      ],
      requirements: [
        "3+ years experience with React/Next.js",
        "Proficient in TypeScript",
        "Strong CSS/Tailwind skills",
        "Experience with testing"
      ]
    }
  ];

  const benefits = [
    {
      title: "Flexible Work",
      description: "Remote opportunities with flexible schedules",
      icon: "🌍"
    },
    {
      title: "Learning Budget",
      description: "Annual stipend for professional development",
      icon: "📚"
    },
    {
      title: "Wellness Program",
      description: "Health and wellness benefits",
      icon: "🧘"
    },
    {
      title: "Language Perks",
      description: "Free language lessons",
      icon: "🗣️"
    }
  ];

  const cultureValues = [
    {
      title: "Global Mindset",
      description: "We celebrate diversity across cultures and backgrounds.",
      icon: "🌐"
    },
    {
      title: "Innovation",
      description: "Constantly improving the learning experience.",
      icon: "🚀"
    },
    {
      title: "Passion for Learning",
      description: "Lifelong learners who grow together.",
      icon: "❤️"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <Badge variant="outline" className="mb-4">We're Hiring</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Join the LangZone Team
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Help us revolutionize language learning through technology and human connection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild>
              <a href="#positions">View Openings</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#culture">Our Culture</a>
            </Button>
          </div>
        </section>

        {/* Culture Section */}
        <section id="culture" className="mb-10">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Our Culture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cultureValues.map((value, index) => (
                  <div key={index} className="text-center p-4 rounded-lg border">
                    <div className="text-3xl mb-3">{value.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">Why Join Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="flex flex-row items-start p-4">
                <span className="text-2xl mr-4 mt-1">{benefit.icon}</span>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">Current Openings</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle>{position.title}</CardTitle>
                  <CardDescription>{position.type}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  <p className="text-muted-foreground mb-4 text-sm">{position.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">RESPONSIBILITIES</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                        {position.responsibilities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">REQUIREMENTS</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
                        {position.requirements.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button>Apply for Position</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* General Application */}
        <section>
          <Card className="bg-muted/50 text-center">
            <CardHeader>
              <CardTitle>Interested but don't see your role?</CardTitle>
              <CardDescription>
                We're always looking for talented people. Send us your resume!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Submit General Application</Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}