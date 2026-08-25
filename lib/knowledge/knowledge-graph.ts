import { TopicRelationship, RelationshipType } from "./types";

export interface GraphNode {
  id: string;
  name: string;
  subjectId: string;
  importanceScore: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: RelationshipType;
  label: string;
  relevanceScore: number;
}

export interface TopicGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  crossSubjectCount: number;
}

/**
 * Generates interactive Graph data for visualization on the Topic Page
 */
export function buildTopicGraph(
  centerTopicId: string,
  centerTopicName: string,
  centerSubjectId: string,
  relationships: TopicRelationship[]
): TopicGraphData {
  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  // Add Center Node
  nodesMap.set(centerTopicId, {
    id: centerTopicId,
    name: centerTopicName,
    subjectId: centerSubjectId,
    importanceScore: 100,
  });

  let crossSubjectCount = 0;

  for (const rel of relationships) {
    const isSourceCenter = rel.fromTopicId === centerTopicId;
    const neighborId = isSourceCenter ? rel.toTopicId : rel.fromTopicId;
    const neighborName = (isSourceCenter ? rel.toTopicName : rel.fromTopicName) || neighborId;
    const neighborSubject = (isSourceCenter ? rel.toSubjectId : rel.fromSubjectId) || centerSubjectId;

    if (!nodesMap.has(neighborId)) {
      nodesMap.set(neighborId, {
        id: neighborId,
        name: neighborName,
        subjectId: neighborSubject,
        importanceScore: Math.round(rel.relevanceScore * 100),
      });
    }

    if (neighborSubject !== centerSubjectId) {
      crossSubjectCount++;
    }

    edges.push({
      from: rel.fromTopicId,
      to: rel.toTopicId,
      type: rel.relationshipType,
      label: formatRelationshipLabel(rel.relationshipType),
      relevanceScore: rel.relevanceScore,
    });
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
    crossSubjectCount,
  };
}

/**
 * Human-readable label for relationship types
 */
export function formatRelationshipLabel(type: RelationshipType): string {
  switch (type) {
    case "article_reference":
      return "Constitutional Article";
    case "case_law":
      return "Landmark Judgment";
    case "committee_reference":
      return "Committee / Commission";
    case "amendment_reference":
      return "Constitutional Amendment";
    case "depends_on":
      return "Foundational To";
    case "explains":
      return "Explains Concept";
    case "causes":
      return "Direct Cause";
    case "effect_of":
      return "Consequence / Effect";
    case "contrasts_with":
      return "Comparative Contrast";
    case "current_affairs_reference":
      return "Current Dimension";
    case "pyq_reference":
      return "PYQ Connection";
    case "part_of":
      return "Sub-Component Of";
    default:
      return "Interconnected Topic";
  }
}
