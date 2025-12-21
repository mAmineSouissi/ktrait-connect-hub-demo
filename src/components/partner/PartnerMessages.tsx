import { SidebarProvider } from "@/components/ui/sidebar";
import { PartnerSidebar } from "@/components/layout/PartnerSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Search, Plus } from "lucide-react";
import { useState } from "react";

const conversations = [
  { id: 1, name: "Admin KTRAIT", role: "Gestionnaire", lastMessage: "Les plans ont été validés", time: "10:30", unread: 2 },
  { id: 2, name: "Jean Dupont", role: "Client", lastMessage: "Merci pour la mise à jour", time: "Hier", unread: 0 },
  { id: 3, name: "SCI Lyon Invest", role: "Client", lastMessage: "Quand aurons-nous les plans?", time: "Hier", unread: 1 },
  { id: 4, name: "Support Technique", role: "Support", lastMessage: "Votre demande a été traitée", time: "25/03", unread: 0 },
];

const messages = [
  { id: 1, author: "Admin KTRAIT", isMe: false, time: "09:15", content: "Bonjour, avez-vous pu finaliser les plans de l'étage?" },
  { id: 2, author: "Moi", isMe: true, time: "09:30", content: "Bonjour, oui je travaille dessus actuellement. Je devrais avoir terminé d'ici demain." },
  { id: 3, author: "Admin KTRAIT", isMe: false, time: "09:32", content: "Parfait, le client attend avec impatience. N'hésitez pas à m'envoyer une version préliminaire pour validation." },
  { id: 4, author: "Moi", isMe: true, time: "10:00", content: "Je viens d'uploader la version v2 des plans. Pouvez-vous la vérifier?" },
  { id: 5, author: "Admin KTRAIT", isMe: false, time: "10:30", content: "Les plans ont été validés. Excellent travail! Vous pouvez passer à l'étape suivante." },
];

export default function PartnerMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PartnerSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader title="Messagerie" userName="Cabinet Martin" />
          
          <div className="flex-1 p-6">
            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
              <Card className="lg:col-span-1 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Conversations</CardTitle>
                    <Button size="icon" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto space-y-2">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conv.id ? 'bg-accent' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>{conv.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conv.name}</p>
                            <span className="text-xs text-muted-foreground">{conv.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{conv.role}</p>
                          <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                        </div>
                        {conv.unread > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Admin KTRAIT</CardTitle>
                      <p className="text-sm text-muted-foreground">Gestionnaire</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.isMe 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">{message.time}</p>
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
    </SidebarProvider>
  );
}
