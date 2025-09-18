'use client';

import { Suspense } from 'react';
import ScriptGenerator from '@/src/components/ScriptGenerator';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScriptGenerator />
    </Suspense>
  );
}
