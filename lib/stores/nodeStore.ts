import { create } from 'zustand'
import { Node } from '@/types/node'

interface NodeState {
  nodes: Node[]
  isLoading: boolean
  error: string | null

  // Actions
  setNodes: (nodes: Node[]) => void
  addNode: (node: Node) => void
  updateNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useNodeStore = create<NodeState>((set) => ({
  nodes: [],
  isLoading: false,
  error: null,

  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set((state) => ({ nodes: [node, ...state.nodes] })),
  updateNode: (node) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === node.id ? node : n)),
    })),
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
