interface Vocabulary {
  word: string;
  definition: string;
  translation: string;
  example: string;
}

interface LearningMaterials {
  summary: string;
  vocabulary: Vocabulary[];
}

interface GenerateLearningMaterialsRequest {
  videoUrl: string;
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Generate mock learning materials based on video ID
 */
function generateMockLearningMaterials(videoId: string): LearningMaterials {
  // Specific mock data for the self-introduction video
  if (videoId === 'QgjkjsqAzvo') {
    return {
      summary: "This video teaches how to introduce yourself in English. It gives examples and tips for beginners.",
      vocabulary: [
        {
          word: "introduce",
          definition: "to present oneself to others",
          translation: "介绍",
          example: "Let me introduce myself to the class."
        },
        {
          word: "hobby",
          definition: "an activity done for enjoyment",
          translation: "爱好",
          example: "My hobby is playing the guitar."
        },
        {
          word: "background",
          definition: "your personal history and experience",
          translation: "背景",
          example: "I have a strong educational background in engineering."
        },
        {
          word: "experience",
          definition: "knowledge gained from doing something",
          translation: "经验",
          example: "I have three years of work experience in marketing."
        },
        {
          word: "qualification",
          definition: "skills or achievements that make you suitable for something",
          translation: "资格",
          example: "My qualifications include a university degree and professional certificates."
        },
        {
          word: "strength",
          definition: "a good quality or ability you have",
          translation: "优势",
          example: "My greatest strength is communication with people."
        },
        {
          word: "passionate",
          definition: "having strong feelings of enthusiasm about something",
          translation: "热情的",
          example: "I'm passionate about learning new languages."
        },
        {
          word: "opportunity",
          definition: "a chance to do something beneficial",
          translation: "机会",
          example: "This job is a great opportunity for my career."
        },
        {
          word: "professional",
          definition: "relating to work or showing high standards",
          translation: "专业的",
          example: "I always maintain a professional attitude at work."
        },
        {
          word: "accomplish",
          definition: "to successfully complete or achieve something",
          translation: "完成",
          example: "I accomplished all my goals for this project."
        }
      ]
    };
  }

  // Default mock response for other videos
  return {
    summary: "This video provides valuable English learning content with practical examples and useful expressions for everyday communication.",
    vocabulary: [
      {
        word: "example",
        definition: "something that shows or explains a general rule",
        translation: "例子",
        example: "Let me give you an example of how to use this word."
      },
      {
        word: "practice",
        definition: "to do something regularly to improve your skill",
        translation: "练习",
        example: "You need to practice speaking English every day."
      },
      {
        word: "improve",
        definition: "to become better or make something better",
        translation: "改善",
        example: "Reading books will help improve your vocabulary."
      },
      {
        word: "understand",
        definition: "to know the meaning of something",
        translation: "理解",
        example: "Do you understand what I'm saying?"
      },
      {
        word: "communicate",
        definition: "to share information or express thoughts",
        translation: "交流",
        example: "It's important to communicate clearly with your colleagues."
      },
      {
        word: "fluent",
        definition: "able to speak a language easily and accurately",
        translation: "流利的",
        example: "She speaks fluent English after studying for five years."
      },
      {
        word: "pronunciation",
        definition: "the way words are spoken",
        translation: "发音",
        example: "Good pronunciation helps people understand you better."
      },
      {
        word: "vocabulary",
        definition: "all the words you know in a language",
        translation: "词汇",
        example: "Reading newspapers helps expand your vocabulary."
      },
      {
        word: "grammar",
        definition: "the rules for using words correctly in a language",
        translation: "语法",
        example: "Understanding grammar rules is essential for writing well."
      },
      {
        word: "confidence",
        definition: "feeling sure about your abilities",
        translation: "信心",
        example: "Speaking practice will build your confidence in English."
      }
    ]
  };
}

/**
 * Main API function to generate learning materials
 * Simulates a POST request handler
 */
export async function generateLearningMaterials(
  request: GenerateLearningMaterialsRequest
): Promise<LearningMaterials> {
  return new Promise((resolve, reject) => {
    // Simulate API processing time
    setTimeout(() => {
      try {
        const { videoUrl } = request;
        
        if (!videoUrl) {
          reject(new Error('Video URL is required'));
          return;
        }

        // Extract video ID from YouTube URL
        const videoId = extractVideoId(videoUrl);
        
        if (!videoId) {
          reject(new Error('Invalid YouTube URL format'));
          return;
        }

        // Generate mock learning materials
        const learningMaterials = generateMockLearningMaterials(videoId);
        
        resolve(learningMaterials);
      } catch (error) {
        reject(new Error('Failed to generate learning materials'));
      }
    }, 1000); // Simulate 1 second processing time
  });
}

/**
 * Alternative function that mimics a fetch-based API call
 */
export async function fetchLearningMaterials(videoUrl: string): Promise<LearningMaterials> {
  // Simulate a fetch request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!videoUrl) {
          reject(new Error('Video URL is required'));
          return;
        }

        const videoId = extractVideoId(videoUrl);
        
        if (!videoId) {
          reject(new Error('Invalid YouTube URL'));
          return;
        }

        const materials = generateMockLearningMaterials(videoId);
        resolve(materials);
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
}

// Export types for use in other components
export type { Vocabulary, LearningMaterials, GenerateLearningMaterialsRequest };