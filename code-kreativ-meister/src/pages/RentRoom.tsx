import { useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { RoomSelector } from "@/components/Rooms/RoomSelector";

export default function RentRoom() {
  useEffect(() => {
    document.title = "Premium Room mieten | NightHub";
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Miete Premium-Streaming-Räume für professionelle Live-Streams: VIP-Studios, Neon-Clubs, Rooftop-Locations und mehr.');
    document.head.appendChild(metaDesc);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RoomSelector />
      </main>
    </div>
  );
}