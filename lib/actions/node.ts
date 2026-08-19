'use server'

import { createClient } from '@/lib/supabase/server'
import { Node, NodeType, CaptureStatus, Priority } from '@/types/node'

export async function createNode(
  type: NodeType,
  title: string,
  content: string,
  options?: {
    summary?: string
    tags?: string[]
    status?: string
    priority?: Priority
    dueDate?: string
    metadata?: Record<string, any>
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const { data, error } = await supabase
    .from('nodes')
    .insert({
      user_id: user.id,
      type,
      title,
      content,
      summary: options?.summary || '',
      tags: options?.tags || [],
      status: options?.status,
      capture_status: 'inbox' as CaptureStatus,
      priority: options?.priority,
      due_date: options?.dueDate,
      metadata: options?.metadata || {},
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Node 생성 실패: ${error.message}`)
  }

  return data as Node
}

export async function getNode(nodeId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('id', nodeId)
    .single()

  if (error) {
    throw new Error(`Node 조회 실패: ${error.message}`)
  }

  return data as Node
}

export async function listNodes(
  filters?: {
    type?: NodeType
    status?: string
    captureStatus?: CaptureStatus
    priority?: Priority
  }
) {
  const supabase = await createClient()

  let query = supabase.from('nodes').select('*')

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.captureStatus) {
    query = query.eq('capture_status', filters.captureStatus)
  }

  if (filters?.priority) {
    query = query.eq('priority', filters.priority)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Node 목록 조회 실패: ${error.message}`)
  }

  return data as Node[]
}

export async function updateNode(
  nodeId: string,
  updates: Partial<Omit<Node, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('nodes')
    .update(updates)
    .eq('id', nodeId)
    .select()
    .single()

  if (error) {
    throw new Error(`Node 업데이트 실패: ${error.message}`)
  }

  return data as Node
}

export async function deleteNode(nodeId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('nodes').delete().eq('id', nodeId)

  if (error) {
    throw new Error(`Node 삭제 실패: ${error.message}`)
  }
}

export async function searchNodes(
  query: string,
  filters?: {
    type?: NodeType
    status?: string
    tags?: string[]
    priority?: Priority
    dueDate?: { from?: string; to?: string }
  }
) {
  const supabase = await createClient()

  let queryBuilder = supabase.from('nodes').select('*')

  // 텍스트 검색 (제목, 내용, 요약, 태그)
  if (query.trim()) {
    const searchTerm = `%${query}%`
    queryBuilder = queryBuilder.or(
      `title.ilike.${searchTerm},content.ilike.${searchTerm},summary.ilike.${searchTerm},tags.cs.{"${query}"}`
    )
  }

  // Type 필터
  if (filters?.type) {
    queryBuilder = queryBuilder.eq('type', filters.type)
  }

  // Status 필터
  if (filters?.status) {
    queryBuilder = queryBuilder.eq('status', filters.status)
  }

  // Priority 필터
  if (filters?.priority) {
    queryBuilder = queryBuilder.eq('priority', filters.priority)
  }

  // Tag 필터
  if (filters?.tags && filters.tags.length > 0) {
    queryBuilder = queryBuilder.contains('tags', filters.tags)
  }

  // Due Date 필터
  if (filters?.dueDate?.from) {
    queryBuilder = queryBuilder.gte('due_date', filters.dueDate.from)
  }
  if (filters?.dueDate?.to) {
    queryBuilder = queryBuilder.lte('due_date', filters.dueDate.to)
  }

  const { data, error } = await queryBuilder.order('created_at', { ascending: false })

  if (error) {
    throw new Error(`검색 실패: ${error.message}`)
  }

  return data as Node[]
}
