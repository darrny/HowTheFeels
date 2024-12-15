'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';

const emotionThemes = {
  admiration: { color: '#FFD700', darkColor: '#B8860B', emoji: '🌟', mood: 'admiring' },
  amusement: { color: '#FF69B4', darkColor: '#C71585', emoji: '😄', mood: 'amused' },
  anger: { color: '#FF4500', darkColor: '#8B0000', emoji: '😠', mood: 'angry' },
  annoyance: { color: '#FF6347', darkColor: '#CD5C5C', emoji: '😤', mood: 'annoyed' },
  approval: { color: '#32CD32', darkColor: '#228B22', emoji: '👍', mood: 'approving' },
  caring: { color: '#FF69B4', darkColor: '#DB7093', emoji: '🤗', mood: 'caring' },
  confusion: { color: '#9370DB', darkColor: '#483D8B', emoji: '😕', mood: 'confused' },
  curiosity: { color: '#40E0D0', darkColor: '#008B8B', emoji: '🤔', mood: 'curious' },
  desire: { color: '#FF1493', darkColor: '#C71585', emoji: '😍', mood: 'desiring' },
  disappointment: { color: '#778899', darkColor: '#4A5D75', emoji: '😞', mood: 'disappointed' },
  disapproval: { color: '#DC143C', darkColor: '#8B0000', emoji: '👎', mood: 'disapproving' },
  disgust: { color: '#8B4513', darkColor: '#654321', emoji: '🤢', mood: 'disgusted' },
  embarrassment: { color: '#DDA0DD', darkColor: '#9932CC', emoji: '😳', mood: 'embarrassed' },
  excitement: { color: '#FF4500', darkColor: '#FF0000', emoji: '🎉', mood: 'excited' },
  fear: { color: '#4B0082', darkColor: '#191970', emoji: '😨', mood: 'scared' },
  gratitude: { color: '#FFD700', darkColor: '#DAA520', emoji: '🙏', mood: 'grateful' },
  grief: { color: '#4682B4', darkColor: '#000080', emoji: '😢', mood: 'grieving' },
  joy: { color: '#FFD700', darkColor: '#FFA500', emoji: '😊', mood: 'joyful' },
  love: { color: '#FF69B4', darkColor: '#FF1493', emoji: '❤️', mood: 'loving' },
  nervousness: { color: '#E6E6FA', darkColor: '#9370DB', emoji: '😰', mood: 'nervous' },
  optimism: { color: '#FFD700', darkColor: '#FFA500', emoji: '🌈', mood: 'optimistic' },
  pride: { color: '#9370DB', darkColor: '#4B0082', emoji: '🦚', mood: 'proud' },
  realization: { color: '#40E0D0', darkColor: '#20B2AA', emoji: '💡', mood: 'enlightened' },
  relief: { color: '#98FB98', darkColor: '#3CB371', emoji: '😌', mood: 'relieved' },
  remorse: { color: '#4682B4', darkColor: '#000080', emoji: '😔', mood: 'remorseful' },
  sadness: { color: '#4682B4', darkColor: '#000080', emoji: '😢', mood: 'sad' },
  surprise: { color: '#FF69B4', darkColor: '#FF1493', emoji: '😲', mood: 'surprised' },
  neutral: { color: '#808080', darkColor: '#696969', emoji: '😐', mood: 'neutral' },
};

const allEmojis = Object.values(emotionThemes).map(theme => theme.emoji);

const EmojiRain = memo(({ emojis }: { emojis: string[] }) => {
  const [raindrops, setRaindrops] = useState<Array<{
    id: number;
    emoji: string;
    left: number;
    delay: number;
    duration: number;
    size: number;
  }>>([]);

  const createRaindrop = useCallback(() => {
    return {
      id: Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 5 + Math.random() * 7,
      size: 3 + Math.random() * 2
    };
  }, [emojis]);

  useEffect(() => {
    // Start with fewer raindrops
    const initialRaindrops = Array(10).fill(null).map(createRaindrop);
    setRaindrops(initialRaindrops);

    const interval = setInterval(() => {
      setRaindrops(prev => {
        const newDrops = [...prev];
        // Remove old drops if we have too many
        if (newDrops.length > 20) {
          newDrops.splice(0, newDrops.length - 20);
        }
        // Add a new drop
        return [...newDrops, createRaindrop()];
      });
    }, 800); // Slower interval for smoother performance

    return () => clearInterval(interval);
  }, [createRaindrop]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          style={{
            position: 'absolute',
            left: `${drop.left}%`,
            top: '-10%',
            fontSize: `${drop.size}rem`,
            opacity: 0.1,
            animation: `emojiRain ${drop.duration}s linear ${drop.delay}s infinite`,
            transform: 'translateZ(0)', // Hardware acceleration
          }}
        >
          {drop.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes emojiRain {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

EmojiRain.displayName = 'EmojiRain';

const EmotionAnalysis = () => {
  const [text, setText] = useState('');
  const [emotions, setEmotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzeEmotions(e as any);
    }
  };

  const analyzeEmotions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/emotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze emotions');
      }

      const data = await response.json();
      setEmotions(data);
    } catch (err) {
      setError('Failed to analyze emotions. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const topEmotion = emotions[0]?.label || 'neutral';
  const theme = emotionThemes[topEmotion as keyof typeof emotionThemes];

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-all duration-500"
      style={{
        background: emotions.length > 0
          ? `linear-gradient(135deg, ${theme.color}, ${theme.darkColor})`
          : '#FFFFFF',
      }}
    >
      <EmojiRain emojis={allEmojis} />

      <div className="relative min-h-screen z-10">
        <main className="max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-center mb-8 gap-4">
            <h1 
              className="text-5xl font-bold text-center"
              style={{ 
                background: 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '300% 300%',
                animation: 'rainbow-text 8s ease infinite'
              }}
            >
              HowTheFeels
            </h1>
            <span className="text-4xl">{theme.emoji}</span>
          </div>
          
          <form onSubmit={analyzeEmotions} className="space-y-6">
            <div className="relative group">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your text to analyze emotions... (Press Enter to analyze, Shift+Enter for new line)"
                className="w-full p-4 rounded-xl bg-white/90 backdrop-blur-md shadow-xl border-opacity-20 h-40 focus:outline-none focus:ring-2 transition-all duration-300 text-gray-800"
                style={{ borderColor: emotions.length > 0 ? theme.color : '#000' }}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 rounded-xl font-semibold text-white shadow-lg transform hover:scale-102 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: emotions.length > 0 
                  ? `linear-gradient(135deg, ${theme.color}, ${theme.darkColor})`
                  : 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)',
                backgroundSize: '300% 300%',
                animation: emotions.length === 0 ? 'rainbow-button 8s ease infinite' : 'none'
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Emotions'} {!loading && theme.emoji}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100/90 text-red-700 rounded-xl backdrop-blur-md">
              {error}
            </div>
          )}

          {emotions.length > 0 && (
            <div className="mt-12 space-y-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3 text-gray-800">
                  <span style={{ color: theme.color }}>{theme.emoji}</span>
                  <span>{topEmotion}</span>
                  <span style={{ color: theme.color }}>{theme.emoji}</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emotions.map((emotion) => {
                  const emotionTheme = emotionThemes[emotion.label as keyof typeof emotionThemes];
                  return (
                    <div
                      key={emotion.label}
                      className="relative group rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 bg-white/80"
                      style={{
                        borderLeft: `4px solid ${emotionTheme.color}`,
                      }}
                    >
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>{emotionTheme.emoji}</span>
                          <span className="font-medium capitalize text-gray-800">
                            {emotion.label}
                          </span>
                        </div>
                        <span className="font-mono text-gray-600">
                          {(emotion.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 h-1 transition-all duration-300"
                        style={{
                          width: `${emotion.score * 100}%`,
                          background: `linear-gradient(90deg, ${emotionTheme.color}, ${emotionTheme.darkColor})`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes rainbow-text {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        @keyframes rainbow-button {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>
  );
};

export default EmotionAnalysis;