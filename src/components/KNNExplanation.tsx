import { BookOpen, GitBranch, Calculator, Vote, ArrowRight } from 'lucide-react';

export function KNNExplanation() {
  const steps = [
    {
      icon: <Calculator className="w-5 h-5" />,
      title: '1. Normalisasi Data',
      description: 'Semua fitur dinormalisasi menggunakan Min-Max Scaling agar memiliki skala yang sama (0-1).'
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: '2. Hitung Jarak',
      description: 'Menghitung jarak Euclidean antara data baru dengan semua data training.'
    },
    {
      icon: <ArrowRight className="w-5 h-5" />,
      title: '3. Pilih K Terdekat',
      description: 'Memilih K data training dengan jarak terdekat sebagai "tetangga".'
    },
    {
      icon: <Vote className="w-5 h-5" />,
      title: '4. Voting Mayoritas',
      description: 'Label dengan jumlah terbanyak dari K tetangga menjadi hasil prediksi.'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="section-title flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary" />
        Tentang Algoritma KNN
      </h2>
      <p className="section-subtitle">
        K-Nearest Neighbor adalah algoritma supervised learning untuk klasifikasi
      </p>

      {/* Algorithm Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {steps.map((step, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {step.icon}
              </div>
              <h4 className="font-semibold text-sm">{step.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground pl-11">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Why K=5 */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-primary">❓</span>
          Mengapa K=5?
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong>Menghindari tie:</strong> Nilai ganjil mencegah hasil voting seri pada klasifikasi 2 kelas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong>Balance:</strong> Tidak terlalu kecil (overfitting) atau terlalu besar (underfitting)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong>Robust:</strong> Cukup stabil terhadap noise dalam data</span>
          </li>
        </ul>
      </div>

      {/* Features Used */}
      <div className="mt-6">
        <h4 className="font-semibold mb-3 text-sm">Fitur yang Digunakan</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Ping Latency (ms)',
            'Download Speed (Mbps)',
            'Upload Speed (Mbps)',
            'Packet Loss (%)',
            'Signal Strength (%)'
          ].map(feature => (
            <span 
              key={feature}
              className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 rounded-xl bg-muted/50 font-mono text-sm">
        <p className="text-muted-foreground mb-2">Euclidean Distance Formula:</p>
        <p className="text-foreground">
          d(p,q) = √Σ(pᵢ - qᵢ)²
        </p>
      </div>
    </div>
  );
}
