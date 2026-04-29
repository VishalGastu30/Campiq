import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-campiq-border bg-campiq-base mt-24 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-campiq-teal to-transparent opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-sig text-white font-bold text-sm">
                C
              </div>
              <span className="text-lg font-bold tracking-tight text-campiq-text-primary">
                Campiq<span className="text-campiq-teal">.</span>
              </span>
            </Link>
            <p className="text-campiq-text-secondary max-w-md text-sm leading-relaxed">
              Find your campus. Own your future. The most advanced college discovery platform for Indian students to search, compare, and shortlist their dream destinations.
            </p>
            <div className="flex gap-4 pt-2">
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-campiq-text-primary mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-campiq-text-secondary">
              <li><Link href="/explore" className="hover:text-campiq-teal transition-colors">Explore Colleges</Link></li>
              <li><Link href="/compare" className="hover:text-campiq-teal transition-colors">Compare Feature</Link></li>
              <li><Link href="/saved" className="hover:text-campiq-teal transition-colors">Your Saved List</Link></li>
              <li><Link href="/auth/signup" className="hover:text-campiq-teal transition-colors">Create Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-campiq-text-primary mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-campiq-text-secondary">
              <li><a href="#" className="hover:text-campiq-text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-campiq-text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-campiq-text-primary transition-colors">Data Usage</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-campiq-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-campiq-text-muted">
          <p>© {new Date().getFullYear()} Campiq Platform. All rights reserved.</p>
          <p>Built for the future of education.</p>
        </div>
      </div>
    </footer>
  );
}
