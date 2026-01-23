import { CheckCircle, AlertTriangle, XCircle, Users } from 'lucide-react';
import { QualityLabel } from '@/lib/knn';

interface PredictionResultProps {
  prediction: QualityLabel;
  confidence: number;
  neighbors: { distance: number; label: QualityLabel }[];
  k: number;
}

const resultConfig: Record<QualityLabel, {
  icon: React.ReactNode;
  className: string;
  bgClass: string;
  description: string;
  recommendations: string[];
}> = {
  'Baik': {
    icon: <CheckCircle className="w-12 h-12" />,
    className: 'result-good',
    bgClass: 'gradient-success',
    description: 'Kualitas jaringan internet sangat baik! Koneksi stabil dengan kecepatan tinggi.',
    recommendations: [
      'Cocok untuk streaming video 4K/8K',
      'Gaming online tanpa lag',
      'Video conference berkualitas tinggi',
      'Download file besar dengan cepat'
    ]
  },
  'Sedang': {
    icon: <AlertTriangle className="w-12 h-12" />,
    className: 'result-medium',
    bgClass: 'gradient-warning',
    description: 'Kualitas jaringan cukup baik, namun ada beberapa parameter yang bisa ditingkatkan.',
    recommendations: [
      'Cukup untuk streaming HD',
      'Browsing dan media sosial lancar',
      'Video call dengan kualitas standar',
      'Pertimbangkan upgrade untuk aktivitas berat'
    ]
  },
  'Buruk': {
    icon: <XCircle className="w-12 h-12" />,
    className: 'result-bad',
    bgClass: 'gradient-danger',
    description: 'Kualitas jaringan perlu diperbaiki. Beberapa aspek menunjukkan performa rendah.',
    recommendations: [
      'Periksa koneksi router/modem',
      'Kurangi jarak dari router',
      'Cek gangguan dari perangkat lain',
      'Hubungi ISP jika masalah berlanjut'
    ]
  }
};

export function PredictionResult({ prediction, confidence, neighbors, k }: PredictionResultProps) {
  const config = resultConfig[prediction];

  return (
    <div className="animate-slide-up">
      {/* Main Result Card */}
      <div className={`result-card ${config.className} mb-6`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${config.bgClass} text-white`}>
            {config.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">Kualitas: {prediction}</h3>
              <span className="px-3 py-1 rounded-full bg-current/10 text-sm font-medium">
                {confidence.toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-foreground/80">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Rekomendasi
        </h4>
        <ul className="space-y-2">
          {config.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* KNN Neighbors Detail */}
      <div className="glass-card rounded-xl p-5">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Detail K={k} Tetangga Terdekat
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Berikut adalah {k} data training terdekat yang digunakan untuk voting klasifikasi:
        </p>
        <div className="space-y-2">
          {neighbors.map((neighbor, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  neighbor.label === 'Baik' ? 'bg-success/10 text-success' :
                  neighbor.label === 'Sedang' ? 'bg-warning/10 text-warning' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {neighbor.label}
                </span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                Jarak: {neighbor.distance.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Hasil Voting:</span>{' '}
            {neighbors.filter(n => n.label === 'Baik').length} Baik,{' '}
            {neighbors.filter(n => n.label === 'Sedang').length} Sedang,{' '}
            {neighbors.filter(n => n.label === 'Buruk').length} Buruk
            {' → '}<span className="font-semibold text-primary">{prediction}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
