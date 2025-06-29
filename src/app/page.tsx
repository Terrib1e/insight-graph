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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 gradient-mesh opacity-30 animate-pulse-glow" />
      
      {/* Main gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      
      {/* Floating orbs for visual interest */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
      <div className="fixed bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="fixed top-40 right-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text animate-pulse-glow">
            InsightGraph
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Transform your curiosity into visual knowledge. Enter topics and watch as AI creates
            an interactive map of connected concepts, definitions, and learning resources.
          </p>
          
          {/* Stats badges */}
          {concepts.length > 0 && (
            <div className="flex justify-center gap-4 mt-6">
              <div className="glass px-4 py-2 rounded-full transition-all-smooth hover:scale-105">
                <span className="text-sm font-medium text-gray-700">{concepts.length} Concepts</span>
              </div>
              <div className="glass px-4 py-2 rounded-full transition-all-smooth hover:scale-105">
                <span className="text-sm font-medium text-gray-700">{connections.length} Connections</span>
              </div>
            </div>
          )}
        </div>

        {/* Topic Input */}
        <div className="glass rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <TopicInput onGenerate={handleGenerateGraph} isLoading={isLoading} />
        </div>

        {/* Graph Canvas */}
        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {isLoading ? (
            <div className="w-full h-[600px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto" />
                  <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto" />
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-medium text-gray-800">Generating your knowledge graph...</div>
                  <div className="text-sm text-gray-600">AI is analyzing concepts and building connections</div>
                </div>
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
        <div className="text-center space-y-2 py-8 animate-fade-in">
          <p className="text-sm text-gray-600">
            Powered by <span className="font-medium text-gray-800">Google Gemini AI</span> • Built with <span className="font-medium text-gray-800">Next.js</span> and <span className="font-medium text-gray-800">React Flow</span>
          </p>
        </div>
      </div>
    </div>
  );
}