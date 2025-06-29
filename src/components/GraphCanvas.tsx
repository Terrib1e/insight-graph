'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { RelatedConcept } from '@/lib/api';
import { ConceptNode } from '@/components/ConceptNode';
import { Button } from '@/components/ui/button';
import { Download, Save, FileText, Image, Maximize2 } from 'lucide-react';

const nodeTypes: NodeTypes = {
  concept: ConceptNode,
};

interface GraphCanvasProps {
  concepts: RelatedConcept[];
  connections: Array<{ source: string; target: string; label?: string }>;
  onNodeClick: (nodeId: string, label: string) => void;
  onNodeExpand: (nodeId: string, label: string) => void;
  onExportPNG: () => void;
  onExportMarkdown: () => void;
  onSave: () => void;
}

function GraphCanvasInternal({
  concepts,
  connections,
  onNodeClick,
  onNodeExpand,
  onExportPNG,
  onExportMarkdown,
  onSave,
}: GraphCanvasProps) {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [previousNodeCount, setPreviousNodeCount] = React.useState(0);

  // Convert concepts to React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return concepts.map((concept, index) => {
      // Improved force-directed layout simulation
      const cols = Math.ceil(Math.sqrt(concepts.length));
      const rows = Math.ceil(concepts.length / cols);

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Add some randomness to avoid perfect grid
      const jitterX = (Math.random() - 0.5) * 100;
      const jitterY = (Math.random() - 0.5) * 100;

      return {
        id: concept.id,
        type: 'concept',
        position: {
          x: col * 280 + 200 + jitterX,
          y: row * 220 + 150 + jitterY,
        },
        data: {
          label: concept.label,
          description: concept.description,
          onExpand: () => onNodeExpand(concept.id, concept.label),
          onClick: () => onNodeClick(concept.id, concept.label),
        },
        draggable: true,
      };
    });
  }, [concepts, onNodeClick, onNodeExpand]);

  // Convert connections to React Flow edges
  const initialEdges: Edge[] = useMemo(() => {
    return connections.map((connection, index) => ({
      id: `edge-${index}`,
      source: connection.source,
      target: connection.target,
      label: connection.label,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: 'url(#edge-gradient)',
        strokeWidth: 2,
        strokeOpacity: 0.8,
      },
      labelStyle: {
        fill: '#64748b',
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '3px 6px',
        borderRadius: '6px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      },
      labelBgStyle: {
        fill: 'white',
        fillOpacity: 0.9,
      },
    }));
  }, [connections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes and edges when props change
  React.useEffect(() => {
    setNodes(initialNodes);

    // Auto-fit view when nodes are added (expansion)
    if (concepts.length > previousNodeCount && previousNodeCount > 0) {
      // Delay fitView to ensure nodes are rendered
      setTimeout(() => {
        fitView({
          duration: 800,
          padding: 0.1,
          includeHiddenNodes: false
        });
      }, 100);
    }

    setPreviousNodeCount(concepts.length);
  }, [initialNodes, setNodes, concepts.length, previousNodeCount, fitView]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleExportPNG = useCallback(() => {
    if (reactFlowRef.current) {
      onExportPNG();
    }
  }, [onExportPNG]);

  if (concepts.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-center space-y-3 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Maximize2 className="h-10 w-10 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="text-gray-700 text-lg font-medium">Your knowledge graph will appear here</div>
            <div className="text-gray-500 text-sm">Enter topics above to generate your first graph</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-inner" ref={reactFlowRef}>
      {/* Edge gradient definition */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-slate-50/50 to-blue-50/50"
      >
        <Controls
          className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-lg overflow-hidden"
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />

        <MiniMap
          className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-lg"
          nodeColor={(node) => node.selected ? '#3b82f6' : '#e5e7eb'}
          maskColor="rgba(0, 0, 0, 0.05)"
          position="top-right"
        />

        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
          className="opacity-50"
        />

        <Panel position="top-left" className="space-x-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportMarkdown}
            className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-blue-50/90 border-gray-200/50 transition-all-smooth"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Export as Markdown
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPNG}
            className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-purple-50/90 border-gray-200/50 transition-all-smooth"
          >
            <Image className="h-4 w-4 mr-1.5" />
            Export as Image
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-green-50/90 border-gray-200/50 transition-all-smooth"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Graph
          </Button>
        </Panel>

        <Panel position="bottom-right" className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>{concepts.length} concepts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>{connections.length} connections</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function GraphCanvas(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInternal {...props} />
    </ReactFlowProvider>
  );
}
