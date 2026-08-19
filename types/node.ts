// Node 타입 정의
export type NodeType = 'task' | 'note' | 'book' | 'place' | 'study' | 'project' | 'idea' | 'person'

export type CaptureStatus = 'inbox' | 'processed'

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'
export type BookStatus = 'want_to_read' | 'reading' | 'completed' | 'abandoned'
export type ProjectStatus = 'planned' | 'active' | 'paused' | 'completed'

export type NodeStatus = TaskStatus | BookStatus | ProjectStatus | string

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type RelationType = 'related_to' | 'requires' | 'inspired_by' | 'part_of' | 'derived_from' | 'recommended'

// Node 데이터베이스 모델
export interface Node {
  id: string
  user_id: string
  type: NodeType
  title: string
  content: string
  summary?: string
  tags: string[]
  status?: NodeStatus
  capture_status: CaptureStatus
  priority?: Priority
  due_date?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

// Relation 데이터베이스 모델
export interface Relation {
  id: string
  user_id: string
  from_node_id: string
  to_node_id: string
  relation_type: RelationType
  created_at: string
}

// API 응답
export interface NodeResponse extends Node {}

export interface RelationResponse extends Relation {}
