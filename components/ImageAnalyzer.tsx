'use client';

import { useState } from 'react';

export default function ImageAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Preview gambar
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Reset hasil sebelumnya
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze image');
      }

      setAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error analyzing image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Image Analyzer with Gemini</h1>
      
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {previewUrl && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Preview:</h2>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full h-auto rounded-md border"
          />
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleAnalyze}
          disabled={loading || !selectedFile}
          className={`px-4 py-2 rounded-md ${
            loading || !selectedFile
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {analysis && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}