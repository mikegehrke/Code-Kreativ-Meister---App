import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { RoomCreation } from "@/components/Room/RoomCreation";
import { RoomManagement } from "@/components/Room/RoomManagement";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  useEffect(() => {
    document.title = "Room erstellen | NightHub";
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Erstelle deinen eigenen Premium-Streaming-Room mit personalisierten Ticket-Optionen und monetarisiere deine Live-Streams.');
    document.head.appendChild(metaDesc);
  }, []);

  const handleRoomCreated = (roomData: any) => {
    setCreatedRoom(roomData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        {/* Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              {createdRoom ? "Room verwalten" : "Room erstellen"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {createdRoom 
                ? "Verwalte deinen Premium-Room und gehe Live" 
                : "Erstelle deinen eigenen Premium-Room"
              }
            </p>
          </div>
        </div>

        {/* Content */}
        {createdRoom ? (
          <RoomManagement roomData={createdRoom} />
        ) : (
          <RoomCreation onRoomCreated={handleRoomCreated} />
        )}
      </main>
    </div>
  );
}