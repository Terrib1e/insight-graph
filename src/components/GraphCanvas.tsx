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
import { Download, Save, ZoomIn, ZoomOut } from 'lucide-react';

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
          x: col * 250 + 200 + jitterX,
          y: row * 200 + 150 + jitterY,
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
      animated: false, // Disable animation to reduce visual noise
      style: {
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        strokeOpacity: 0.6,
      },
      labelStyle: {
        fill: '#64748b',
        fontSize: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 4px',
        borderRadius: '4px',
      },
      labelBgStyle: {
        fill: 'white',
        fillOpacity: 0.8,
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
      <div className="w-full h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center space-y-2">
          <div className="text-gray-400 text-lg">Your knowledge graph will appear here</div>
          <div className="text-gray-500 text-sm">Enter topics above to generate your first graph</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden" ref={reactFlowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <Controls
          className="bg-white shadow-lg border"
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />

        <MiniMap
          className="bg-white shadow-lg border"
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.1)"
          position="top-right"
        />

        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={0.8}
          color="#e2e8f0"
          className="opacity-60"
        />

        <Panel position="top-left" className="space-x-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportMarkdown}
            className="bg-white shadow-sm hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-1" />
            Markdown
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPNG}
            className="bg-white shadow-sm hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-1" />
            PNG
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="bg-white shadow-sm hover:bg-blue-50"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </Panel>

        <Panel position="bottom-right" className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
          {concepts.length} concepts • {connections.length} connections
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
