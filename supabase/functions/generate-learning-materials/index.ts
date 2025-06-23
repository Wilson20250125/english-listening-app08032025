import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoUrl } = await req.json()
    
    if (!videoUrl) {
      return new Response(
        JSON.stringify({ error: 'Video URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For now, return mock data since we can't access YouTube API directly
    // In production, you would integrate with YouTube Data API and OpenAI
    const mockResponse = generateMockLearningMaterials(videoId)

    return new Response(
      JSON.stringify(mockResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

function generateMockLearningMaterials(videoId: string) {
  // Mock data based on the self-introduction video
  if (videoId === 'QgjkjsqAzvo') {
    return {
      summary: "This video teaches how to introduce yourself professionally in English, covering essential phrases and structure for job interviews and social situations. It provides practical examples and common expressions used in self-introductions.",
      vocabulary: [
        {
          word: "introduce",
          definition: "To present yourself or someone else by giving basic information",
          translation: "介绍",
          example: "Let me introduce myself - I'm Sarah from the marketing team."
        },
        {
          word: "background",
          definition: "Your education, work experience, and personal history",
          translation: "背景",
          example: "I have a strong background in computer science and software development."
        },
        {
          word: "experience",
          definition: "Knowledge or skill gained from doing something over time",
          translation: "经验",
          example: "I have five years of experience working in customer service."
        },
        {
          word: "qualification",
          definition: "A skill, achievement, or quality that makes you suitable for a job",
          translation: "资格，资质",
          example: "My qualifications include a degree in business and several certifications."
        },
        {
          word: "strength",
          definition: "A good quality or ability that you have",
          translation: "优势，长处",
          example: "One of my key strengths is problem-solving under pressure."
        },
        {
          word: "passionate",
          definition: "Having very strong feelings about something you care about",
          translation: "热情的",
          example: "I'm passionate about helping others learn new technologies."
        },
        {
          word: "opportunity",
          definition: "A chance to do something, especially something that will help you",
          translation: "机会",
          example: "I'm excited about this opportunity to join your team."
        },
        {
          word: "professional",
          definition: "Related to work or business; showing skill and good judgment",
          translation: "专业的",
          example: "I always maintain a professional attitude in the workplace."
        },
        {
          word: "accomplish",
          definition: "To succeed in doing or completing something",
          translation: "完成，实现",
          example: "In my previous role, I accomplished all my project goals ahead of schedule."
        },
        {
          word: "contribute",
          definition: "To give something (like skills or ideas) to help achieve something",
          translation: "贡献",
          example: "I believe I can contribute valuable insights to your marketing strategy."
        }
      ]
    }
  }

  // Default mock response for other videos
  return {
    summary: "This video provides valuable English learning content with practical examples and useful expressions for everyday communication.",
    vocabulary: [
      {
        word: "example",
        definition: "Something that shows or explains a general rule or principle",
        translation: "例子",
        example: "Let me give you an example of how to use this word."
      },
      {
        word: "practice",
        definition: "To do something regularly to improve your skill",
        translation: "练习",
        example: "You need to practice speaking English every day."
      },
      {
        word: "improve",
        definition: "To become better or to make something better",
        translation: "改善，提高",
        example: "Reading books will help improve your vocabulary."
      }
    ]
  }
}