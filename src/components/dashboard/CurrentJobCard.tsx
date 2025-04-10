import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, Calendar, User, Briefcase, MessageSquare } from "lucide-react";
import { CollaborativeChecklist } from "./CollaborativeChecklist";

interface CurrentJobCardProps {
  job: {
    id: string;
    title: string;
    providerName: string;
    budget: number;
    deadline: string;
    providerId: string;
  };
  checklistItems: any[];
  onChecklistUpdate: (items: any[]) => void;
}

export const CurrentJobCard = ({ job, checklistItems, onChecklistUpdate }: CurrentJobCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{job.title}</CardTitle>
      <CardDescription className="flex items-center gap-2">
        <User className="h-4 w-4" />
        {job.providerName}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1 mb-2">
            <DollarSign className="h-4 w-4" />
            Budget: ${job.budget}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Collaborative Checklist</h3>
          <CollaborativeChecklist
            items={checklistItems}
            onUpdate={onChecklistUpdate}
          />
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link 
              to={`/messages/${job.providerId}`} 
              className="flex items-center gap-1"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/jobs/${job.id}`} className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Details
            </Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);