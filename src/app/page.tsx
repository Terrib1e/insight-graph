'use client';

import React, { useState, useCallback } from 'react';
import { TopicInput } from '@/components/TopicInput';
import { GraphCanvas } from '@/components/GraphCanvas';
import { NodeDialog } from '@/components/NodeDialog';
import {
  fetchRelatedConcepts,
  fetchConceptDetails,
  expandNode,
  RelatedConcept,
  ConceptDetails
} from '@/lib/api';
import {
  exportToMarkdown,
  exportToPNG,
  downloadTextFile,
  generateFilename
} from '@/utils/export';

export default function Home() {
  const [concepts, setConcepts] = useState<RelatedConcept[]>([]);
  const [connections, setConnections] = useState<Array<{ source: string; target: string; label?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{ id: string; label: string } | null>(null);
  const [conceptDetails, setConceptDetails] = useState<ConceptDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleGenerateGraph = useCallback(async (topics: string[]) => {
    setIsLoading(true);
    try {
      const response = await fetchRelatedConcepts(topics);
      setConcepts(response.concepts);
      setConnections(response.connections);
    } catch (error) {
      console.error('Failed to generate graph:', error);
      // Show error to user
      alert('Failed to generate knowledge graph. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNodeClick = useCallback(async (nodeId: string, label: string) => {
    setSelectedNode({ id: nodeId, label });
    setShowDialog(true);
    setIsDetailsLoading(true);
    setConceptDetails(null);

    try {
      const details = await fetchConceptDetails(nodeId, label);
      setConceptDetails(details);
    } catch (error) {
      console.error('Failed to fetch concept details:', error);
      // Show basic fallback details
      setConceptDetails({
        id: nodeId,
        label: label,
        definition: `${label} is an important concept that requires further exploration.`,
        examples: [],
        resources: []
      });
    } finally {
      setIsDetailsLoading(false);
    }
  }, []);

  const handleNodeExpand = useCallback(async (nodeId: string, label: string) => {
    try {
      const response = await expandNode(nodeId, label);

      // Add new concepts, avoiding duplicates
      const existingIds = new Set(concepts.map(c => c.id));
      const newConcepts = response.concepts.filter(c => !existingIds.has(c.id));

      setConcepts(prev => [...prev, ...newConcepts]);
      setConnections(prev => [...prev, ...response.connections]);
    } catch (error) {
      console.error('Failed to expand node:', error);
      alert('Failed to expand node. Please try again.');
    }
  }, [concepts]);

  const handleExportMarkdown = useCallback(() => {
    const markdown = exportToMarkdown(concepts, connections);
    const filename = generateFilename('knowledge-graph', 'md');
    downloadTextFile(markdown, filename);
  }, [concepts, connections]);

  const handleExportPNG = useCallback(async () => {
    const graphElement = document.querySelector('.react-flow') as HTMLElement;
    if (graphElement) {
      try {
        const filename = generateFilename('knowledge-graph', 'png');
        await exportToPNG(graphElement, filename);
      } catch (error) {
        console.error('Failed to export PNG:', error);
        alert('Failed to export image. Please try again.');
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    // For now, save to localStorage
    // In a real app, this would save to a database
    const graphData = {
      concepts,
      connections,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('insightgraph-data', JSON.stringify(graphData));
    alert('Graph saved successfully!');
  }, [concepts, connections]);

  const handleCloseDialog = useCallback(() => {
    setShowDialog(false);
    setSelectedNode(null);
    setConceptDetails(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            InsightGraph
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your curiosity into visual knowledge. Enter topics and watch as AI creates
            an interactive map of connected concepts, definitions, and learning resources.
          </p>
        </div>

        {/* Topic Input */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <TopicInput onGenerate={handleGenerateGraph} isLoading={isLoading} />
        </div>

        {/* Graph Canvas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {isLoading ? (
            <div className="w-full h-[600px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
                <div className="text-lg text-gray-600">Generating your knowledge graph...</div>
                <div className="text-sm text-gray-500">This may take a few moments</div>
              </div>
            </div>
          ) : (
            <GraphCanvas
              concepts={concepts}
              connections={connections}
              onNodeClick={handleNodeClick}
              onNodeExpand={handleNodeExpand}
              onExportPNG={handleExportPNG}
              onExportMarkdown={handleExportMarkdown}
              onSave={handleSave}
            />
          )}
        </div>

        {/* Node Details Dialog */}
        <NodeDialog
          isOpen={showDialog}
          onClose={handleCloseDialog}
          conceptDetails={conceptDetails}
          isLoading={isDetailsLoading}
          onExpand={selectedNode ? () => handleNodeExpand(selectedNode.id, selectedNode.label) : undefined}
        />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>
            Powered by Google Gemini AI • Built with Next.js and React Flow
          </p>
          <p>
            {concepts.length > 0 && (
              <>Currently exploring {concepts.length} concepts with {connections.length} connections</>
            )}
          </p>
        </div>
      </div>


    </div>
  );
}