import { Wifi, Brain } from 'lucide-react';

export function Header() {
  return (
    <header className="gradient-hero text-white py-8 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <Brain className="w-8 h-8 text-accent" />
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <Wifi className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Sistem Pakar Kualitas Jaringan
        </h1>
        
        <p className="text-center text-white/80 max-w-2xl mx-auto text-lg">
          Klasifikasi kualitas jaringan internet menggunakan algoritma 
          <span className="font-semibold text-accent"> K-Nearest Neighbor (KNN)</span>
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/60">
          <span className="px-3 py-1 rounded-full bg-white/10">Machine Learning</span>
          <span className="px-3 py-1 rounded-full bg-white/10">Classification</span>
          <span className="px-3 py-1 rounded-full bg-white/10">Expert System</span>
        </div>
      </div>
    </header>
  );
}
