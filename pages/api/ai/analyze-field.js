import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const FIELD_ANALYSIS_PROMPTS = {
  Name: `
You are an expert in creating engaging class titles that attract students.

### INSTRUCTIONS:
- Analyze the class name for clarity, specificity, and appeal
- Rate effectiveness on a scale of 0-100
- Provide quality level: "poor", "fair", "good", or "excellent"
- List strengths and specific improvement suggestions
- If score < 80, provide 1-2 improved example titles

### CLASS NAME TO ANALYZE:
{value}

### CONTEXT:
Category: {category}
SubCategory: {subCategory}

### RESPONSE FORMAT (JSON):
{{
  "score": number (0-100),
  "quality_level": "poor|fair|good|excellent",
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "examples": ["Better Title 1", "Better Title 2"]
}}
`,

  Description: `
You are an expert in writing compelling class descriptions that convert browsers into students.

### INSTRUCTIONS:
- Analyze for learning outcomes, specific skills, class atmosphere, and target audience
- Rate effectiveness on a scale of 0-100
- Provide quality level and specific improvements
- Focus on clarity, enthusiasm, and student value

### CLASS DESCRIPTION TO ANALYZE:
{value}

### CONTEXT:
Category: {category}
SubCategory: {subCategory}

### RESPONSE FORMAT (JSON):
{{
  "score": number (0-100),
  "quality_level": "poor|fair|good|excellent",
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "missing_elements": ["element1", "element2"]
}}
`,

  About: `
You are an expert in crafting instructor bios that build trust and connection.

### INSTRUCTIONS:
- Analyze for teaching passion, personal connection, credibility, and warmth
- Rate effectiveness on a scale of 0-100
- Provide personality score (0-10) for how well it shows character
- Focus on trust-building and relatability

### INSTRUCTOR BIO TO ANALYZE:
{value}

### CONTEXT:
Category: {category}
SubCategory: {subCategory}

### RESPONSE FORMAT (JSON):
{{
  "score": number (0-100),
  "quality_level": "poor|fair|good|excellent",
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "personality_score": number (0-10)
}}
`,

  Experience: `
You are an expert in presenting professional experience that builds credibility.

### INSTRUCTIONS:
- Analyze for years of experience, certifications, teaching venues, and achievements
- Rate effectiveness on a scale of 0-100
- Identify credibility indicators present
- Balance confidence with humility

### EXPERIENCE SECTION TO ANALYZE:
{value}

### CONTEXT:
Category: {category}
SubCategory: {subCategory}

### RESPONSE FORMAT (JSON):
{{
  "score": number (0-100),
  "quality_level": "poor|fair|good|excellent",
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "credibility_indicators": ["indicator1", "indicator2"]
}}
`,

  Pricing: `
You are an expert in transparent, value-focused pricing communication.

### INSTRUCTIONS:
- Analyze for clarity, value proposition, discount information, and friendly tone
- Rate effectiveness on a scale of 0-100
- Provide transparency score (0-10) for how clear and honest it feels
- Focus on building trust around pricing

### PRICING DESCRIPTION TO ANALYZE:
{value}

### CONTEXT:
Category: {category}
SubCategory: {subCategory}

### RESPONSE FORMAT (JSON):
{{
  "score": number (0-100),
  "quality_level": "poor|fair|good|excellent",
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "transparency_score": number (0-10)
}}
`,

  FunFact: `
You are an expert in creating memorable, charming fun facts that show personality.

### INSTRUCTIONS:
- Analyze for surprise factor, personality, teaching connection, and authenticity
- Rate effectiveness on a scale of 0-100
- Provide memorability score (0-10) for how engaging and memorable it is
- Focus on building personal connection

### FUN FACT TO ANALYZE:
{value}

### CONTEXT:
Category: {category}
SubCategory: {subCategory}

### RESPONSE FORMAT (JSON):
{{
  "score": number (0-100),
  "quality_level": "poor|fair|good|excellent",
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "memorability_score": number (0-10)
}}
`
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fieldName, value, category = '', subCategory = '' } = req.body;

    if (!fieldName || !value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const promptTemplate = FIELD_ANALYSIS_PROMPTS[fieldName];
    if (!promptTemplate) {
      return res.status(400).json({ error: 'Invalid field name' });
    }

    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Initialize the LLM with Gemini 1.5 Flash
    const llm = new ChatGoogleGenerativeAI({
      apiKey,
      model: "gemini-1.5-flash",
      maxOutputTokens: 512,
      temperature: 0.3,
    });

    // Create the prompt template
    const prompt = PromptTemplate.fromTemplate(promptTemplate);

    // Create the chain with JSON output parser
    const chain = RunnableSequence.from([
      prompt,
      llm,
      new JsonOutputParser(),
    ]);

    // Run the chain
    const analysis = await chain.invoke({
      value,
      category: category || 'General',
      subCategory: subCategory || 'Not specified'
    });

    // Validate and sanitize the response
    const sanitizedAnalysis = {
      score: Math.max(0, Math.min(100, analysis.score || 50)),
      quality_level: analysis.quality_level || 'fair',
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : ['Consider enhancing this section.'],
      examples: analysis.examples || [],
      missing_elements: analysis.missing_elements || [],
      personality_score: analysis.personality_score,
      credibility_indicators: analysis.credibility_indicators || [],
      transparency_score: analysis.transparency_score,
      memorability_score: analysis.memorability_score
    };

    res.status(200).json({
      success: true,
      analysis: sanitizedAnalysis,
      fieldName,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analyze-field API:', error);
    
    // Return fallback response
    res.status(200).json({
      success: true,
      analysis: {
        score: 50,
        quality_level: "fair",
        strengths: ["Content provided"],
        suggestions: ["AI analysis temporarily unavailable. Consider adding more detail."],
        examples: [],
        missing_elements: []
      },
      fieldName: req.body.fieldName,
      timestamp: new Date().toISOString()
    });
  }
}