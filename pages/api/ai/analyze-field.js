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
Suggest improvements that:
- Clarify what students will learn
- Highlight specific techniques, topics, or skills covered
- Communicate the vibe of the class (fun, supportive, intense, etc.)
- Mention who this class is ideal for (beginners, kids, etc.)
- Encourage clarity and enthusiasm in tone
- Include logistic details like how to get to the class, what to bring, etc.
- Should include what the student needs to prepare(clothing, instruments, etc.)
- Note: Do not include a call to action

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
Suggest how to improve this section to make it feel more personal, passionate, and trust-building. Encourage them to mention:
- Their teaching style
- What excites them about this subject
- Why they love working with students
- Any personal story that adds warmth
- Note: Do not include a call to action

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
Suggest ways to strengthen this section by adding:
- Years of experience
- Certifications, awards, or credentials
- Where they’ve taught before (e.g., schools, clubs)
- Types of students they've taught (age, level)
- Any unique expertise or achievements
- Note: Do not include a call to action

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
Provide suggestions to:
- Clarify any group pricing, discounts, or bundles
- Reassure students about the value they’re getting
- Use friendly, transparent language
- Note: Do not include a call to action

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
Suggest how to make this more fun, light-hearted, or surprising. Ideas could include:
- A memorable student experience
- A quirky hobby
- An unexpected talent or background
- Note: Do not include a call to action

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
      model: "gemini-2.0-flash",
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