import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { fetchLearningMaterials, type LearningMaterials } from '../api/generate-learning-materials';
import { sendChatMessage } from '../api/chat-gpt';

// ✅ 视频链接放在组件外部，确保 useEffect 不触发多次
const videoUrl = "https://www.youtube.com/watch?v=QgjkjsqAzvo";

const LearningDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    setLoadingChat(true);
    try {
      // 构建包含上下文的完整 prompt
      const promptWithContext = `
Summary: ${learningMaterials?.summary || 'No summary available'}

Vocabulary:
${learningMaterials?.vocabulary.map(item => 
  `- ${item.word} (${item.translation}): ${item.definition}
   Example: "${item.example}"`
).join('\n')}

Question: ${chatInput}
`;
      console.log("📝 发送给 AI 的完整 prompt:", promptWithContext);
      const response = await sendChatMessage(promptWithContext);
      setChatResponse(response);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setChatResponse('Sorry, I encountered an error while processing your question.');
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    console.log("✅ useEffect 正确触发一次：开始加载学习内容");

    const loadLearningMaterials = async () => {
      try {
        const materials = await fetchLearningMaterials(videoUrl);
        setLearningMaterials(materials);
        console.log("📦 学习内容加载完成：", materials);
      } catch (err) {
        console.error("❌ 加载失败：", err);
        setError("Failed to load learning materials");
      } finally {
        setLoading(false);
      }
    };

    loadLearningMaterials();
  }, []); // ✅ 只在挂载时执行一次

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Today's Learning</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* YouTube Video Player */}
          <div className="w-full max-w-6xl mx-auto aspect-[3/2] bg-black rounded-lg overflow-hidden shadow">
            <iframe
              src="https://www.youtube.com/embed/QgjkjsqAzvo"
              title="Learn English - Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h2>
            {loading ? (
              <div className="flex items-center text-gray-600">
                <Loader className="h-5 w-5 animate-spin mr-2" />
                Loading summary...
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed">{learningMaterials?.summary}</p>
            )}

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Key Vocabulary & Expressions</h2>
            {loading ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600">
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                  Loading vocabulary...
                </div>
              </div>
            ) : error ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Unable to load vocabulary at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {learningMaterials?.vocabulary.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                      <h3 className="text-lg font-semibold text-blue-800 mb-1">{item.word}</h3>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">{item.translation}</span>
                    </div>
                    <p className="text-gray-700 mb-3 leading-relaxed">{item.definition}</p>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-gray-600 italic">"{item.example}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Q&A Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask AI Assistant</h2>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any question about the video..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loadingChat || !chatInput.trim()}
                  className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingChat ? (
                    <span className="flex items-center">
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Thinking...
                    </span>
                  ) : (
                    'Ask AI'
                  )}
                </button>
              </div>
              
              {chatResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">AI Response:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{chatResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDetailsPage;
