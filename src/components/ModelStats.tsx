import { BarChart3, Database, Target, Percent, CheckCircle2 } from 'lucide-react';
import { QualityLabel } from '@/lib/knn';

interface ModelStatsProps {
  accuracy: number | null;
  dataStats: {
    total: number;
    baik: number;
    sedang: number;
    buruk: number;
  };
  k: number;
  confusionMatrix: Record<QualityLabel, Record<QualityLabel, number>> | null;
  isLoading: boolean;
}

export function ModelStats({ accuracy, dataStats, k, confusionMatrix, isLoading }: ModelStatsProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const trainCount = Math.floor(dataStats.total * 0.8);
  const testCount = dataStats.total - trainCount;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="section-title flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        Statistik Model KNN
      </h2>
      <p className="section-subtitle">
        Performa model dengan K={k} pada dataset Internet Speed
      </p>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-primary">{accuracy?.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Akurasi Model</p>
        </div>
        <div className="stat-card text-center">
          <Database className="w-8 h-8 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-accent">{dataStats.total}</p>
          <p className="text-xs text-muted-foreground">Total Data</p>
        </div>
        <div className="stat-card text-center">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
          <p className="text-2xl font-bold text-success">{trainCount}</p>
          <p className="text-xs text-muted-foreground">Data Training (80%)</p>
        </div>
        <div className="stat-card text-center">
          <Percent className="w-8 h-8 mx-auto mb-2 text-warning" />
          <p className="text-2xl font-bold text-warning">{testCount}</p>
          <p className="text-xs text-muted-foreground">Data Testing (20%)</p>
        </div>
      </div>

      {/* Data Distribution */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-sm">Distribusi Label Data</h4>
        <div className="space-y-3">
          {[
            { label: 'Baik', count: dataStats.baik, color: 'bg-success' },
            { label: 'Sedang', count: dataStats.sedang, color: 'bg-warning' },
            { label: 'Buruk', count: dataStats.buruk, color: 'bg-destructive' }
          ].map(item => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-mono text-muted-foreground">
                  {item.count} ({((item.count / dataStats.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${(item.count / dataStats.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confusion Matrix */}
      {confusionMatrix && (
        <div>
          <h4 className="font-medium mb-3 text-sm">Confusion Matrix</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left text-muted-foreground">Actual \ Pred</th>
                  <th className="p-2 text-center text-success">Baik</th>
                  <th className="p-2 text-center text-warning">Sedang</th>
                  <th className="p-2 text-center text-destructive">Buruk</th>
                </tr>
              </thead>
              <tbody>
                {(['Baik', 'Sedang', 'Buruk'] as QualityLabel[]).map(actual => (
                  <tr key={actual} className="border-t border-border/50">
                    <td className={`p-2 font-medium ${
                      actual === 'Baik' ? 'text-success' :
                      actual === 'Sedang' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {actual}
                    </td>
                    {(['Baik', 'Sedang', 'Buruk'] as QualityLabel[]).map(pred => (
                      <td 
                        key={pred} 
                        className={`p-2 text-center font-mono ${
                          actual === pred ? 'bg-primary/10 font-semibold text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {confusionMatrix[actual][pred]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Nilai diagonal (dicetak tebal) menunjukkan prediksi yang benar
          </p>
        </div>
      )}
    </div>
  );
}
