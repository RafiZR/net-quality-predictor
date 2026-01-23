import { useState } from 'react';
import { Activity, Download, Upload, Zap, Signal, Search } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: {
    pingLatency: number;
    downloadSpeed: number;
    uploadSpeed: number;
    packetLossRate: number;
    signalStrength: number;
  }) => void;
  isLoading: boolean;
}

interface FormField {
  key: string;
  label: string;
  icon: React.ReactNode;
  unit: string;
  placeholder: string;
  min: number;
  max: number;
  step: number;
}

const formFields: FormField[] = [
  {
    key: 'pingLatency',
    label: 'Ping / Latency',
    icon: <Activity className="w-5 h-5" />,
    unit: 'ms',
    placeholder: 'Contoh: 25',
    min: 0,
    max: 500,
    step: 0.1
  },
  {
    key: 'downloadSpeed',
    label: 'Download Speed',
    icon: <Download className="w-5 h-5" />,
    unit: 'Mbps',
    placeholder: 'Contoh: 50',
    min: 0,
    max: 1000,
    step: 0.1
  },
  {
    key: 'uploadSpeed',
    label: 'Upload Speed',
    icon: <Upload className="w-5 h-5" />,
    unit: 'Mbps',
    placeholder: 'Contoh: 25',
    min: 0,
    max: 500,
    step: 0.1
  },
  {
    key: 'packetLossRate',
    label: 'Packet Loss',
    icon: <Zap className="w-5 h-5" />,
    unit: '%',
    placeholder: 'Contoh: 0.5',
    min: 0,
    max: 100,
    step: 0.01
  },
  {
    key: 'signalStrength',
    label: 'Signal Strength',
    icon: <Signal className="w-5 h-5" />,
    unit: '%',
    placeholder: 'Contoh: 85',
    min: 0,
    max: 100,
    step: 0.1
  }
];

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [values, setValues] = useState<Record<string, string>>({
    pingLatency: '',
    downloadSpeed: '',
    uploadSpeed: '',
    packetLossRate: '',
    signalStrength: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    formFields.forEach(field => {
      const value = values[field.key];
      if (!value || value.trim() === '') {
        newErrors[field.key] = 'Wajib diisi';
      } else {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          newErrors[field.key] = 'Harus berupa angka';
        } else if (numValue < field.min || numValue > field.max) {
          newErrors[field.key] = `Nilai harus antara ${field.min} - ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    onSubmit({
      pingLatency: parseFloat(values.pingLatency),
      downloadSpeed: parseFloat(values.downloadSpeed),
      uploadSpeed: parseFloat(values.uploadSpeed),
      packetLossRate: parseFloat(values.packetLossRate),
      signalStrength: parseFloat(values.signalStrength)
    });
  };

  const fillSampleData = (type: 'good' | 'medium' | 'bad') => {
    const samples = {
      good: { pingLatency: '12', downloadSpeed: '85', uploadSpeed: '35', packetLossRate: '0.2', signalStrength: '92' },
      medium: { pingLatency: '35', downloadSpeed: '45', uploadSpeed: '20', packetLossRate: '0.8', signalStrength: '75' },
      bad: { pingLatency: '80', downloadSpeed: '15', uploadSpeed: '8', packetLossRate: '2.5', signalStrength: '55' }
    };
    setValues(samples[type]);
    setErrors({});
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="section-title flex items-center gap-2">
        <Signal className="w-6 h-6 text-primary" />
        Input Parameter Jaringan
      </h2>
      <p className="section-subtitle">
        Masukkan data parameter jaringan internet untuk diprediksi kualitasnya
      </p>

      {/* Sample data buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Contoh data:</span>
        <button
          type="button"
          onClick={() => fillSampleData('good')}
          className="px-3 py-1 text-xs rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors"
        >
          Jaringan Baik
        </button>
        <button
          type="button"
          onClick={() => fillSampleData('medium')}
          className="px-3 py-1 text-xs rounded-full bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
        >
          Jaringan Sedang
        </button>
        <button
          type="button"
          onClick={() => fillSampleData('bad')}
          className="px-3 py-1 text-xs rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          Jaringan Buruk
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map(field => (
            <div key={field.key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="text-primary">{field.icon}</span>
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={values[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  step={field.step}
                  className={`input-field pr-14 ${errors[field.key] ? 'border-destructive focus:ring-destructive/30' : ''}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                  {field.unit}
                </span>
              </div>
              {errors[field.key] && (
                <p className="text-xs text-destructive">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
        >
          <Search className="w-5 h-5" />
          {isLoading ? 'Memproses...' : 'Prediksi Kualitas Jaringan'}
        </button>
      </form>
    </div>
  );
}
