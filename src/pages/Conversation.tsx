
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { useConversation } from '@/hooks/useConversation';
import ConversationHeader from '@/components/chat/ConversationHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ContractDetails {
  scope: string;
  terms: string;
  amount: number;
  deadline: string;
  created_at: string;
  application_id: string;
}

const Conversation: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showContract, setShowContract] = useState(false);
  const [contract, setContract] = useState<ContractDetails | null>(null);
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  
  const {
    messages,
    isSending,
    isLoading,
    receiverInfo,
    handleSendMessage
  } = useConversation({
    conversationId: conversationId || '',
    userId: user?.id
  });

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!conversationId) return;
      
      setIsLoadingContract(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('has_contract, contract_details')
          .eq('id', conversationId)
          .single();
          
        if (error) throw error;
        
        if (data.has_contract && data.contract_details) {
          // Cast to unknown first before casting to ContractDetails
          setContract(data.contract_details as unknown as ContractDetails);
        }
      } catch (error) {
        console.error('Error fetching contract:', error);
      } finally {
        setIsLoadingContract(false);
      }
    };
    
    fetchContractDetails();
  }, [conversationId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-md h-[calc(100vh-140px)]">
          <CardHeader className="border-b py-3 px-4">
            <ConversationHeader 
              receiverName={receiverInfo?.name || null}
              receiverPicture={receiverInfo?.profilePicture || null}
            />
            {contract && (
              <div className="mt-2 flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowContract(!showContract)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  {showContract ? 'Hide Contract' : 'View Contract'}
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            {showContract && contract ? (
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Contract Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Project Scope:</p>
                      <p className="mt-1 text-gray-600">{contract.scope}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Terms & Conditions:</p>
                      <p className="mt-1 text-gray-600">{contract.terms}</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <p className="font-medium text-gray-700">Amount:</p>
                        <p className="mt-1 text-gray-600">${contract.amount}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Deadline:</p>
                        <p className="mt-1 text-gray-600">{format(new Date(contract.deadline), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Created:</p>
                        <p className="mt-1 text-gray-600">{format(new Date(contract.created_at), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            
            <MessageList 
              messages={messages} 
              currentUserId={user?.id}
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Conversation;
