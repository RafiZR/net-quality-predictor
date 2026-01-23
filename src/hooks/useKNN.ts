import { useState, useEffect, useCallback } from 'react';
import {
  DataPoint,
  parseCSVData,
  normalizeData,
  normalizePoint,
  splitData,
  knnPredict,
  calculateAccuracy,
  QualityLabel
} from '@/lib/knn';

interface KNNState {
  isLoading: boolean;
  error: string | null;
  accuracy: number | null;
  trainData: DataPoint[];
  testData: DataPoint[];
  mins: number[];
  maxs: number[];
  dataStats: {
    total: number;
    baik: number;
    sedang: number;
    buruk: number;
  };
  confusionMatrix: Record<QualityLabel, Record<QualityLabel, number>> | null;
}

interface PredictionResult {
  prediction: QualityLabel;
  neighbors: { distance: number; label: QualityLabel }[];
  confidence: number;
}

export function useKNN(k: number = 5) {
  const [state, setState] = useState<KNNState>({
    isLoading: true,
    error: null,
    accuracy: null,
    trainData: [],
    testData: [],
    mins: [],
    maxs: [],
    dataStats: { total: 0, baik: 0, sedang: 0, buruk: 0 },
    confusionMatrix: null
  });

  // Load and process CSV data
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/Internet_Speed.csv');
        if (!response.ok) throw new Error('Gagal memuat dataset');
        
        const csvText = await response.text();
        const rawData = parseCSVData(csvText);

        // Calculate data statistics
        const dataStats = {
          total: rawData.length,
          baik: rawData.filter(d => d.label === 'Baik').length,
          sedang: rawData.filter(d => d.label === 'Sedang').length,
          buruk: rawData.filter(d => d.label === 'Buruk').length
        };

        // Split data 80% training, 20% testing
        const { train, test } = splitData(rawData, 0.8);

        // Normalize training data
        const { data: normalizedTrain, mins, maxs } = normalizeData(train);

        // Normalize test data using same min/max
        const normalizedTest = test.map(point => normalizePoint(point, mins, maxs));

        // Calculate accuracy
        const accuracyResult = calculateAccuracy(normalizedTest, normalizedTrain, k);

        setState({
          isLoading: false,
          error: null,
          accuracy: accuracyResult.accuracy,
          trainData: normalizedTrain,
          testData: normalizedTest,
          mins,
          maxs,
          dataStats,
          confusionMatrix: accuracyResult.confusionMatrix
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Terjadi kesalahan'
        }));
      }
    }

    loadData();
  }, [k]);

  // Prediction function
  const predict = useCallback((input: {
    pingLatency: number;
    downloadSpeed: number;
    uploadSpeed: number;
    packetLossRate: number;
    signalStrength: number;
  }): PredictionResult | null => {
    if (state.trainData.length === 0) return null;

    const inputPoint: DataPoint = {
      pingLatency: input.pingLatency,
      downloadSpeed: input.downloadSpeed,
      uploadSpeed: input.uploadSpeed,
      packetLossRate: input.packetLossRate,
      signalStrength: input.signalStrength
    };

    // Normalize input
    const normalizedInput = normalizePoint(inputPoint, state.mins, state.maxs);

    // Get prediction
    const result = knnPredict(state.trainData, normalizedInput, k);

    // Calculate confidence (percentage of neighbors with same label)
    const votesForPrediction = result.neighbors.filter(n => n.label === result.prediction).length;
    const confidence = (votesForPrediction / k) * 100;

    return {
      ...result,
      confidence
    };
  }, [state.trainData, state.mins, state.maxs, k]);

  return {
    ...state,
    predict,
    k
  };
}
