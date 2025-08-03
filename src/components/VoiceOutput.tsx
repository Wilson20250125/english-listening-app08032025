import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';

interface VoiceOutputProps {
  text: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  speed: 'slow' | 'normal' | 'fast';
  onSpeedChange: (speed: 'slow' | 'normal' | 'fast') => void;
}

const VoiceOutput: React.FC<VoiceOutputProps> = ({
  text,
  enabled,
  onToggle,
  speed,
  onSpeedChange,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (enabled && text && !isSpeaking) {
      speakText(text);
    }
  }, [text, enabled]);

  const speakText = (textToSpeak: string) => {
    if (!enabled || !textToSpeak.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set voice to English
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // Set speed
    const speedMap = {
      slow: 0.7,
      normal: 1.0,
      fast: 1.3,
    };
    utterance.rate = speedMap[speed];

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleToggle = () => {
    if (enabled && isSpeaking) {
      stopSpeaking();
    }
    onToggle(!enabled);
  };

  return (
    <div className="relative">
      {/* 主开关按钮 */}
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full transition-all duration-200 ${
          enabled
            ? isSpeaking
              ? 'bg-green-500 text-white animate-pulse'
              : 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
        }`}
        title={enabled ? '关闭语音输出' : '开启语音输出'}
      >
        {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>

      {/* 设置按钮 */}
      {enabled && (
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          title="语音设置"
        >
          <Settings className="h-4 w-4" />
        </button>
      )}

      {/* 设置面板 */}
      {showSettings && enabled && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[150px]">
          <div className="text-sm font-medium text-gray-700 mb-2">语速设置</div>
          <div className="space-y-1">
            {(['slow', 'normal', 'fast'] as const).map((speedOption) => (
              <label key={speedOption} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="speed"
                  value={speedOption}
                  checked={speed === speedOption}
                  onChange={() => onSpeedChange(speedOption)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-600">
                  {speedOption === 'slow' ? '慢速' : speedOption === 'normal' ? '正常' : '快速'}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceOutput; 