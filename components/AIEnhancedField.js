import { useState, useEffect } from 'react';
import { analyzeField, getQualityColor, getQualityIcon } from '../utils/ai/fieldAnalyzer';
import { SparklesIcon } from "@heroicons/react/solid";

const AIEnhancedField = ({ 
  fieldName, 
  value, 
  onChange, 
  onBlur, 
  label, 
  placeholder, 
  type = 'text',
  required = false,
  className = "",
  multiline = false,
  category = null,
  subCategory = null
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleBlur = async (e) => {
    if (onBlur) onBlur(e);
    
    if (value && value.trim().length > 0) {
      setIsAnalyzing(true);
      try {
        const result = await analyzeField(fieldName, value, category, subCategory);
        setAnalysis(result);
      } catch (error) {
        console.error('Field analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Close suggestions when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.ai-suggestions-container')) {
      setShowSuggestions(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSuggestions]);

  const qualityColor = analysis ? getQualityColor(analysis.quality) : 'border-gray-100';
  const qualityIcon = analysis ? getQualityIcon(analysis.quality) : '';

  // Get AI icon color based on quality
  const getAIIconColor = (quality) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-green-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const aiIconColor = analysis ? getAIIconColor(analysis.quality) : 'text-gray-500';

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="flex-grow relative">
      <div className="flex items-center gap-2">
        <label className="text-lg font-bold">{label}</label>
        {analysis && (
          <div className="relative ai-suggestions-container">
            <button
              type="button"
              className="text-sm cursor-pointer flex items-center gap-1 p-1 rounded hover:bg-gray-50 transition-colors"
              onClick={() => setShowSuggestions(!showSuggestions)}
              title="Click to view AI suggestions"
            >
              <span className={` flex items-center justify-center text-xs
              } ${isAnalyzing ? 'animate-pulse' : ''}`}>
                <span className={`${aiIconColor} text-sm`}>
                  {isAnalyzing ? '⌛' : <SparklesIcon className="w-4 h-4" />}
                </span>
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline">AI</span>
            </button>
            
            {showSuggestions && (
              <>
                <div style={{zIndex: 1000}} className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" onClick={() => setShowSuggestions(false)} />
                <div style={{zIndex: 1001}} className="fixed inset-4 md:absolute md:left-0 md:top-6 md:inset-auto z-50 bg-white border border-gray-200 rounded-lg shadow-xl md:w-96 md:max-w-sm max-h-[80vh] md:max-h-96 overflow-y-auto p-4">
                  {/* Close button for mobile */}
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="absolute top-2 right-2 md:hidden w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-bold text-lg"
                  >
                    ×
                  </button>
                  
                  {/* Header */}
                  <div className="mb-3 pr-8 md:pr-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold">
                        Quality: {analysis.quality.charAt(0).toUpperCase() + analysis.quality.slice(1)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${qualityColor}`}>
                        {analysis.score}/100
                      </span>
                    </div>
                    
                    {/* Show strengths if any */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs font-medium text-green-600 mb-1">✓ Strengths:</div>
                        <div className="text-xs text-green-700 select-text">
                          {analysis.strengths.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                
                  <div className="text-sm text-gray-700">
                    {analysis.isGood ? (
                      <div className="text-green-700 font-medium select-text">
                        <SparklesIcon className="w-4 h-4 inline-block" /> {analysis.suggestions[0]}
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium mb-2 text-gray-800">AI Suggestions:</div>
                        <ul className="space-y-2 mb-3">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1 text-xs">•</span>
                              <span className="text-xs select-text leading-relaxed">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Show examples if available */}
                        {analysis.examples && analysis.examples.length > 0 && (
                          <div className="border-t pt-3 mt-3">
                            <div className="text-xs font-medium text-purple-600 mb-2">💡 Better Examples:</div>
                            {analysis.examples.map((example, index) => (
                              <div key={index} className="text-xs text-purple-700 mb-2 p-2 bg-purple-50 rounded border-l-2 border-purple-200 select-text">
                                "{example}"
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Show missing elements if available */}
                        {analysis.missingElements && analysis.missingElements.length > 0 && (
                          <div className="border-t pt-3 mt-3">
                            <div className="text-xs font-medium text-orange-600 mb-1">⚠️ Missing Elements:</div>
                            <div className="text-xs text-orange-700 select-text">
                              {analysis.missingElements.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <InputComponent
        type={multiline ? undefined : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        required={required}
        className={`w-full border-2 ${qualityColor} rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red transition-colors ${className}`}
        rows={multiline ? 4 : undefined}
      />
      
      {isAnalyzing && (
        <div className="absolute right-3 top-10 text-gray-400">
          <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-logo-red rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default AIEnhancedField;
