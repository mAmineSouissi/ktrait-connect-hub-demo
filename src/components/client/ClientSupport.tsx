import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";

const tickets = [
  {
    id: 1,
    subject: "Question sur le planning",
    status: "Ouvert",
    date: "28/03/2024",
    lastUpdate: "28/03/2024",
    messages: 3,
    priority: "Normal",
  },
  {
    id: 2,
    subject: "Demande de modification plans",
    status: "En cours",
    date: "25/03/2024",
    lastUpdate: "27/03/2024",
    messages: 5,
    priority: "Haute",
  },
  {
    id: 3,
    subject: "Question facturation",
    status: "Résolu",
    date: "20/03/2024",
    lastUpdate: "22/03/2024",
    messages: 4,
    priority: "Normal",
  },
];

const selectedTicketMessages = [
  {
    id: 1,
    author: "Jean Dupont",
    isClient: true,
    date: "28/03/2024 09:30",
    content:
      "Bonjour, je voudrais savoir si le planning prévu est toujours d'actualité ? J'ai vu qu'il y avait des retards sur le chantier.",
  },
  {
    id: 2,
    author: "Support KTRAIT",
    isClient: false,
    date: "28/03/2024 10:15",
    content:
      "Bonjour M. Dupont, merci pour votre message. Effectivement, nous avons eu un léger retard dû aux intempéries. Le nouveau planning sera mis à jour d'ici demain.",
  },
  {
    id: 3,
    author: "Jean Dupont",
    isClient: true,
    date: "28/03/2024 11:00",
    content:
      "Merci pour votre réponse rapide. Pouvez-vous me prévenir dès que le planning est mis à jour ?",
  },
];

export default function ClientSupport() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ouvert":
        return <AlertCircle className="h-4 w-4" />;
      case "En cours":
        return <Clock className="h-4 w-4" />;
      case "Résolu":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Ouvert":
        return "destructive";
      case "En cours":
        return "default";
      case "Résolu":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mes demandes</CardTitle>
                <Dialog
                  open={isNewTicketOpen}
                  onOpenChange={setIsNewTicketOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Nouveau
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle demande</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label>Sujet</Label>
                        <Input placeholder="Sujet de votre demande" />
                      </div>
                      <div className="space-y-2">
                        <Label>Projet concerné</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un projet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Villa Moderne</SelectItem>
                            <SelectItem value="2">Extension Garage</SelectItem>
                            <SelectItem value="3">
                              Rénovation Cuisine
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priorité</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Basse</SelectItem>
                            <SelectItem value="normal">Normale</SelectItem>
                            <SelectItem value="high">Haute</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          placeholder="Décrivez votre demande..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setIsNewTicketOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button type="submit">Envoyer</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-2">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTicket === ticket.id
                        ? "bg-accent border-primary"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{ticket.subject}</h4>
                      <Badge
                        variant={getStatusVariant(ticket.status)}
                        className="flex items-center gap-1 text-xs"
                      >
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{ticket.date}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {ticket.messages}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Question sur le planning</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ticket #1 - Créé le 28/03/2024
                    </p>
                  </div>
                  <Badge>Ouvert</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {selectedTicketMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isClient ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isClient
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {message.author}
                        </span>
                        <span className="text-xs opacity-70 ml-4">
                          {message.date}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
