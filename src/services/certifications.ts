
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Certification, Profile, User } from '@/types';

export function useCertificationsService(user: User | null, profile: Profile | null) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCertifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*');
      
      if (error) throw error;
      
      if (profile?.role === 'freelancer') {
        const filteredData = data.filter(cert => cert.freelancer_id === user.id);
        
        const formattedCertifications: Certification[] = filteredData.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issue_date,
          expiryDate: cert.expiry_date,
          credentialUrl: cert.credential_url,
          freelancerId: cert.freelancer_id,
        }));
        
        setCertifications(formattedCertifications);
      } else {
        const formattedCertifications: Certification[] = data.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issue_date,
          expiryDate: cert.expiry_date,
          credentialUrl: cert.credential_url,
          freelancerId: cert.freelancer_id,
        }));
        
        setCertifications(formattedCertifications);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCertification = async (certificationData: Omit<Certification, 'id' | 'freelancerId'>) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can add certifications",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('certifications')
        .insert({
          name: certificationData.name,
          issuer: certificationData.issuer,
          issue_date: certificationData.issueDate,
          expiry_date: certificationData.expiryDate,
          credential_url: certificationData.credentialUrl,
          freelancer_id: user.id,
        });
      
      if (error) throw error;
      
      toast({
        title: "Certification added",
        description: "Your certification has been added successfully",
      });
      
      fetchCertifications();
    } catch (error) {
      console.error('Error adding certification:', error);
      toast({
        title: "Certification addition failed",
        description: "An error occurred while adding your certification",
        variant: "destructive",
      });
    }
  };

  const deleteCertification = async (certificationId: string) => {
    if (!user || profile?.role !== 'freelancer') {
      toast({
        title: "Permission denied",
        description: "Only freelancers can delete certifications",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: certificationData, error: checkError } = await supabase
        .from('certifications')
        .select('freelancer_id')
        .eq('id', certificationId)
        .single();
      
      if (checkError) throw checkError;
      
      if (certificationData.freelancer_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own certifications",
          variant: "destructive",
        });
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('certifications')
        .delete()
        .eq('id', certificationId);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: "Certification deleted",
        description: "Your certification has been removed from your profile",
      });
      
      fetchCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast({
        title: "Certification deletion failed",
        description: "An error occurred while deleting your certification",
        variant: "destructive",
      });
    }
  };

  const resetCertifications = () => {
    setCertifications([]);
  };

  return {
    certifications,
    isLoading,
    fetchCertifications,
    addCertification,
    deleteCertification,
    resetCertifications
  };
}
