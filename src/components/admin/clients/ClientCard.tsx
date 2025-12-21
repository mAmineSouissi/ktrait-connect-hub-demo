import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getUserStatus } from "@/types/user-management.types";
import type { ClientDetail } from "@/types/client.types";
import { Badge, Calendar, Edit, Mail, MapPin, Phone } from "lucide-react";

interface ClientCardProps {
  className?: string;
  client: ClientDetail;
}

export const ClientCard = ({ client, className }: ClientCardProps) => {
  return (
    <div className={cn(className)}>
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informations Client</CardTitle>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {client.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">{client.full_name}</h3>
            <Badge className="mt-2">{getUserStatus(client)}</Badge>
          </div>
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{client.address}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {client.created_at && (
                <span>
                  Client depuis le{" "}
                  {new Date(client.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
