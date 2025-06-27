'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';

interface ConceptNodeData {
  label: string;
  description: string;
  onExpand: () => void;
  onClick: () => void;
}

export function ConceptNode({ data, selected }: NodeProps<ConceptNodeData>) {
  // Determine node size based on label length and connections
  const isLargeNode = data.label.length > 15;
  const nodeWidth = isLargeNode ? 'min-w-[180px] max-w-[220px]' : 'min-w-[140px] max-w-[180px]';

  return (
    <div
      className={`
        bg-white border-2 rounded-xl shadow-lg transition-all duration-300 ${nodeWidth}
        ${selected
          ? 'border-blue-500 shadow-blue-200 scale-105 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
        }
        hover:shadow-xl hover:scale-102 backdrop-blur-sm
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-blue-500 !border-2 !border-white"
      />

      <div className="p-3 space-y-2">
                {/* Node Label */}
        <div
          className="font-bold text-sm text-gray-900 cursor-pointer leading-tight hover:text-blue-600 transition-colors"
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

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={data.onClick}
            className="h-6 px-2 text-xs hover:bg-blue-50"
          >
            <Info className="h-3 w-3 mr-1" />
            Details
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={data.onExpand}
            className="h-6 px-2 text-xs hover:bg-green-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Expand
          </Button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-blue-500 !border-2 !border-white"
      />

      <Handle
        type="source"
        position={Position.Left}
        className="w-2 h-2 !bg-blue-500 !border-2 !border-white"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  );
}