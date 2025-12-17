"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/services/authService";
import { apiClient } from "@/utils/api/client";
import { useToast } from "@/components/common/ToastProvider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingPasswordSaving, setIsChangingPasswordSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    no_handphone: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/");
          return;
        }
        const userData = authService.getUser();
        setUser(userData);
        setFormData({
          username: userData?.username || "",
          email: userData?.email || "",
          no_handphone: userData?.no_handphone || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await apiClient.put("/users/profile", {
        username: formData.username,
        no_handphone: formData.no_handphone,
      });

      // Update user in localStorage
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData({
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        no_handphone: updatedUser.no_handphone || "",
      });
      setIsEditing(false);
      toast.showSuccess("Profil berhasil diupdate!");
      
      // Dispatch custom event untuk notify home page bahwa user data updated
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
        detail: updatedUser 
      }));
    } catch (error) {
      console.error("Save error:", error);
      toast.showError(error.data?.message || "Gagal update profil. Coba lagi.");
      // Revert form data ke original
      setFormData({
        username: user?.username || "",
        email: user?.email || "",
        no_handphone: user?.no_handphone || "",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    // Validate
    if (!passwordFormData.old_password || !passwordFormData.new_password || !passwordFormData.confirm_password) {
      toast.showError("Semua field harus diisi");
      return;
    }

    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      toast.showError("Password baru tidak cocok");
      return;
    }

    setIsChangingPasswordSaving(true);
    try {
      await apiClient.put("/users/change-password", {
        old_password: passwordFormData.old_password,
        new_password: passwordFormData.new_password,
        confirm_password: passwordFormData.confirm_password,
      });

      toast.showSuccess("Password berhasil diubah!");
      setIsChangingPassword(false);
      setPasswordFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      toast.showError(error.data?.error || error.data?.message || "Gagal mengubah password");
    } finally {
      setIsChangingPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {/* Profile Avatar */}
          <div className="mb-8 text-center">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username || "User"}&size=128&background=random`}
              alt={user?.username}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.username}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            {user?.role === "admin" && (
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                Admin
              </span>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {user?.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="no_handphone"
                  value={formData.no_handphone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {user?.no_handphone || "Not set"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Member Since
              </label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600">
                {new Date(user?.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-gray-400"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
            
            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold"
              >
                Change Password
              </button>
            ) : (
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-semibold text-gray-900 mb-4">Change Your Password</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="old_password"
                      value={passwordFormData.old_password}
                      onChange={handlePasswordInputChange}
                      placeholder="Enter your current password"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordFormData.new_password}
                      onChange={handlePasswordInputChange}
                      placeholder="Enter new password (min 6 chars, include uppercase, lowercase, number)"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must contain uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={passwordFormData.confirm_password}
                      onChange={handlePasswordInputChange}
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={isChangingPasswordSaving}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400"
                    >
                      {isChangingPasswordSaving ? "Changing..." : "Change Password"}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordFormData({
                          old_password: "",
                          new_password: "",
                          confirm_password: "",
                        });
                      }}
                      className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
