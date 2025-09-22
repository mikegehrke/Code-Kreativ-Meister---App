import { toast } from "sonner";

// AI Content Generation Service
export class AIService {
  private static API_BASE = "/api/ai";

  // Image Generation with AI
  static async generateImage(prompt: string, style: string = "nightlife"): Promise<string | null> {
    try {
      const response = await fetch(`${this.API_BASE}/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `${prompt}, ${style} style, professional photography, vibrant colors, high quality`,
          width: 1024,
          height: 1024,
          model: "stable-diffusion-xl",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("AI Image Generation Error:", error);
      toast.error("Failed to generate image. Please try again.");
      return null;
    }
  }

  // Content Moderation with AI
  static async moderateContent(content: string, type: "text" | "image"): Promise<{
    isApproved: boolean;
    confidence: number;
    reasons: string[];
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/moderate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Moderation failed");
      }

      const data = await response.json();
      return {
        isApproved: data.approved,
        confidence: data.confidence,
        reasons: data.flags || [],
      };
    } catch (error) {
      console.error("AI Moderation Error:", error);
      // Default to approved if moderation fails
      return {
        isApproved: true,
        confidence: 0,
        reasons: [],
      };
    }
  }

  // AI-powered Content Recommendations
  static async getRecommendations(userId: string, category: "videos" | "events" | "creators"): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          category,
          limit: 20,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error("AI Recommendations Error:", error);
      return [];
    }
  }

  // Auto-generate content descriptions
  static async generateDescription(title: string, tags: string[], category: string): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE}/generate-description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          tags,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }

      const data = await response.json();
      return data.description;
    } catch (error) {
      console.error("AI Description Generation Error:", error);
      return "";
    }
  }

  // AI-powered hashtag suggestions
  static async suggestHashtags(content: string, category: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_BASE}/suggest-hashtags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to suggest hashtags");
      }

      const data = await response.json();
      return data.hashtags || [];
    } catch (error) {
      console.error("AI Hashtag Suggestion Error:", error);
      return [];
    }
  }

  // AI-powered chat moderation for live streams
  static async moderateChat(message: string, userId: string): Promise<{
    allowed: boolean;
    filteredMessage?: string;
    warning?: string;
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/moderate-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat moderation failed");
      }

      const data = await response.json();
      return {
        allowed: data.allowed,
        filteredMessage: data.filteredMessage,
        warning: data.warning,
      };
    } catch (error) {
      console.error("AI Chat Moderation Error:", error);
      // Default to allow if moderation fails
      return {
        allowed: true,
        filteredMessage: message,
      };
    }
  }

  // AI-powered event recommendations based on user preferences
  static async getEventRecommendations(userId: string, location: string, preferences: string[]): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE}/event-recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          location,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get event recommendations");
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error("AI Event Recommendations Error:", error);
      return [];
    }
  }

  // AI-powered content analysis for trends
  static async analyzeTrends(timeframe: "day" | "week" | "month"): Promise<{
    trendingTopics: string[];
    popularHashtags: string[];
    emergingCreators: string[];
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/analyze-trends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeframe,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze trends");
      }

      const data = await response.json();
      return {
        trendingTopics: data.trendingTopics || [],
        popularHashtags: data.popularHashtags || [],
        emergingCreators: data.emergingCreators || [],
      };
    } catch (error) {
      console.error("AI Trends Analysis Error:", error);
      return {
        trendingTopics: [],
        popularHashtags: [],
        emergingCreators: [],
      };
    }
  }
}