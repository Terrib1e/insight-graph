import html2canvas from 'html2canvas';
import { RelatedConcept } from '@/lib/api';

/**
 * Export the current graph to Markdown format
 */
export function exportToMarkdown(
  concepts: RelatedConcept[],
  connections: Array<{ source: string; target: string; label?: string }>
): string {
  const conceptsMap = new Map(concepts.map(c => [c.id, c]));

  let markdown = '# Knowledge Graph Export\n\n';
  markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

  markdown += '## Concepts\n\n';

  concepts.forEach((concept, index) => {
    markdown += `### ${index + 1}. ${concept.label}\n\n`;
    if (concept.description) {
      markdown += `${concept.description}\n\n`;
    }

    // Find related concepts
    const relatedConnections = connections.filter(
      conn => conn.source === concept.id || conn.target === concept.id
    );

    if (relatedConnections.length > 0) {
      markdown += '**Related to:**\n';
      relatedConnections.forEach(conn => {
        const relatedId = conn.source === concept.id ? conn.target : conn.source;
        const relatedConcept = conceptsMap.get(relatedId);
        if (relatedConcept) {
          markdown += `- ${relatedConcept.label}`;
          if (conn.label) {
            markdown += ` (${conn.label})`;
          }
          markdown += '\n';
        }
      });
      markdown += '\n';
    }
  });

  markdown += '## Connections\n\n';
  connections.forEach((conn, index) => {
    const sourceConcept = conceptsMap.get(conn.source);
    const targetConcept = conceptsMap.get(conn.target);

    if (sourceConcept && targetConcept) {
      markdown += `${index + 1}. ${sourceConcept.label} → ${targetConcept.label}`;
      if (conn.label) {
        markdown += ` (${conn.label})`;
      }
      markdown += '\n';
    }
  });

  return markdown;
}

/**
 * Download text content as a file
 */
export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export the graph canvas to PNG
 */
export async function exportToPNG(
  element: HTMLElement,
  filename: string = 'knowledge-graph.png'
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: false,
    });

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw new Error('Failed to export graph as PNG');
  }
}

/**
 * Generate a timestamp-based filename
 */
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
}

/**
 * Export graph data to JSON for persistence
 */
export function exportToJSON(
  concepts: RelatedConcept[],
  connections: Array<{ source: string; target: string; label?: string }>,
  metadata?: Record<string, any>
): string {
  const exportData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    metadata: metadata || {},
    concepts,
    connections,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import graph data from JSON
 */
export function importFromJSON(jsonString: string): {
  concepts: RelatedConcept[];
  connections: Array<{ source: string; target: string; label?: string }>;
  metadata?: Record<string, any>;
} {
  try {
    const data = JSON.parse(jsonString);
    return {
      concepts: data.concepts || [],
      connections: data.connections || [],
      metadata: data.metadata || {},
    };
  } catch (error) {
    console.error('Error importing JSON:', error);
    throw new Error('Invalid JSON format');
  }
}