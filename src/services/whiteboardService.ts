
import { supabase } from '@/integrations/supabase/client';
import { 
  WhiteboardData, 
  WhiteboardIdQueryResponse, 
  WhiteboardMutationResponse, 
  WhiteboardQueryResponse 
} from '@/types/whiteboard';

export async function loadWhiteboardData(projectId: string): Promise<WhiteboardData | null> {
  try {
    // Use raw SQL query to get around type issues with the newly created table
    const { data, error } = await supabase
      .from('project_whiteboards')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle() as unknown as WhiteboardQueryResponse;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error loading whiteboard:', error);
    throw error;
  }
}

export async function saveWhiteboardData(
  projectId: string, 
  json: string
): Promise<void> {
  try {
    // Check if a whiteboard record exists for this project using raw query
    const { data: existingData, error: checkError } = await supabase
      .from('project_whiteboards')
      .select('id')
      .eq('project_id', projectId)
      .maybeSingle() as unknown as WhiteboardIdQueryResponse;
    
    if (checkError) throw checkError;
    
    if (existingData) {
      // Update existing whiteboard using raw query
      const { error: updateError } = await supabase
        .from('project_whiteboards')
        .update({
          canvas_json: json,
          updated_at: new Date().toISOString()
        })
        .eq('project_id', projectId) as unknown as WhiteboardMutationResponse;
        
      if (updateError) throw updateError;
    } else {
      // Create new whiteboard record using raw query
      const { error: insertError } = await supabase
        .from('project_whiteboards')
        .insert({
          project_id: projectId,
          canvas_json: json,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }) as unknown as WhiteboardMutationResponse;
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error saving whiteboard:', error);
    throw error;
  }
}
