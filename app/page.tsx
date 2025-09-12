'use client';

import ScriptGenerator from '@/components/script-generator';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <ScriptGenerator />
      </main>
    </div>
  );
}
