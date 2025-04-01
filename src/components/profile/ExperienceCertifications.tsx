
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Experience, Certification } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Award, Plus, X, Calendar, Building, ExternalLink } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const experienceSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  company: z.string().min(1, { message: "Company is required" }),
  description: z.string().optional(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
});

const certificationSchema = z.object({
  name: z.string().min(1, { message: "Certification name is required" }),
  issuer: z.string().min(1, { message: "Issuer is required" }),
  issueDate: z.string().min(1, { message: "Issue date is required" }),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

const ExperienceCertifications: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'experience' | 'certifications'>('experience');
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const experienceForm = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      company: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
    },
  });

  const certificationForm = useForm<z.infer<typeof certificationSchema>>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialUrl: '',
    },
  });

  if (!profile) return null;

  const onExperienceSubmit = (values: z.infer<typeof experienceSchema>) => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      ...values,
      freelancerId: profile.id,
    };
    
    setExperiences([...experiences, newExperience]);
    setIsAddingExperience(false);
    experienceForm.reset();
  };

  const onCertificationSubmit = (values: z.infer<typeof certificationSchema>) => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      ...values,
      freelancerId: profile.id,
    };
    
    setCertifications([...certifications, newCertification]);
    setIsAddingCertification(false);
    certificationForm.reset();
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 pb-2 border-b">
        <Button 
          variant={activeTab === 'experience' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('experience')}
          size="sm"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Experience
        </Button>
        <Button 
          variant={activeTab === 'certifications' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('certifications')}
          size="sm"
        >
          <Award className="h-4 w-4 mr-2" />
          Certifications
        </Button>
      </div>

      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingExperience(true)}
              disabled={isAddingExperience}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {isAddingExperience && (
            <Card>
              <CardContent className="pt-6">
                <Form {...experienceForm}>
                  <form onSubmit={experienceForm.handleSubmit(onExperienceSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={experienceForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Frontend Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={experienceForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={experienceForm.control}
                        name="current"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between mt-6 space-x-2">
                            <FormLabel>Current Position</FormLabel>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {!experienceForm.watch('current') && (
                      <FormField
                        control={experienceForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={experienceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your responsibilities and achievements..." 
                              className="h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingExperience(false);
                          experienceForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Experience</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <Card key={exp.id} className="relative group">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{exp.title}</h4>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                        </span>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-gray-700">{exp.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No experience added yet. Click "Add Experience" to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'certifications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Certifications</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingCertification(true)}
              disabled={isAddingCertification}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>

          {isAddingCertification && (
            <Card>
              <CardContent className="pt-6">
                <Form {...certificationForm}>
                  <form onSubmit={certificationForm.handleSubmit(onCertificationSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={certificationForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certification Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. AWS Certified Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={certificationForm.control}
                        name="issuer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuing Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Amazon Web Services" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={certificationForm.control}
                        name="issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={certificationForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={certificationForm.control}
                      name="credentialUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credential URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://www.credential.net/..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingCertification(false);
                          certificationForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Certification</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <Card key={cert.id} className="relative group">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeCertification(cert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{cert.name}</h4>
                        <div className="text-gray-600 mt-1">
                          Issued by {cert.issuer}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(cert.issueDate)}
                        {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                      </div>
                    </div>
                    {cert.credentialUrl && (
                      <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Credential
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No certifications added yet. Click "Add Certification" to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceCertifications;
