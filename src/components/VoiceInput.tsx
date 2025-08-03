import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // 检查浏览器是否支持语音识别
  const isSpeechRecognitionSupported = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // 初始化浏览器语音识别
  const initSpeechRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      throw new Error('浏览器不支持语音识别');
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsProcessing(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      alert(`语音识别错误: ${event.error}`);
      setIsProcessing(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      setIsProcessing(false);
    };
    
    recognitionRef.current = recognition;
    return recognition;
  };

  const startRecording = async () => {
    try {
      // 优先使用浏览器内置语音识别
      if (isSpeechRecognitionSupported()) {
        const recognition = initSpeechRecognition();
        recognition.start();
        setIsRecording(true);
        setIsProcessing(true);
        return;
      }

      // 备选方案：使用 MediaRecorder + Google Cloud API
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 尝试使用更兼容的音频格式
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';
      
      const options = { mimeType };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        
        try {
          const transcript = await transcribeAudio(audioBlob);
          if (transcript) {
            onTranscript(transcript);
          } else {
            alert('未能识别到语音内容，请重试');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          const errorMessage = error instanceof Error ? error.message : '未知错误';
          alert(`语音识别失败: ${errorMessage}`);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      return;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Cloud API key not found');
    }

    console.log('Audio blob size:', audioBlob.size, 'bytes');
    console.log('Audio blob type:', audioBlob.type);

    // Convert audio to base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // 根据音频类型确定编码格式
    let encoding = 'WEBM_OPUS';
    let sampleRateHertz = 48000;
    
    if (audioBlob.type.includes('mp4')) {
      encoding = 'MP3';
      sampleRateHertz = 44100;
    } else if (audioBlob.type.includes('wav')) {
      encoding = 'LINEAR16';
      sampleRateHertz = 16000;
    }

    const requestBody = {
      config: {
        encoding,
        sampleRateHertz,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      },
      audio: {
        content: base64Audio,
      },
    };

    console.log('Sending request to Google Speech API with encoding:', encoding);

    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response error:', response.status, errorText);
      throw new Error(`Speech-to-Text API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.results && data.results.length > 0) {
      const transcript = data.results[0].alternatives[0].transcript;
      console.log('Transcription result:', transcript);
      return transcript;
    }
    
    console.log('No transcription results found');
    return '';
  };

  const handleClick = () => {
    if (disabled || isProcessing) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={`p-2 rounded-full transition-all duration-200 ${
        isRecording
          ? 'bg-red-500 text-white animate-pulse'
          : isProcessing
          ? 'bg-gray-400 text-white'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isRecording ? '停止录音' : isProcessing ? '处理中...' : '开始语音输入'}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
};

export default VoiceInput; 