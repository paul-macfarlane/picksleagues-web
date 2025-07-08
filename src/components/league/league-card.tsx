import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

type LeagueCardProps = {
  name: string;
  imageUrl?: string | null;
  description?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
};

export function LeagueCard({
  name,
  imageUrl,
  description,
  content,
  footer,
}: LeagueCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <Avatar className="h-10 w-10">
            <AvatarImage src={imageUrl ?? undefined} alt={name} />
            <AvatarFallback>
              <Trophy className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
        {description && (
          <CardDescription className="pt-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

export function LeagueCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-36" />
      </CardFooter>
    </Card>
  );
}
