import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StatsCardProps {
  title: string;
  description: string;
  count: number;
  buttons?: Array<{
    text: string;
    link: string;
  }>;
  children?: React.ReactNode;
}

export const StatsCard = ({ title, description, count, buttons, children }: StatsCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col">
        <div className="text-3xl font-bold text-blue-600">{count}</div>
        {children}
        {buttons?.map((button, index) => (
          <Button key={index} asChild className="mt-4" variant="outline" size="sm">
            <Link to={button.link}>{button.text}</Link>
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);