import { useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { MarketingFlow } from "@/components/Marketing/MarketingFlow";

export default function Marketing() {
  useEffect(() => {
    document.title = "Video Marketing | NightHub";
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Booste deine Videos mit professionellen Marketing-Paketen und erreiche mehr Zuschauer auf NightHub.');
    document.head.appendChild(metaDesc);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        <MarketingFlow />
      </main>
    </div>
  );
}