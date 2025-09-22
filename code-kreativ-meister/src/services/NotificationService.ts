// Push Notification Service
interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  silent?: boolean;
  vibrate?: number[];
  timestamp?: number;
  requireInteraction?: boolean;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;
  private vapidPublicKey: string = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HnKFOXoF6YjPan9BNqc1pRdHnBJQzMjfKd6BedQy1TxSNCHuA'; // Demo key

  constructor() {
    this.init();
  }

  // Initialize the notification service
  async init(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported');
      return;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);

      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (this.subscription) {
        console.log('Existing push subscription found');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported');
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  // Subscribe to push notifications
  async subscribe(): Promise<NotificationSubscription | null> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    const permission = await this.requestPermission();
    if (!permission.granted) {
      throw new Error('Notification permission denied');
    }

    try {
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      const subscriptionData = {
        endpoint: this.subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(this.subscription.getKey('p256dh')!),
          auth: this.arrayBufferToBase64(this.subscription.getKey('auth')!)
        }
      };

      // Save subscription to server (mock implementation)
      await this.saveSubscriptionToServer(subscriptionData);

      return subscriptionData;
    } catch (error) {
      console.error('Push subscription failed:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      const result = await this.subscription.unsubscribe();
      this.subscription = null;
      
      // Remove subscription from server
      await this.removeSubscriptionFromServer();
      
      return result;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  }

  // Show local notification
  async showNotification(options: PushNotificationOptions): Promise<void> {
    const permission = await this.requestPermission();
    if (!permission.granted) {
      throw new Error('Notification permission denied');
    }

    if (this.registration) {
      // Use service worker to show notification
      await this.registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: options.badge || '/icons/badge-72x72.png',
        image: options.image,
        tag: options.tag,
        data: options.data,
        actions: options.actions,
        silent: options.silent,
        vibrate: options.vibrate || [200, 100, 200],
        timestamp: options.timestamp || Date.now(),
        requireInteraction: options.requireInteraction || false
      });
    } else {
      // Fallback to browser notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        tag: options.tag,
        data: options.data,
        silent: options.silent,
        vibrate: options.vibrate || [200, 100, 200],
        timestamp: options.timestamp || Date.now(),
        requireInteraction: options.requireInteraction || false
      });
    }
  }

  // Get notification permission status
  getPermissionStatus(): NotificationPermission {
    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  // Check if push notifications are supported
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  // Check if currently subscribed
  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  // Get current subscription
  getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  // Utility: Convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Utility: Convert ArrayBuffer to Base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Mock: Save subscription to server
  private async saveSubscriptionToServer(subscription: NotificationSubscription): Promise<void> {
    // In a real implementation, send this to your backend
    localStorage.setItem('push_subscription', JSON.stringify(subscription));
    console.log('Push subscription saved:', subscription);
  }

  // Mock: Remove subscription from server
  private async removeSubscriptionFromServer(): Promise<void> {
    // In a real implementation, remove this from your backend
    localStorage.removeItem('push_subscription');
    console.log('Push subscription removed');
  }
}

// Notification templates for different types
export const NotificationTemplates = {
  newMessage: (senderName: string, message: string): PushNotificationOptions => ({
    title: `Neue Nachricht von ${senderName}`,
    body: message,
    icon: '/icons/message-icon.png',
    tag: 'new-message',
    actions: [
      { action: 'reply', title: 'Antworten', icon: '/icons/reply-icon.png' },
      { action: 'view', title: 'Anzeigen', icon: '/icons/view-icon.png' }
    ],
    data: { type: 'message', sender: senderName }
  }),

  newLike: (username: string, videoTitle: string): PushNotificationOptions => ({
    title: `${username} hat dein Video geliked!`,
    body: videoTitle,
    icon: '/icons/like-icon.png',
    tag: 'new-like',
    actions: [
      { action: 'view', title: 'Video anzeigen', icon: '/icons/video-icon.png' }
    ],
    data: { type: 'like', username, videoTitle }
  }),

  newComment: (username: string, comment: string, videoTitle: string): PushNotificationOptions => ({
    title: `${username} hat dein Video kommentiert`,
    body: `"${comment}" - ${videoTitle}`,
    icon: '/icons/comment-icon.png',
    tag: 'new-comment',
    actions: [
      { action: 'reply', title: 'Antworten', icon: '/icons/reply-icon.png' },
      { action: 'view', title: 'Video anzeigen', icon: '/icons/video-icon.png' }
    ],
    data: { type: 'comment', username, comment, videoTitle }
  }),

  newFollower: (username: string): PushNotificationOptions => ({
    title: `${username} folgt dir jetzt!`,
    body: 'Schau dir ihr Profil an',
    icon: '/icons/follow-icon.png',
    tag: 'new-follower',
    actions: [
      { action: 'view-profile', title: 'Profil anzeigen', icon: '/icons/profile-icon.png' },
      { action: 'follow-back', title: 'Zurück folgen', icon: '/icons/follow-icon.png' }
    ],
    data: { type: 'follower', username }
  }),

  liveStreamStarted: (username: string): PushNotificationOptions => ({
    title: `${username} ist jetzt live!`,
    body: 'Verpasse nicht den Live-Stream',
    icon: '/icons/live-icon.png',
    tag: 'live-stream',
    actions: [
      { action: 'watch', title: 'Zuschauen', icon: '/icons/watch-icon.png' }
    ],
    data: { type: 'live-stream', username },
    requireInteraction: true
  }),

  giftReceived: (senderName: string, giftName: string, giftEmoji: string): PushNotificationOptions => ({
    title: `Geschenk erhalten! ${giftEmoji}`,
    body: `${senderName} hat dir ein ${giftName} geschenkt`,
    icon: '/icons/gift-icon.png',
    tag: 'gift-received',
    actions: [
      { action: 'thank', title: 'Danken', icon: '/icons/heart-icon.png' },
      { action: 'view', title: 'Anzeigen', icon: '/icons/view-icon.png' }
    ],
    data: { type: 'gift', sender: senderName, gift: giftName },
    vibrate: [200, 100, 200, 100, 200]
  }),

  videoProcessed: (videoTitle: string, success: boolean): PushNotificationOptions => ({
    title: success ? 'Video erfolgreich verarbeitet!' : 'Video-Verarbeitung fehlgeschlagen',
    body: videoTitle,
    icon: success ? '/icons/success-icon.png' : '/icons/error-icon.png',
    tag: 'video-processed',
    actions: success ? [
      { action: 'view', title: 'Video anzeigen', icon: '/icons/video-icon.png' },
      { action: 'share', title: 'Teilen', icon: '/icons/share-icon.png' }
    ] : [
      { action: 'retry', title: 'Erneut versuchen', icon: '/icons/retry-icon.png' }
    ],
    data: { type: 'video-processed', title: videoTitle, success }
  }),

  systemUpdate: (title: string, message: string): PushNotificationOptions => ({
    title,
    body: message,
    icon: '/icons/system-icon.png',
    tag: 'system-update',
    silent: true,
    data: { type: 'system', title, message }
  })
};

// Notification manager for handling different types
export class NotificationManager {
  private service: NotificationService;
  private enabled: boolean = true;
  private userId: string | null = null;

  constructor() {
    this.service = new NotificationService();
    this.loadSettings();
  }

  // Initialize with user ID
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Enable/disable notifications
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('notifications_enabled', enabled.toString());
  }

  // Check if notifications are enabled
  isEnabled(): boolean {
    return this.enabled && this.service.getPermissionStatus().granted;
  }

  // Subscribe to push notifications
  async subscribe(): Promise<boolean> {
    try {
      const subscription = await this.service.subscribe();
      return subscription !== null;
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      return false;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    return await this.service.unsubscribe();
  }

  // Show notification based on type
  async showNotification(type: keyof typeof NotificationTemplates, ...args: any[]): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    try {
      const template = NotificationTemplates[type];
      if (template) {
        const options = template(...args);
        await this.service.showNotification(options);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Show custom notification
  async showCustomNotification(options: PushNotificationOptions): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    try {
      await this.service.showNotification(options);
    } catch (error) {
      console.error('Failed to show custom notification:', error);
    }
  }

  // Get permission status
  getPermissionStatus() {
    return this.service.getPermissionStatus();
  }

  // Check support
  isSupported(): boolean {
    return this.service.isSupported();
  }

  // Load settings from localStorage
  private loadSettings(): void {
    const enabled = localStorage.getItem('notifications_enabled');
    this.enabled = enabled !== 'false';
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// React hook for notifications
export const useNotifications = () => {
  const [isSupported] = useState(() => notificationManager.isSupported());
  const [isEnabled, setIsEnabled] = useState(() => notificationManager.isEnabled());
  const [permission, setPermission] = useState(() => notificationManager.getPermissionStatus());

  const subscribe = async (): Promise<boolean> => {
    const result = await notificationManager.subscribe();
    setIsEnabled(notificationManager.isEnabled());
    setPermission(notificationManager.getPermissionStatus());
    return result;
  };

  const unsubscribe = async (): Promise<boolean> => {
    const result = await notificationManager.unsubscribe();
    setIsEnabled(notificationManager.isEnabled());
    return result;
  };

  const toggleEnabled = (enabled: boolean): void => {
    notificationManager.setEnabled(enabled);
    setIsEnabled(enabled);
  };

  const showNotification = async (type: keyof typeof NotificationTemplates, ...args: any[]): Promise<void> => {
    await notificationManager.showNotification(type, ...args);
  };

  return {
    isSupported,
    isEnabled,
    permission,
    subscribe,
    unsubscribe,
    toggleEnabled,
    showNotification
  };
};

export default NotificationService;
