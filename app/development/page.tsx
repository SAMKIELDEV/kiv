import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DevelopmentPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="bg-neutral-100 p-4 rounded-2xl inline-block mb-4">
          <span className="text-4xl">🚧</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 tracking-tight">
          Still in Development
        </h1>
        <p className="text-lg text-neutral-500">
          We are currently working hard on this section. Please check back later!
        </p>
        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
