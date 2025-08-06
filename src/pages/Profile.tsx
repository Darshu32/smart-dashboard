import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { FiUser } from "react-icons/fi";

export default function Profile() {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    let photoURL = user.photoURL;

    if (image) {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, image);
      photoURL = await getDownloadURL(storageRef);
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name,
      photoURL,
    });

    await updateProfile(user, {
      displayName: name,
      photoURL,
    });

    alert("✅ Profile saved!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">

      <div className="w-full max-w-md p-6 bg-zinc-900 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-pink-500">

          <FiUser className="text-pink-500 text-3xl" /> {/* ✅ Icon here */}
          Profile Settings
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-700 bg-zinc-800 p-2 rounded text-white placeholder-gray-400"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="border border-gray-700 bg-zinc-800 p-2 rounded text-white"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
