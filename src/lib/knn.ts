// Implementasi algoritma K-Nearest Neighbor (KNN) untuk klasifikasi kualitas jaringan

export interface DataPoint {
  pingLatency: number;
  downloadSpeed: number;
  uploadSpeed: number;
  packetLossRate: number;
  signalStrength: number;
  label?: 'Baik' | 'Sedang' | 'Buruk';
}

export interface NormalizedData {
  data: DataPoint[];
  mins: number[];
  maxs: number[];
}

export type QualityLabel = 'Baik' | 'Sedang' | 'Buruk';

/**
 * Menghitung jarak Euclidean antara dua titik data
 * Formula: sqrt(sum((x[i] - y[i])^2))
 */
export function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );
}

/**
 * Normalisasi data menggunakan Min-Max Scaling
 * Formula: (x - min) / (max - min)
 */
export function normalizeData(data: DataPoint[]): NormalizedData {
  const features = data.map(d => [
    d.pingLatency,
    d.downloadSpeed,
    d.uploadSpeed,
    d.packetLossRate,
    d.signalStrength
  ]);

  const mins: number[] = [];
  const maxs: number[] = [];

  // Cari min dan max untuk setiap fitur
  for (let i = 0; i < 5; i++) {
    const values = features.map(f => f[i]);
    mins.push(Math.min(...values));
    maxs.push(Math.max(...values));
  }

  // Normalisasi setiap data point
  const normalizedData = data.map(d => ({
    ...d,
    pingLatency: (d.pingLatency - mins[0]) / (maxs[0] - mins[0] || 1),
    downloadSpeed: (d.downloadSpeed - mins[1]) / (maxs[1] - mins[1] || 1),
    uploadSpeed: (d.uploadSpeed - mins[2]) / (maxs[2] - mins[2] || 1),
    packetLossRate: (d.packetLossRate - mins[3]) / (maxs[3] - mins[3] || 1),
    signalStrength: (d.signalStrength - mins[4]) / (maxs[4] - mins[4] || 1),
  }));

  return { data: normalizedData, mins, maxs };
}

/**
 * Normalisasi satu data point menggunakan min/max yang sudah ada
 */
export function normalizePoint(point: DataPoint, mins: number[], maxs: number[]): DataPoint {
  return {
    ...point,
    pingLatency: (point.pingLatency - mins[0]) / (maxs[0] - mins[0] || 1),
    downloadSpeed: (point.downloadSpeed - mins[1]) / (maxs[1] - mins[1] || 1),
    uploadSpeed: (point.uploadSpeed - mins[2]) / (maxs[2] - mins[2] || 1),
    packetLossRate: (point.packetLossRate - mins[3]) / (maxs[3] - mins[3] || 1),
    signalStrength: (point.signalStrength - mins[4]) / (maxs[4] - mins[4] || 1),
  };
}

/**
 * Konversi DataPoint ke array fitur
 */
export function pointToArray(point: DataPoint): number[] {
  return [
    point.pingLatency,
    point.downloadSpeed,
    point.uploadSpeed,
    point.packetLossRate,
    point.signalStrength
  ];
}

/**
 * Memberi label kualitas berdasarkan Internet Speed
 * - Baik: > 1500 Mbps
 * - Sedang: 500 - 1500 Mbps
 * - Buruk: < 500 Mbps
 */
export function assignLabel(internetSpeed: number): QualityLabel {
  if (internetSpeed > 1500) return 'Baik';
  if (internetSpeed >= 500) return 'Sedang';
  return 'Buruk';
}

/**
 * Algoritma KNN untuk prediksi
 * @param trainData - Data latih yang sudah dinormalisasi
 * @param testPoint - Data point yang akan diprediksi (sudah dinormalisasi)
 * @param k - Jumlah tetangga terdekat
 */
export function knnPredict(
  trainData: DataPoint[],
  testPoint: DataPoint,
  k: number = 5
): { prediction: QualityLabel; neighbors: { distance: number; label: QualityLabel }[] } {
  const testArray = pointToArray(testPoint);

  // Hitung jarak ke semua data latih
  const distances = trainData.map(train => ({
    distance: euclideanDistance(pointToArray(train), testArray),
    label: train.label!
  }));

  // Urutkan berdasarkan jarak terdekat
  distances.sort((a, b) => a.distance - b.distance);

  // Ambil K tetangga terdekat
  const neighbors = distances.slice(0, k);

  // Voting untuk menentukan kelas
  const votes: Record<QualityLabel, number> = { 'Baik': 0, 'Sedang': 0, 'Buruk': 0 };
  neighbors.forEach(n => votes[n.label]++);

  // Tentukan kelas dengan vote terbanyak
  const prediction = (Object.entries(votes) as [QualityLabel, number][])
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return { prediction, neighbors };
}

/**
 * Membagi data menjadi training dan testing set
 * @param data - Dataset lengkap
 * @param trainRatio - Rasio data training (default 0.8 = 80%)
 */
export function splitData(data: DataPoint[], trainRatio: number = 0.8): { train: DataPoint[]; test: DataPoint[] } {
  // Shuffle data
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(shuffled.length * trainRatio);

  return {
    train: shuffled.slice(0, splitIndex),
    test: shuffled.slice(splitIndex)
  };
}

/**
 * Menghitung akurasi model
 */
export function calculateAccuracy(
  testData: DataPoint[],
  trainData: DataPoint[],
  k: number = 5
): { accuracy: number; correct: number; total: number; confusionMatrix: Record<QualityLabel, Record<QualityLabel, number>> } {
  let correct = 0;
  const confusionMatrix: Record<QualityLabel, Record<QualityLabel, number>> = {
    'Baik': { 'Baik': 0, 'Sedang': 0, 'Buruk': 0 },
    'Sedang': { 'Baik': 0, 'Sedang': 0, 'Buruk': 0 },
    'Buruk': { 'Baik': 0, 'Sedang': 0, 'Buruk': 0 }
  };

  testData.forEach(test => {
    const { prediction } = knnPredict(trainData, test, k);
    const actual = test.label!;
    
    confusionMatrix[actual][prediction]++;
    
    if (prediction === actual) {
      correct++;
    }
  });

  return {
    accuracy: (correct / testData.length) * 100,
    correct,
    total: testData.length,
    confusionMatrix
  };
}

/**
 * Parse CSV data ke DataPoint array
 */
export function parseCSVData(csvText: string): DataPoint[] {
  const lines = csvText.trim().split('\n');
  const dataPoints: DataPoint[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => parseFloat(v.trim()));
    
    if (values.length >= 13) {
      const internetSpeed = values[12]; // Last column is Internet_speed
      
      dataPoints.push({
        pingLatency: values[0],
        downloadSpeed: values[1],
        uploadSpeed: values[2],
        packetLossRate: values[3],
        signalStrength: values[10],
        label: assignLabel(internetSpeed)
      });
    }
  }

  return dataPoints;
}
