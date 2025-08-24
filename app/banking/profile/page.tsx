"use client";
import { useEffect, useState, useRef } from "react";
import { Account, Client, Models, Storage } from "appwrite";
import UserAvatar from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import TabList from "@/components/ui/TabList";
import { User, Settings, Shield, Bell, History } from "lucide-react";

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
      .catch((e) => {
        console.error("Error fetching user account:", e);
        setUser(null);
        setLoading(false);
        setError("You must be signed in to view your profile.");
      });
  }, []);

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
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
    } catch (e) {
      console.error("Failed to upload avatar:", e);
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
    } catch (e) {
      console.error("Failed to update profile:", e);
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

  const profileContent = (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
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

  const securityContent = (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Change Password</h4>
          <p className="text-sm text-gray-500 mb-3">
            It's a good practice to change your password regularly
          </p>
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
            type="button"
          >
            Change Password
          </button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500 mb-3">
            Add an extra layer of security to your account
          </p>
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
            type="button"
          >
            Enable 2FA
          </button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Login Sessions</h4>
          <p className="text-sm text-gray-500 mb-3">
            Manage your active sessions and sign out from other devices
          </p>
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
            type="button"
          >
            Manage Sessions
          </button>
        </div>
      </div>
    </div>
  );

  const notificationsContent = (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Transaction Alerts</h4>
            <p className="text-sm text-gray-500">
              Get notified about new transactions
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h4 className="font-medium">Security Alerts</h4>
            <p className="text-sm text-gray-500">
              Get notified about security-related events
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h4 className="font-medium">Marketing Communications</h4>
            <p className="text-sm text-gray-500">
              Receive updates about new features and promotions
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h4 className="font-medium">Email Frequency</h4>
            <p className="text-sm text-gray-500">
              Choose how often you receive emails
            </p>
          </div>
          <select className="rounded-md border border-gray-300 p-2">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Only important</option>
          </select>
        </div>
      </div>
    </div>
  );

  const activityContent = (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold mb-4">Account Activity</h3>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Your recent account activities</p>

        <div className="space-y-4 mt-4">
          <div className="border-b pb-3">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Login</div>
                <div className="text-sm text-gray-500">Chrome on Windows</div>
              </div>
              <div className="text-sm text-gray-500">Just now</div>
            </div>
          </div>

          <div className="border-b pb-3">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Password Changed</div>
                <div className="text-sm text-gray-500">Security update</div>
              </div>
              <div className="text-sm text-gray-500">3 days ago</div>
            </div>
          </div>

          <div className="border-b pb-3">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Profile Updated</div>
                <div className="text-sm text-gray-500">
                  Changed profile picture
                </div>
              </div>
              <div className="text-sm text-gray-500">1 week ago</div>
            </div>
          </div>

          <div className="border-b pb-3">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Account Created</div>
                <div className="text-sm text-gray-500">
                  Welcome to the platform
                </div>
              </div>
              <div className="text-sm text-gray-500">1 month ago</div>
            </div>
          </div>
        </div>

        <button className="text-blue-600 text-sm mt-2">
          View Full Activity Log
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <TabList
        items={[
          {
            value: "profile",
            label: "Personal Info",
            icon: <User className="h-4 w-4 mr-2" />,
            content: profileContent,
          },
          {
            value: "security",
            label: "Security",
            icon: <Shield className="h-4 w-4 mr-2" />,
            content: securityContent,
          },
          {
            value: "notifications",
            label: "Notifications",
            icon: <Bell className="h-4 w-4 mr-2" />,
            content: notificationsContent,
          },
          {
            value: "activity",
            label: "Activity",
            icon: <History className="h-4 w-4 mr-2" />,
            content: activityContent,
          },
        ]}
        defaultValue="profile"
        variant="underline"
        className="w-full"
      />
    </div>
  );
}

export default UserProfileClient;
