'use server'

import { createClient } from '@/lib/supabase/server'
import { Relation, RelationType } from '@/types/node'

export async function createRelation(
  fromNodeId: string,
  toNodeId: string,
  relationType: RelationType
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const { data, error } = await supabase
    .from('relations')
    .insert({
      user_id: user.id,
      from_node_id: fromNodeId,
      to_node_id: toNodeId,
      relation_type: relationType,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Relation 생성 실패: ${error.message}`)
  }

  return data as Relation
}

export async function getRelations(nodeId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('relations')
    .select('*')
    .or(`from_node_id.eq.${nodeId},to_node_id.eq.${nodeId}`)

  if (error) {
    throw new Error(`Relation 조회 실패: ${error.message}`)
  }

  // 관련 노드들의 제목 정보를 함께 가져오기
  const relationsWithNodes = await Promise.all(
    (data as Relation[]).map(async (relation) => {
      const relatedNodeId =
        relation.from_node_id === nodeId ? relation.to_node_id : relation.from_node_id

      const { data: nodeData } = await supabase
        .from('nodes')
        .select('id, title, type')
        .eq('id', relatedNodeId)
        .maybeSingle()

      return {
        ...relation,
        relatedNode: nodeData || { id: relatedNodeId, title: '(삭제됨)', type: 'note' },
      }
    })
  )

  return relationsWithNodes as any[]
}

export async function deleteRelation(
  fromNodeId: string,
  toNodeId: string,
  relationType: RelationType
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('relations')
    .delete()
    .eq('from_node_id', fromNodeId)
    .eq('to_node_id', toNodeId)
    .eq('relation_type', relationType)

  if (error) {
    throw new Error(`Relation 삭제 실패: ${error.message}`)
  }
}
