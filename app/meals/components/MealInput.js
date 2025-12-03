'use client';

import { useState, useRef } from 'react';

export default function MealInput({ onAnalyze, loading }) {
  const [inputType, setInputType] = useState('text'); // 'text' or 'image'
  const [textDescription, setTextDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeClick = () => {
    if (inputType === 'text' && textDescription.trim()) {
      onAnalyze('text', textDescription);
    } else if (inputType === 'image' && imageFile) {
      // For image, we'll need to upload to a service or convert to base64/data URL
      // For simplicity, we'll pass the data URL for now
      onAnalyze('image', imagePreview);
    }
  };

  const canAnalyze = (inputType === 'text' && textDescription.trim()) || 
                     (inputType === 'image' && imageFile);

  return (
    <div className="bg-[#1C2431] rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Log Your Meal</h2>
      
      {/* Input Type Selector */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          className={`pb-2 px-4 font-medium ${inputType === 'text' ? 'text-[#00C48C] border-b-2 border-[#00C48C]' : 'text-gray-400'}`}
          onClick={() => setInputType('text')}
        >
          Text Description
        </button>
        <button
          className={`pb-2 px-4 font-medium ${inputType === 'image' ? 'text-[#00C48C] border-b-2 border-[#00C48C]' : 'text-gray-400'}`}
          onClick={() => setInputType('image')}
        >
          Image Upload
        </button>
      </div>

      {/* Text Input */}
      {inputType === 'text' && (
        <div className="mb-4">
          <label htmlFor="mealDescription" className="block text-sm font-medium mb-2">
            Describe your meal
          </label>
          <textarea
            id="mealDescription"
            rows="4"
            className="w-full p-3 bg-[#0E141B] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#00C48C] focus:border-transparent"
            placeholder="e.g., Grilled chicken with rice and vegetables..."
            value={textDescription}
            onChange={(e) => setTextDescription(e.target.value)}
            disabled={loading}
          />
        </div>
      )}

      {/* Image Input */}
      {inputType === 'image' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Upload meal photo
          </label>
          <div 
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#00C48C]/50 transition-colors"
            onClick={handleUploadClick}
          >
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Meal preview" 
                  className="max-h-48 mx-auto rounded-lg object-contain"
                />
                <p className="mt-2 text-sm text-gray-400">Click to change image</p>
              </div>
            ) : (
              <div>
                <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400">Click to upload an image</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
        </div>
      )}

      {/* Analyze Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          canAnalyze && !loading
            ? 'bg-[#00C48C] hover:bg-[#00C48C]/90 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
        onClick={handleAnalyzeClick}
        disabled={!canAnalyze || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Meal'}
      </button>
    </div>
  );
}