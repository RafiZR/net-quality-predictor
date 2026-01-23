import { useState } from 'react';
import { Header } from '@/components/Header';
import { InputForm } from '@/components/InputForm';
import { PredictionResult } from '@/components/PredictionResult';
import { ModelStats } from '@/components/ModelStats';
import { KNNExplanation } from '@/components/KNNExplanation';
import { useKNN } from '@/hooks/useKNN';
import { QualityLabel } from '@/lib/knn';
import { Loader2, AlertCircle } from 'lucide-react';

const Index = () => {
  const K_VALUE = 5;
  const { isLoading, error, accuracy, dataStats, confusionMatrix, predict, k } = useKNN(K_VALUE);
  
  const [predictionResult, setPredictionResult] = useState<{
    prediction: QualityLabel;
    confidence: number;
    neighbors: { distance: number; label: QualityLabel }[];
  } | null>(null);

  const handleSubmit = (data: {
    pingLatency: number;
    downloadSpeed: number;
    uploadSpeed: number;
    packetLossRate: number;
    signalStrength: number;
  }) => {
    const result = predict(data);
    if (result) {
      setPredictionResult(result);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat dan memproses dataset...</p>
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Input & Result */}
            <div className="lg:col-span-2 space-y-6">
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
              
              {predictionResult && (
                <PredictionResult
                  prediction={predictionResult.prediction}
                  confidence={predictionResult.confidence}
                  neighbors={predictionResult.neighbors}
                  k={k}
                />
              )}
            </div>

            {/* Right Column - Stats & Explanation */}
            <div className="space-y-6">
              <ModelStats
                accuracy={accuracy}
                dataStats={dataStats}
                k={k}
                confusionMatrix={confusionMatrix}
                isLoading={isLoading}
              />
              
              <KNNExplanation />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 py-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Sistem Pakar Klasifikasi Kualitas Jaringan • Algoritma K-Nearest Neighbor (K={K_VALUE})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Dataset: Internet Speed • {dataStats.total} records • Akurasi: {accuracy?.toFixed(1)}%
            </p>
          </footer>
        </main>
      )}
    </div>
  );
};

export default Index;
