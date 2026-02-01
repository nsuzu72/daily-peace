import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = { /* YOUR CONFIG HERE */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadDailyQuote() {
    const today = new Date().toISOString().split('T')[0]; // [cite: 17]
    const dailyRef = doc(db, "dailyQuotes", today);
    const dailySnap = await getDoc(dailyRef);

    if (dailySnap.exists()) {
        const data = dailySnap.data();
        
        // Fetch specific quote and photo [cite: 18]
        const quoteSnap = await getDoc(doc(db, "quotes", data.quoteId));
        const photoSnap = await getDoc(doc(db, "unsplashPhotos", data.photoId));

        if (quoteSnap.exists() && photoSnap.exists()) {
            displayQuote(quoteSnap.data(), photoSnap.data());
        }
    } else {
        document.getElementById('quote-text').innerText = "Check back later for today's inspiration.";
    }
}

function displayQuote(quote, photo) {
    document.getElementById('bg-image').style.backgroundImage = `url('${photo.photoUrl}')`;
    document.getElementById('quote-text').innerText = `"${quote.text}"`;
    document.getElementById('quote-attribution').innerText = `— ${quote.attribution}`;
    
    // Smooth Fade-in [cite: 40]
    document.getElementById('bg-image').classList.replace('opacity-0', 'opacity-100');
    document.getElementById('quote-container').classList.replace('opacity-0', 'opacity-100');
}

loadDailyQuote();
