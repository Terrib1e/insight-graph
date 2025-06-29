'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Sparkles, Lightbulb, Rocket, Brain } from 'lucide-react';

interface TopicInputProps {
  onGenerate: (topics: string[]) => void;
  isLoading?: boolean;
}

export function TopicInput({ onGenerate, isLoading = false }: TopicInputProps) {
  const [topics, setTopics] = useState<string[]>(['']);
  const [currentInput, setCurrentInput] = useState('');

  const addTopic = () => {
    if (currentInput.trim()) {
      setTopics([...topics.filter(t => t.trim()), currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleGenerate = () => {
    const validTopics = [...topics.filter(t => t.trim()), currentInput.trim()].filter(Boolean);
    if (validTopics.length > 0) {
      onGenerate(validTopics);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        addTopic();
      } else {
        handleGenerate();
      }
    }
  };

  const clearAll = () => {
    setTopics(['']);
    setCurrentInput('');
  };

  const validTopics = [...topics.filter(t => t.trim()), currentInput.trim()].filter(Boolean);

  const exampleTopics = [
    { text: 'Machine Learning', icon: Brain },
    { text: 'Quantum Physics', icon: Rocket },
    { text: 'Climate Change', icon: Lightbulb },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">What would you like to explore?</h2>
        </div>
        <p className="text-gray-600 max-w-xl mx-auto">
          Enter one or more topics to create your personalized knowledge graph
        </p>
      </div>

      <div className="space-y-3">
        {/* Existing topics */}
        {topics.map((topic, index) => (
          topic.trim() && (
            <div key={index} className="flex items-center gap-2 animate-slide-up">
              <div className="flex-1 relative group">
                <Input
                  value={topic}
                  onChange={(e) => updateTopic(index, e.target.value)}
                  placeholder={`Topic ${index + 1}`}
                  className="pl-4 pr-12 py-3 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all-smooth"
                  onKeyPress={handleKeyPress}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTopic(index)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        ))}

        {/* Current input */}
        <div className="flex items-center gap-2 animate-slide-up">
          <div className="flex-1 relative">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={validTopics.length === 0 ? "e.g., Artificial Intelligence, Space Exploration..." : "Add another topic..."}
              className="pl-4 pr-12 py-3 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all-smooth"
              onKeyPress={handleKeyPress}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={addTopic}
                disabled={!currentInput.trim()}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Example topics */}
        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-3">Need inspiration? Try these:</p>
          <div className="flex flex-wrap gap-2">
            {exampleTopics.map(({ text, icon: Icon }) => (
              <Button
                key={text}
                variant="outline"
                size="sm"
                onClick={() => setCurrentInput(text)}
                className="group border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all-smooth"
              >
                <Icon className="h-3 w-3 mr-1.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{text}</span>
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const moreTopics = ['Blockchain', 'Neuroscience', 'Renaissance Art'];
                setCurrentInput(moreTopics[Math.floor(Math.random() * moreTopics.length)]);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              More...
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        <Button
          onClick={handleGenerate}
          disabled={validTopics.length === 0 || isLoading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all-smooth disabled:opacity-50 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Knowledge Graph
            </>
          )}
        </Button>

        {validTopics.length > 0 && (
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={isLoading}
            className="px-6 py-3 border-gray-300 hover:bg-gray-50 transition-all-smooth"
          >
            Clear All
          </Button>
        )}
      </div>

      {validTopics.length > 0 && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              Ready to explore: <span className="font-semibold">{validTopics.join(', ')}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}