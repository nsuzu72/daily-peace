import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwQZJMVPeo5wYECqXHgOK19fzwvNbHddk",
  authDomain: "daily-peace-app.firebaseapp.com",
  projectId: "daily-peace-app",
  storageBucket: "daily-peace-app.firebasestorage.app",
  messagingSenderId: "16436038627",
  appId: "1:16436038627:web:36f5fcfc8bf9077267aed6",
  measurementId: "G-NJHB2B3570"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedApp() {
  try {
    // 1. Add a Quote [cite: 9, 10]
    const quoteRef = await addDoc(collection(db, "quotes"), {
      text: "Peace is not the absence of conflict, but the ability to cope with it.",
      attribution: "Family Newsletter, Issue 1",
      createdAt: serverTimestamp(),
      viewCount: 0,
      bookmarkCount: 0,
      shareCount: 0
    });

    // 2. Add a Photo [cite: 15, 16]
    const photoRef = await addDoc(collection(db, "unsplashPhotos"), {
      photoUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      photographer: "Unsplash Artist",
      createdAt: serverTimestamp()
    });

    // 3. Create Today's Entry [cite: 17, 18]
    const today = new Date().toISOString().split('T')[0];
    await setDoc(doc(db, "dailyQuotes", today), {
      date: today,
      quoteId: quoteRef.id,
      photoId: photoRef.id,
      createdAt: serverTimestamp()
    });

    console.log("Database seeded successfully for date:", today);
  } catch (e) {
    console.error("Error seeding database: ", e);
  }
}

seedApp();
