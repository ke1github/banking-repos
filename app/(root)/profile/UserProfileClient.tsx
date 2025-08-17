"use client";
import { useEffect, useState, useRef } from "react";
import { Account, Client, Models, Storage, ID } from "appwrite";
import UserAvatar from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";

function UserProfileClient() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const client = new Client()
      .setEndpoint(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
          "https://cloud.appwrite.io/v1"
      )
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");
    const account = new Account(client);
    account
      .get()
      .then((u) => {
        setUser(u);
        setName(u.name);
        setEmail(u.email);
        // Try to get avatar from preferences or fallback
        if (u.prefs && u.prefs.avatarUrl) {
          setAvatarUrl(u.prefs.avatarUrl);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
        setError("You must be signed in to view your profile.");
      });
  }, []);

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarFile(file);
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const client = new Client()
        .setEndpoint(
          process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
            "https://cloud.appwrite.io/v1"
        )
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");
      const storage = new Storage(client);
      // Use user id as file id for easy overwrite
      const bucketId = process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID!;
      await storage.createFile(bucketId, user.$id, file);
      // Get file preview URL
      const url = storage.getFilePreview(bucketId, user.$id);
      setAvatarUrl(url);
      // Save avatar url to user prefs
      const account = new Account(client);
      await account.updatePrefs({ avatarUrl: url });
      setSuccess("Avatar updated!");
    } catch (err) {
      setError("Failed to upload avatar.");
    } finally {
      setSaving(false);
    }
  };

  // Handle profile save
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const client = new Client()
        .setEndpoint(
          process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
            "https://cloud.appwrite.io/v1"
        )
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");
      const account = new Account(client);
      if (name !== user.name) {
        await account.updateName(name);
      }
      if (email !== user.email) {
        // Appwrite requires the current password to update email
        const currentPassword = prompt(
          "Please enter your current password to change your email:"
        );
        if (!currentPassword)
          throw new Error("Password is required to change email.");
        await account.updateEmail(email, currentPassword);
      }
      setSuccess("Profile updated!");
      setEditMode(false);
      // Refresh user
      const updated = await account.get();
      setUser(updated);
      setName(updated.name);
      setEmail(updated.email);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (!user)
    return <p className="text-red-600">{error || "User not found."}</p>;

  // Parse first/last name for avatar fallback
  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.length > 0 ? rest[rest.length - 1] : undefined;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 max-w-lg">
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <UserAvatar
            src={avatarUrl}
            firstName={firstName}
            lastName={lastName}
            size="xl"
            className="shadow"
          />
          <button
            className={cn(
              "absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border border-white shadow hover:bg-blue-700 transition",
              saving && "opacity-50 cursor-not-allowed"
            )}
            title="Change avatar"
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            type="button"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0-2a7 7 0 1 0 0 14A7 7 0 0 0 12 5Zm6.707 2.293a1 1 0 0 1 0 1.414l-12 12a1 1 0 0 1-1.414-1.414l12-12a1 1 0 0 1 1.414 0Z"
              />
            </svg>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={saving}
            />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
          <div className="text-gray-500 text-sm">{user.email}</div>
          <div className="text-gray-400 text-xs mt-1">User ID: {user.$id}</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex gap-2">
          <span className="font-medium">Status:</span>
          <span
            className={
              user.emailVerification ? "text-green-600" : "text-yellow-600"
            }
          >
            {user.emailVerification ? "Verified" : "Unverified"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium">Registered:</span>
          <span>{new Date(user.$createdAt).toLocaleString()}</span>
        </div>
        {/* Add more fields as needed */}
      </div>
      {editMode ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              type="email"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
              type="button"
            >
              Save
            </button>
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium"
              onClick={() => {
                setEditMode(false);
                setName(user.name);
                setEmail(user.email);
              }}
              disabled={saving}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <span className="font-medium">Name:</span> <span>{user.name}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-medium">Email:</span>{" "}
            <span>{user.email}</span>
          </div>
          <button
            className="mt-3 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
            onClick={() => setEditMode(true)}
            type="button"
          >
            Edit Profile
          </button>
        </div>
      )}
      {success && <div className="text-green-600 mt-3">{success}</div>}
      {error && <div className="text-red-600 mt-3">{error}</div>}
    </div>
  );
}

export default UserProfileClient;
