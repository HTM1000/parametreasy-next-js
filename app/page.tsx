'use client';

import { Suspense } from 'react';
import ScriptGenerator from '@/components/script-generator';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ScriptGenerator />
        </Suspense>
      </main>
    </div>
  );
}
