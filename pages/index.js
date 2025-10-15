import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { getSavedUser } from '@/utils/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  // Hydration-safe: getSavedUser only on client
  useEffect(() => {
    try {
      const saved = getSavedUser();
      if (saved) setUser(saved);
    } catch {}
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowVideo(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo compact />
            <span className="sr-only">AidCare</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900">How it works</a>
            <a href="#product-tour" className="hover:text-gray-900">Product tour</a>
            <a href="#faq" className="hover:text-gray-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/app" className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">Go to app</Link>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition">Log in</Link>
                <Link href="/signup" className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Clinical decision support for frontline care
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              AidCare listens, extracts key clinical details, and provides triage or clinical guidance tailored to the user’s role—Community Health Workers and Consultants.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={user ? '/app' : '/signup'} className="px-5 py-3 rounded-xl bg-[#6366F1] text-white shadow hover:bg-[#5457ea] transition">{user ? 'Open dashboard' : 'Start free'}</Link>
              <a href="#product-tour" className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">See product tour</a>
            </div>
            <div className="mt-6 text-xs text-gray-500">Works on web. Secure. Role-aware guidance.</div>
          </div>
          {/* Video placeholder */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
              <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                {/* Coming soon thumbnail */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow border border-gray-200">
                    <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                    <span className="text-xs font-medium text-gray-700">Product demo • Coming soon</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 max-w-xs">
                    We’re polishing the walkthrough. Sign up to get early access to the demo.
                  </p>
                  <div className="mt-4">
                    <Link href="/signup" className="px-4 py-2 rounded-lg bg-[#6366F1] text-white hover:bg-[#5457ea] transition">Get early access</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Replace this thumbnail with your embedded video when it’s ready.
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              {/* Replace src with your actual video URL or embed */}
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="AidCare Product Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="flex justify-end bg-gray-900 p-2">
              <button
                className="px-3 py-1.5 text-sm rounded-md bg-white/10 text-white hover:bg-white/20"
                onClick={() => setShowVideo(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Key Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What you can do with AidCare</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <h3 className="font-semibold text-gray-900">Voice to structured data</h3>
            <p className="mt-2 text-gray-600 text-sm">Record the consultation. AidCare extracts symptoms, history, and flags to speed up documentation.</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <h3 className="font-semibold text-gray-900">Role‑aware guidance</h3>
            <p className="mt-2 text-gray-600 text-sm">CHWs receive triage actions; consultants get differentials, investigations, and alerts.</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <h3 className="font-semibold text-gray-900">Patient timeline</h3>
            <p className="mt-2 text-gray-600 text-sm">Quick access to past consultations and documents for context.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How to use AidCare</h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-6 list-decimal list-inside">
            <li className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <span className="font-semibold text-gray-900">Create or select a patient</span>
              <p className="mt-2 text-gray-600 text-sm">Use the left sidebar to search or add a new patient.</p>
            </li>
            <li className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <span className="font-semibold text-gray-900">Capture the encounter</span>
              <p className="mt-2 text-gray-600 text-sm">Tap “Use audio” to record, or type notes/upload lab images.</p>
            </li>
            <li className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <span className="font-semibold text-gray-900">Review guidance & export</span>
              <p className="mt-2 text-gray-600 text-sm">See triage or clinical support, then generate a shareable report.</p>
            </li>
          </ol>
          <div className="mt-8 text-sm text-gray-600">
            Tip: Log in as a CHW to see triage; log in as a Consultant to see clinical support.
          </div>
        </div>
      </section>

      {/* Product Tour (navigation guide) */}
      <section id="product-tour" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Navigating the app</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border bg-white border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900">Sidebar</h3>
            <p className="mt-2 text-gray-600 text-sm">Access patients, create new records, and open organization onboarding.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-white border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900">Header</h3>
            <p className="mt-2 text-gray-600 text-sm">Patient details and session context appear here for quick reference.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-white border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900">Workspace</h3>
            <p className="mt-2 text-gray-600 text-sm">Record audio, add notes, upload documents, and review AI guidance.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={user ? '/app' : '/signup'} className="px-5 py-3 rounded-xl bg-[#6366F1] text-white hover:bg-[#5457ea] transition">{user ? 'Open dashboard' : 'Try AidCare'}</Link>
          <Link href="/login" className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">Log in</Link>
        </div>
      </section>

      {/* FAQ / Footer */}
      <section id="faq" className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">FAQ</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900">Who is AidCare for?</h3>
              <p className="mt-2 text-gray-600 text-sm">Frontline Community Health Workers and clinical consultants who need faster documentation and guidance.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900">Does it work offline?</h3>
              <p className="mt-2 text-gray-600 text-sm">Core features require connectivity for AI processing. Documents and patient lists cache locally in the browser.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA band */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <h3 className="text-gray-900 text-2xl md:text-3xl font-extrabold leading-tight">Ready to support your patients with smarter AI tools</h3>
                <p className="mt-2 text-gray-600 text-sm md:text-base">Reduce documentation time and improve triage and clinical decisions for communities and clinicians.</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link href="/signup" className="px-5 py-3 rounded-xl bg-[#6366F1] text-white font-medium hover:bg-[#5457ea] transition">Sign up today</Link>
                <Link href="/login" className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Log in</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AidCare. All rights reserved.
        </div>
      </footer>
    </div>
  );
}