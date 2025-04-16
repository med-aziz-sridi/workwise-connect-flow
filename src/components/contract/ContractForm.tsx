
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Application } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContractFormProps {
  application: Application;
}

const ContractForm: React.FC<ContractFormProps> = ({ application }) => {
  const [scope, setScope] = useState('');
  const [terms, setTerms] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scope || !terms || !amount || !deadline) return;
    
    setIsSubmitting(true);
    try {
      // Create contract in conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('job_id', application.jobId)
        .eq('participant2_id', application.freelancerId)
        .single();
      
      if (conversation) {
        await supabase
          .from('conversations')
          .update({
            has_contract: true,
            contract_details: {
              scope,
              terms,
              amount: parseFloat(amount),
              deadline,
              created_at: new Date().toISOString(),
              application_id: application.id
            }
          })
          .eq('id', conversation.id);
      }
      
      toast({
        title: "Contract created",
        description: "The contract has been sent to the freelancer.",
      });
      
      navigate(`/jobs/${application.jobId}/applicants`);
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Could not create the contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="scope">Project Scope</Label>
        <Textarea
          id="scope"
          placeholder="Describe the project scope and deliverables..."
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea
          id="terms"
          placeholder="Specify the terms and conditions..."
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1"
            required
          />
        </div>
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating Contract...' : 'Create Contract'}
      </Button>
    </form>
  );
};

export default ContractForm;
