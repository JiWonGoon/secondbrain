-- Create nodes table
CREATE TABLE IF NOT EXISTS public.nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('task', 'note', 'book', 'place', 'study', 'project', 'idea', 'person')),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  summary TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(50),
  capture_status VARCHAR(50) NOT NULL DEFAULT 'inbox' CHECK (capture_status IN ('inbox', 'processed')),
  priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create relations table
CREATE TABLE IF NOT EXISTS public.relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) NOT NULL CHECK (relation_type IN ('related_to', 'requires', 'inspired_by', 'part_of', 'derived_from', 'recommended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(from_node_id, to_node_id, relation_type)
);

-- Create indexes for common queries
CREATE INDEX idx_nodes_user_id ON public.nodes(user_id);
CREATE INDEX idx_nodes_type ON public.nodes(type);
CREATE INDEX idx_nodes_status ON public.nodes(status);
CREATE INDEX idx_nodes_capture_status ON public.nodes(capture_status);
CREATE INDEX idx_nodes_created_at ON public.nodes(created_at DESC);
CREATE INDEX idx_nodes_updated_at ON public.nodes(updated_at DESC);
CREATE INDEX idx_nodes_due_date ON public.nodes(due_date);
CREATE INDEX idx_nodes_user_type ON public.nodes(user_id, type);

CREATE INDEX idx_relations_user_id ON public.relations(user_id);
CREATE INDEX idx_relations_from_node_id ON public.relations(from_node_id);
CREATE INDEX idx_relations_to_node_id ON public.relations(to_node_id);
CREATE INDEX idx_relations_user_from_node ON public.relations(user_id, from_node_id);
CREATE INDEX idx_relations_user_to_node ON public.relations(user_id, to_node_id);

-- Enable RLS
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relations ENABLE ROW LEVEL SECURITY;

-- RLS Policy for nodes: Users can only see their own nodes
CREATE POLICY "Users can view their own nodes"
  ON public.nodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nodes"
  ON public.nodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nodes"
  ON public.nodes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nodes"
  ON public.nodes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policy for relations: Users can only see relations between their own nodes
CREATE POLICY "Users can view relations between their nodes"
  ON public.relations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create relations between their nodes"
  ON public.relations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.nodes WHERE id = from_node_id AND user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM public.nodes WHERE id = to_node_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete relations between their nodes"
  ON public.relations FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_nodes_updated_at
  BEFORE UPDATE ON public.nodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
