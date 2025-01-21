// ✅ Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch((error) => console.error('Service Worker registration failed:', error));
}

// ✅ Favicon Verification
document.addEventListener('DOMContentLoaded', () => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) console.log('Favicon detected:', favicon.href);
});
