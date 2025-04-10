
-- Function to get project messages with sender information
CREATE OR REPLACE FUNCTION get_project_messages(p_project_id UUID)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  sender_name TEXT,
  profile_picture TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.id,
    pm.sender_id,
    pm.content,
    pm.created_at,
    p.name AS sender_name,
    p.profile_picture
  FROM 
    public.project_messages pm
  JOIN 
    public.profiles p ON pm.sender_id = p.id
  WHERE 
    pm.project_id = p_project_id
  ORDER BY 
    pm.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to insert a project message
CREATE OR REPLACE FUNCTION insert_project_message(
  p_project_id UUID,
  p_sender_id UUID,
  p_content TEXT
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  INSERT INTO public.project_messages (
    project_id,
    sender_id,
    content
  ) VALUES (
    p_project_id,
    p_sender_id,
    p_content
  )
  RETURNING id INTO v_message_id;
  
  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
