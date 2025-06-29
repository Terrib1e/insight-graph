'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Plus, Info, Sparkles, BookOpen, Brain, Lightbulb } from 'lucide-react';

interface ConceptNodeData {
  label: string;
  description: string;
  onExpand: () => void;
  onClick: () => void;
}

export function ConceptNode({ data, selected }: NodeProps<ConceptNodeData>) {
  // Determine node size based on label length and connections
  const isLargeNode = data.label.length > 15;
  const nodeWidth = isLargeNode ? 'min-w-[200px] max-w-[240px]' : 'min-w-[160px] max-w-[200px]';

  // Choose icon based on content (simple heuristic)
  const getIcon = () => {
    const label = data.label.toLowerCase();
    if (label.includes('learn') || label.includes('educat')) return BookOpen;
    if (label.includes('brain') || label.includes('neural') || label.includes('cogni')) return Brain;
    if (label.includes('idea') || label.includes('innovat')) return Lightbulb;
    return Sparkles;
  };

  const Icon = getIcon();

  return (
    <div
      className={`
        relative bg-white/90 backdrop-blur-md border rounded-2xl shadow-lg transition-all duration-300 ${nodeWidth}
        ${selected
          ? 'border-blue-400 shadow-blue-300/50 scale-105 ring-2 ring-blue-300/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50'
          : 'border-gray-200/50 hover:border-blue-300/50 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30'
        }
        hover:scale-105 cursor-pointer group
      `}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gradient-to-r !from-blue-400 !to-purple-400 !border-2 !border-white shadow-sm"
      />

      <div className="relative p-4 space-y-3">
        {/* Icon and Label */}
        <div className="flex items-start gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
            <Icon className="h-4 w-4 text-blue-700" />
          </div>
          <div className="flex-1">
            <div
              className="font-semibold text-sm text-gray-800 leading-tight group-hover:text-blue-700 transition-colors"
              onClick={data.onClick}
              title={data.label}
            >
              {data.label}
            </div>
            {/* Node Description */}
            {data.description && (
              <div className="text-xs text-gray-600 leading-relaxed line-clamp-2 mt-1">
                {data.description}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={data.onClick}
            className="h-7 px-2 text-xs bg-white/50 hover:bg-blue-100/50 flex-1"
          >
            <Info className="h-3 w-3 mr-1" />
            Details
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={data.onExpand}
            className="h-7 px-2 text-xs bg-white/50 hover:bg-purple-100/50 flex-1"
          >
            <Plus className="h-3 w-3 mr-1" />
            Expand
          </Button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gradient-to-r !from-blue-400 !to-purple-400 !border-2 !border-white shadow-sm"
      />

      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 !bg-gradient-to-r !from-blue-400 !to-purple-400 !border-2 !border-white shadow-sm opacity-50 group-hover:opacity-100 transition-opacity"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gradient-to-r !from-blue-400 !to-purple-400 !border-2 !border-white shadow-sm opacity-50 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}