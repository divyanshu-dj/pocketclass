// AI Field Analysis for Instructor Form Fields
// Enhanced with LangChain + Gemini AI integration - AI-only analysis

// Call LangChain-powered AI API for field analysis
const callAI = async (fieldName, value, category = null, subCategory = null) => {
  try {
    const response = await fetch('/api/ai/analyze-field', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fieldName,
        value,
        category,
        subCategory
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('AI analysis failed');
    }

    return {
      score: data.analysis.score,
      quality: data.analysis.quality_level,
      strengths: data.analysis.strengths || [],
      suggestions: data.analysis.suggestions || [],
      examples: data.analysis.examples || [],
      missingElements: data.analysis.missing_elements || [],
      personalityScore: data.analysis.personality_score,
      credibilityIndicators: data.analysis.credibility_indicators || [],
      transparencyScore: data.analysis.transparency_score,
      memorabilityScore: data.analysis.memorability_score
    };
    } catch (error) {
      console.error('AI API call failed:', error);
      
      // Fallback response when AI is unavailable
      return {
        score: 50,
        quality: 'fair',
        strengths: ["Content provided"],
        suggestions: ["AI analysis temporarily unavailable. Please try again later."],
        examples: [],
        missingElements: [],
        error: true
      };
    }
};

export const analyzeField = async (fieldName, value, category = null, subCategory = null) => {
  if (!value || value.trim().length === 0) {
    return {
      quality: 'empty',
      score: 0,
      suggestions: [`Please add content to your ${fieldName.toLowerCase()} section.`],
      strengths: [],
      examples: [],
      isGood: false
    };
  }
  
  // Use AI analysis for all content
  try {
    const aiResponse = await callAI(fieldName, value, category, subCategory);
    
    return {
      quality: aiResponse.quality,
      score: aiResponse.score,
      suggestions: aiResponse.suggestions,
      strengths: aiResponse.strengths,
      examples: aiResponse.examples || [],
      missingElements: aiResponse.missingElements || [],
      personalityScore: aiResponse.personalityScore,
      credibilityIndicators: aiResponse.credibilityIndicators,
      transparencyScore: aiResponse.transparencyScore,
      memorabilityScore: aiResponse.memorabilityScore,
      isGood: aiResponse.score >= 75,
      error: aiResponse.error || false
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      quality: 'fair',
      score: 50,
      suggestions: ["AI analysis temporarily unavailable. Please try again later."],
      strengths: ["Content provided"],
      examples: [],
      isGood: false,
      error: true
    };
  }
};

export const getQualityColor = (quality) => {
  switch (quality) {
    case 'excellent':
      return 'text-green-500 border-green-300';
    case 'good':
      return 'text-blue-500 border-blue-300';
    case 'fair':
      return 'text-yellow-500 border-yellow-300';
    case 'poor':
      return 'text-red-500 border-red-300';
    default:
      return 'text-gray-500 border-gray-300';
  }
};

export const getQualityIcon = (quality) => {
  switch (quality) {
    case 'excellent':
      return '🌟';
    case 'good':
      return '✅';
    case 'fair':
      return '⚠️';
    case 'poor':
      return '❌';
    default:
      return '◯';
  }
};
