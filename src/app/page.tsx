'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeafIcon } from '@/lib/icons';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        router.replace(user ? '/home' : '/login');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [router, user, loading]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#f0fff4] animate-in fade-in duration-1000">
      {loading ? (
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      ) : (
        <>
          <LeafIcon className="h-24 w-24 text-primary" />
          <h1 className="text-4xl font-bold text-primary mt-4 font-headline">
            Plant Identifier
          </h1>
          <p className="text-muted-foreground mt-2">Discover the nature around you.</p>
        </>
      )}
    </div>
  );
}
