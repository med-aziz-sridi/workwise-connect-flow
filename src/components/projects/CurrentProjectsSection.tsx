
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ListCheck, Users, Calendar, CalendarClock } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Job, Application } from '@/types';

interface CurrentProjectsSectionProps {
  currentProjects: Job[];
  applications: Application[];
  userId: string;
  userRole: 'freelancer' | 'provider';
}

export const CurrentProjectsSection = ({ 
  currentProjects, 
  applications, 
  userId, 
  userRole 
}: CurrentProjectsSectionProps) => {
  if (currentProjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Projects</CardTitle>
          <CardDescription>
            {userRole === 'freelancer' 
              ? 'Projects you are actively working on' 
              : 'Projects with hired freelancers'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mb-3">
            <CalendarClock className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium">No active projects</h3>
          <p className="text-gray-600 max-w-md mx-auto mt-1 mb-4">
            {userRole === 'freelancer'
              ? 'You don\'t have any active projects at the moment. Apply to jobs to get started!'
              : 'You don\'t have any active projects with hired freelancers.'}
          </p>
          <Button asChild>
            <Link to={userRole === 'freelancer' ? '/jobs' : '/post-job'}>
              {userRole === 'freelancer' ? 'Browse Jobs' : 'Post a Job'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Projects</CardTitle>
        <CardDescription>
          {userRole === 'freelancer' 
            ? 'Projects you are actively working on' 
            : 'Projects with hired freelancers'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProjects.map(project => {
            // Find the matching application
            const projectApps = applications.filter(app => 
              app.jobId === project.id && app.status === 'accepted'
            );
            
            // For the case of a provider, there could be multiple freelancers
            const teamSize = projectApps.length;
            
            // Get the project deadline
            const deadline = new Date(project.deadline);
            const timeRemaining = formatDistanceToNow(deadline, { addSuffix: true });
            const isPastDeadline = deadline < new Date();
            
            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>
                        {userRole === 'freelancer' 
                          ? `Client: ${project.providerName}` 
                          : `Team size: ${teamSize} freelancer${teamSize !== 1 ? 's' : ''}`}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={isPastDeadline ? 'bg-red-500' : 'bg-blue-500'}
                    >
                      {isPastDeadline ? 'Past deadline' : 'In progress'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1 mb-2">
                        <Calendar className="h-4 w-4" />
                        Deadline: {deadline.toLocaleDateString()} ({timeRemaining})
                      </div>
                      <div className="flex items-center gap-1">
                        {teamSize > 1 ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        {teamSize > 1 
                          ? `${teamSize} team members` 
                          : userRole === 'freelancer' 
                            ? `Direct contact with ${project.providerName}` 
                            : 'One-on-one collaboration'}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1 gap-1">
                        <Link 
                          to={
                            userRole === 'freelancer' 
                              ? `/messages/${project.providerId}?jobId=${project.id}` 
                              : `/project/${project.id}/chat`
                          }
                        >
                          <MessageSquare className="h-4 w-4" />
                          {teamSize > 1 ? 'Group Chat' : 'Message'}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 gap-1">
                        <Link to={`/project/${project.id}/checklist`}>
                          <ListCheck className="h-4 w-4" />
                          Checklist
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
