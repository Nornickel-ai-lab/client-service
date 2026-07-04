export interface GraphNodeDto {
  id: string;
  label: string;
  title: string;
  document_id: string | null;
}

export interface GraphEdgeDto {
  id: string;
  source: string;
  target: string;
  type: string;
  summary?: string | null;
  confidence?: number | null;
  topic?: string | null;
  doc_a_title?: string | null;
  doc_b_title?: string | null;
}

export type GraphContradictionDto = GraphEdgeDto & {
  type: 'CONTRADICTS';
};

export interface GraphResponse {
  nodes: GraphNodeDto[];
  edges: GraphEdgeDto[];
}
