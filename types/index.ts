// Node 타입 정의
export type NodeType = 'task' | 'note' | 'book' | 'place' | 'study' | 'project' | 'idea' | 'person';

export type NodeStatus =
  | 'todo' | 'in_progress' | 'done' | 'cancelled'  // Task
  | 'want_to_read' | 'reading' | 'completed' | 'abandoned'  // Book
  | 'planned' | 'active' | 'paused';  // Project

export type CaptureStatus = 'inbox' | 'processed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type RelationType = 'related_to' | 'requires' | 'inspired_by' | 'part_of' | 'derived_from' | 'recommended';

export interface Node {
  id: string;
  userId: string;
  type: NodeType;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  status?: NodeStatus;
  captureStatus: CaptureStatus;
  priority?: Priority;
  dueDate?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Relation {
  id: string;
  userId: string;
  fromNodeId: string;
  toNodeId: string;
  relationType: RelationType;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
