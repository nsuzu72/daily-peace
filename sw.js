const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register('/sw.js');
  return registration;
};

// Push Subscription (based on provided code)
const base64UrlToUint8Array = base64UrlData => {
  const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
  const base64 = (base64UrlData + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);
  for(let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
};

const subscribeToPushMessages = async (publicKey) => {
  const registration = await navigator.serviceWorker.ready;
  const pushManager = registration.pushManager;
  
  return pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlToUint8Array(publicKey)
  });
};

const getPushSubscription = async () => {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
};

const unsubscribeFromPushMessages = async () => {
  const subscription = await getPushSubscription();
  if (subscription) {
    return subscription.unsubscribe();
  }
};
