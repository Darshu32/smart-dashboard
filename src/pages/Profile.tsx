import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    let photoURL = user.photoURL;

    // 🔥 If a new image is selected, upload it
    if (image) {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, image);
      photoURL = await getDownloadURL(storageRef);
    }

    // 🔥 Save name + photoURL to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name,
      photoURL,
    });

    // ✅ Optionally update Firebase Auth profile
    await updateProfile(user, {
      displayName: name,
      photoURL,
    });

    alert("✅ Profile saved!");
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/animation/2022/12/05/10/47/10-47-58-930_512.gif')",
      }}
    >
      <div className="w-full max-w-md p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">👤 Profile Settings</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border p-2 rounded"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
