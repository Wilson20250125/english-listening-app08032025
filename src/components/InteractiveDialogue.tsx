import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { sendChatMessage } from '../api/chat-gpt';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Send, Save, X, CheckCircle } from 'lucide-react';
import { DialogueMessage, Evaluation } from '../types';
import VoiceInput from './VoiceInput';
import VoiceOutput from './VoiceOutput';

interface InteractiveDialogueProps {
  lessonTitle: string;
  lessonDescription: string;
  videoUrl?: string;
}

const InteractiveDialogue: React.FC<InteractiveDialogueProps> = ({
  lessonTitle,
  lessonDescription,
  videoUrl
}) => {
  const { id: lesson_id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 语音功能状态
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [lastAIResponse, setLastAIResponse] = useState('');

  // 初始化对话
  useEffect(() => {
    if (!isInitialized && lessonTitle && lessonDescription) {
      initializeDialogue();
    }
  }, [isInitialized, lessonTitle, lessonDescription]);

  const initializeDialogue = async () => {
    setIsLoading(true);
    try {
      const initialPrompt = `You are an English language tutor starting a conversation with a student about a video lesson. 

Video Title: ${lessonTitle}
Video Description: ${lessonDescription}

Provide a natural, friendly introduction that includes:
- A brief summary of what this video teaches (1 sentence)
- A simple question to start the conversation (1 sentence)

Write as if you're talking naturally to a student - no numbering, no formal structure. Keep it friendly and conversational, maximum 2 sentences total.`;

      const response = await sendChatMessage(initialPrompt);
      
      const initialMessage: DialogueMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      setLastAIResponse(initialMessage.content);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize dialogue:', error);
      // 设置默认消息
      const defaultMessage: DialogueMessage = {
        role: 'assistant',
        content: `Welcome! I'm here to help you understand this video about ${lessonTitle}. 

This video teaches ${lessonDescription}.

What did you learn from this video?`,
        timestamp: new Date()
      };
      setMessages([defaultMessage]);
      setLastAIResponse(defaultMessage.content);
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: DialogueMessage = {
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // 构建对话历史
      const conversationHistory = messages
        .concat(userMessage)
        .map(msg => `${msg.role === 'assistant' ? 'Tutor' : 'Student'}: ${msg.content}`)
        .join('\n\n');

      const prompt = `You are an English language tutor having a natural conversation with a student about this video:

Video Title: ${lessonTitle}
Video Description: ${lessonDescription}

Conversation so far:
${conversationHistory}

Based on the student's response, provide a natural, conversational reply that includes:
- A brief feedback or encouragement (1 sentence)
- A follow-up question to continue the conversation (1 sentence)

Write as if you're talking naturally to a student - no numbering, no formal structure. Keep it friendly and conversational, maximum 2 sentences total.`;

      const response = await sendChatMessage(prompt);
      
          const assistantMessage: DialogueMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setLastAIResponse(response);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: DialogueMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEvaluation = async () => {
    setIsLoading(true);
    try {
      const conversationText = messages
        .map(msg => `${msg.role === 'assistant' ? 'Tutor' : 'Student'}: ${msg.content}`)
        .join('\n\n');

      const evaluationPrompt = `As an English language tutor, evaluate this student's understanding based on our conversation about this video:

Video Title: ${lessonTitle}
Video Description: ${lessonDescription}

Conversation:
${conversationText}

Please provide a comprehensive evaluation with scores (0-100) and feedback for:
1. Accuracy (how correct their understanding is)
2. Main Idea Understanding (grasp of core concepts)
3. Detail Tracking (attention to specific details)
4. Vocabulary Usage (appropriate word choice)
5. Emotional Understanding (comprehension of tone/context)

Format your response as JSON:
{
  "accuracy": [score],
  "mainIdea": [score],
  "detailTracking": [score],
  "vocabulary": [score],
  "emotionalUnderstanding": [score],
  "overallFeedback": "[2-3 sentences of constructive feedback]"
}

Be encouraging but honest in your assessment.`;

      const response = await sendChatMessage(evaluationPrompt);
      
      try {
        const evaluationData = JSON.parse(response);
        setEvaluation(evaluationData);
        setShowEvaluation(true);
      } catch (parseError) {
        console.error('Failed to parse evaluation:', parseError);
        // 设置默认评估
        setEvaluation({
          accuracy: 75,
          mainIdea: 80,
          detailTracking: 70,
          vocabulary: 75,
          emotionalUnderstanding: 80,
          overallFeedback: "Good effort! You showed understanding of the main concepts. Keep practicing to improve your vocabulary and attention to details."
        });
        setShowEvaluation(true);
      }
    } catch (error) {
      console.error('Failed to generate evaluation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToSupabase = async () => {
    if (!user || !lesson_id || !evaluation) return;
    
    setIsSaving(true);
    try {
      // 将对话内容格式化为文本
      const dialogueText = messages
        .map(msg => `${msg.role === 'assistant' ? 'Tutor' : 'Student'}: ${msg.content}`)
        .join('\n\n');
      
      // 将评估内容格式化为文本
      const evaluationText = `Evaluation Results:
Accuracy: ${evaluation.accuracy}/100
Main Idea Understanding: ${evaluation.mainIdea}/100
Detail Tracking: ${evaluation.detailTracking}/100
Vocabulary Usage: ${evaluation.vocabulary}/100
Emotional Understanding: ${evaluation.emotionalUnderstanding}/100

Overall Feedback: ${evaluation.overallFeedback}`;

      const conversationData = {
        lesson_id: lesson_id,
        question_id: 'interactive-dialogue', // 使用固定值标识这是对话系统
        user_id: user.id,
        dialogue_record: dialogueText,
        feedback: evaluationText,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('student_answers')
        .insert([conversationData]);

      if (error) {
        console.error('Failed to save conversation:', error);
        throw error;
      }

      console.log('✅ Conversation saved successfully to student_answers table');
    } catch (error) {
      console.error('Error saving conversation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (messages.length <= 1) {
      // 如果只有初始消息，直接生成评估
      await generateEvaluation();
    } else {
      // 如果有对话，先发送最后一条消息，然后生成评估
      await handleSendMessage();
      setTimeout(generateEvaluation, 1000);
    }
  };

  const handleSave = async () => {
    if (!evaluation) {
      await generateEvaluation();
    }
    await saveToSupabase();
  };

  // 处理语音输入
  const handleVoiceInput = (transcript: string) => {
    setCurrentInput(transcript);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Learning Dialogue</h2>
      
      {/* 语音输出控制 - 右上角 */}
      <div className="absolute top-4 right-4">
        <VoiceOutput
          text={lastAIResponse}
          enabled={voiceOutputEnabled}
          onToggle={setVoiceOutputEnabled}
          speed={voiceSpeed}
          onSpeedChange={setVoiceSpeed}
        />
      </div>
      
      {/* 对话区域 */}
      <div className="space-y-4 mb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="flex space-x-2 mb-4">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Type your response..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={isLoading}
        />
        <VoiceInput 
          onTranscript={handleVoiceInput}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !currentInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Submit & Get Evaluation
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isSaving ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </button>
      </div>

      {/* 评估弹窗 */}
      {showEvaluation && evaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Learning Evaluation</h3>
              <button
                onClick={() => setShowEvaluation(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 评分项 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Accuracy</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${evaluation.accuracy}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{evaluation.accuracy}/100</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Main Idea Understanding</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${evaluation.mainIdea}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{evaluation.mainIdea}/100</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Detail Tracking</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${evaluation.detailTracking}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{evaluation.detailTracking}/100</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Vocabulary Usage</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${evaluation.vocabulary}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{evaluation.vocabulary}/100</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-2">Emotional Understanding</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${evaluation.emotionalUnderstanding}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{evaluation.emotionalUnderstanding}/100</span>
                  </div>
                </div>
              </div>
              
              {/* 总体反馈 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Overall Feedback</h4>
                <p className="text-blue-700">{evaluation.overallFeedback}</p>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEvaluation(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={saveToSupabase}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSaving ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDialogue; 