// API client for InsightGraph

export interface RelatedConcept {
  id: string;
  label: string;
  description: string;
  connections: string[];
}

export interface ConceptDetails {
  id: string;
  label: string;
  definition: string;
  examples: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'documentation';
  }>;
}

export interface RelatedConceptsResponse {
  concepts: RelatedConcept[];
  connections: Array<{
    source: string;
    target: string;
    label?: string;
  }>;
}

/**
 * Fetch related concepts for given seed topics
 */
export async function fetchRelatedConcepts(seeds: string[]): Promise<RelatedConceptsResponse> {
  try {
    const response = await fetch('/api/related', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seeds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching related concepts:', error);
    throw error;
  }
}

/**
 * Fetch detailed information about a specific concept
 */
export async function fetchConceptDetails(conceptId: string, label: string): Promise<ConceptDetails> {
  try {
    const response = await fetch('/api/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conceptId, label }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching concept details:', error);
    throw error;
  }
}

/**
 * Expand a node to get more related concepts
 */
export async function expandNode(nodeId: string, label: string): Promise<RelatedConceptsResponse> {
  try {
    const response = await fetch('/api/expand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId, label }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error expanding node:', error);
    throw error;
  }
}