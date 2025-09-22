// Kids Page
//app/kids/page.tsx

'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function KidsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🎈 Kids Corner</h1>
        <p className="text-muted-foreground">
          Fun and interactive language activities designed just for kids.
        </p>
      </header>

      {/* Kids Activities */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-pink-50">
            <h3 className="font-semibold text-lg mb-2">Flashcard Games</h3>
            <p className="mb-3">Play games to learn new words with pictures and sounds.</p>
            <Button variant="secondary">Play Now</Button>
          </Card>

          <Card className="p-6 text-center bg-blue-50">
            <h3 className="font-semibold text-lg mb-2">Story Time</h3>
            <p className="mb-3">Listen to short stories and practice pronunciation.</p>
            <Button variant="secondary">Listen</Button>
          </Card>

          <Card className="p-6 text-center bg-green-50">
            <h3 className="font-semibold text-lg mb-2">Songs & Rhymes</h3>
            <p className="mb-3">Learn with music, rhymes, and fun sing-alongs.</p>
            <Button variant="secondary">Sing</Button>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-8 bg-muted rounded-2xl mt-8">
        <h2 className="text-2xl font-bold mb-2">🚀 Start Learning Today!</h2>
        <Button size="lg">Join Kids Activities</Button>
      </div>
    </div>
  );
}
