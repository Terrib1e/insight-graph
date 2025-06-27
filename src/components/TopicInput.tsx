'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Sparkles } from 'lucide-react';

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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">InsightGraph</h1>
        <p className="text-muted-foreground">
          Explore knowledge through interactive concept mapping
        </p>
      </div>

      <div className="space-y-3">
        {/* Existing topics */}
        {topics.map((topic, index) => (
          topic.trim() && (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={topic}
                onChange={(e) => updateTopic(index, e.target.value)}
                placeholder={`Topic ${index + 1}`}
                className="flex-1"
                onKeyPress={handleKeyPress}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeTopic(index)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        ))}

        {/* Current input */}
        <div className="flex items-center gap-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={validTopics.length === 0 ? "Enter your first topic (e.g., Quantum Mechanics)" : "Add another topic..."}
            className="flex-1"
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={addTopic}
            className="flex-shrink-0"
            disabled={!currentInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Example topics */}
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Machine Learning',
              'Quantum Physics',
              'Renaissance Art',
              'Climate Change',
              'Blockchain',
              'Neuroscience'
            ].map((example) => (
              <Button
                key={example}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentInput(example)}
                className="text-xs h-6 px-2"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={validTopics.length === 0 || isLoading}
          className="px-8"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Graph
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={clearAll}
          disabled={isLoading}
        >
          Clear
        </Button>
      </div>

      {validTopics.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Ready to explore: {validTopics.join(', ')}
        </div>
      )}
    </div>
  );
}