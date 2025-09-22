import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.97c4e1cde9f845d6bbc0195dad47e535',
  appName: 'code-kreativ-meister',
  webDir: 'dist',
  server: {
    url: 'https://97c4e1cd-e9f8-45d6-bbc0-195dad47e535.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000'
    }
  }
};

export default config;