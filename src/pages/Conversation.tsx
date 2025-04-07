import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types';
import { getMessages, sendMessage, markMessagesAsRead } from '@/services/messaging';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const Conversation: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const [receiverPicture, setReceiverPicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    const fetchMessagesData = async () => {
      try {
        // Get conversation participants with explicit foreign key references
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select(`
            participant1_id, participant2_id,
            profiles1:profiles!conversations_participant1_id_fkey(name, profile_picture),
            profiles2:profiles!conversations_participant2_id_fkey(name, profile_picture)
          `)
          .eq('id', conversationId)
          .single();
        
        if (convError) throw convError;
        
        // Determine the other participant
        const isParticipant1 = conversation.participant1_id === user.id;
        const otherParticipantId = isParticipant1 ? conversation.participant2_id : conversation.participant1_id;
        const otherParticipantData = isParticipant1 ? conversation.profiles2 : conversation.profiles1;
        
        setReceiverId(otherParticipantId);
        if (otherParticipantData) {
          setReceiverName(otherParticipantData.name);
          setReceiverPicture(otherParticipantData.profile_picture);
        }
        
        // Get messages
        const messagesData = await getMessages(conversationId);
        setMessages(messagesData);
        
        // Mark messages as read
        await markMessagesAsRead(user.id, conversationId);
      } catch (error) {
        console.error('Error fetching conversation data:', error);
        toast({
          title: "Error loading conversation",
          description: "There was a problem loading the messages. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagesData();

    // Set up real-time subscription for new messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id.eq.${conversationId}`,
      }, (payload) => {
        const newMsg = payload.new as any;
        
        setMessages(prev => [...prev, {
          id: newMsg.id,
          senderId: newMsg.sender_id,
          receiverId: newMsg.receiver_id,
          content: newMsg.content,
          read: newMsg.read,
          createdAt: newMsg.created_at,
          conversationId: newMsg.conversation_id
        }]);
        
        // Mark messages as read
        if (newMsg.sender_id !== user.id) {
          markMessagesAsRead(user.id, conversationId);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user, conversationId, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !receiverId || !newMessage.trim() || !conversationId) {
      toast({
        title: "Cannot send message",
        description: "Make sure you enter a message and try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    try {
      const sentMessage = await sendMessage(user.id, receiverId, newMessage.trim(), conversationId);
      if (!sentMessage) {
        throw new Error("Failed to send message");
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message not sent",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

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
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/messages" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Messages
          </Link>
        </Button>

        <Card className="shadow-md h-[calc(100vh-140px)]">
          <CardHeader className="border-b py-3 px-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={receiverPicture || undefined} alt={receiverName || 'User'} />
                <AvatarFallback>{getInitials(receiverName)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{receiverName || 'User'}</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  
                  return (
                    <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[70%] rounded-lg px-4 py-2 
                        ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}
                      `}>
                        <p className="break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          {format(new Date(message.createdAt), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-3 mt-auto">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isSending}
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Conversation;
