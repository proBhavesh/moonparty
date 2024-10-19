import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useWalletAuth } from "../hooks/useWalletAuth";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import LoadingAnimation from "@/components/ui/Loader";
import { supabase } from "../lib/supabase";
import Image from "next/image";
import { sanitizeFileName } from "../lib/utils";

const WalletConnectButton = dynamic(
  () => import("../components/WalletConnectButton"),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  const { pendingJoin } = router.query;
  const { isAuthenticated, user, publicKey, checkAndSetAuthState } =
    useWalletConnection();
  const { checkWalletExists, authenticateUser, loginUser } = useWalletAuth();
  const [username, setUsername] = useState("");
  const [walletChecked, setWalletChecked] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const checkWallet = useCallback(async () => {
    if (publicKey && !walletChecked) {
      const existingUser = await checkWalletExists(publicKey);
      if (existingUser) {
        await loginUser(existingUser);
        await checkAndSetAuthState();
      }
      setWalletChecked(true);
    }
  }, [
    publicKey,
    walletChecked,
    checkWalletExists,
    loginUser,
    checkAndSetAuthState,
  ]);

  useEffect(() => {
    checkWallet();
  }, [checkWallet]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (pendingJoin) {
        router.push(`/group/join/${pendingJoin}`);
      } else {
        redirectToFirstParty(user.wallet_address);
      }
    }
  }, [isAuthenticated, user, pendingJoin, router]);

  const redirectToFirstParty = async (walletAddress) => {
    try {
      const response = await fetch(`/api/dashboard/${walletAddress}`);
      const parties = await response.json();
      if (parties.length > 0) {
        router.push(`/group/${parties[0].id}`);
      } else {
        router.push("/create-group");
      }
    } catch (error) {
      console.error("Error fetching user parties:", error);
      router.push("/dashboard");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (username && publicKey && avatarFile) {
      setIsCreating(true);
      try {
        const sanitizedFileName = sanitizeFileName(avatarFile.name);
        const fileExt = sanitizedFileName.split(".").pop();
        const fileName = `${Date.now()}_${sanitizedFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`${publicKey}/${fileName}`, avatarFile, {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(uploadData.path);

        const newUser = await authenticateUser(username, publicUrl);

        if (newUser) {
          await createParty(newUser.id, username);
          await checkAndSetAuthState();
          if (pendingJoin) {
            router.push(`/group/join/${pendingJoin}`);
          } else {
            redirectToFirstParty(newUser.wallet_address);
          }
        } else {
          throw new Error("Failed to create user");
        }
      } catch (error) {
        console.error("Error creating user or party:", error);
        setIsCreating(false);
      }
    }
  };

  const createParty = async (userId, partyName) => {
    try {
      const response = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: partyName,
          creatorWallet: publicKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create party");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating party:", error);
      throw error;
    }
  };

  const handleDisconnect = () => {
    setWalletChecked(false);
    // Add any additional disconnect logic here
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <div className="flex flex-col items-center w-full max-w-xs text-center sm:max-w-sm md:max-w-lg">
        <h1 className="pt-10 mb-8 text-4xl font-bold font-reem-kufi-fun">
          🌝 moonparty
        </h1>

        {!publicKey ? (
          <div className="mb-4">
            <WalletConnectButton />
          </div>
        ) : walletChecked && !user ? (
          <>
            <input
              type="text"
              placeholder="Add a username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-5 mb-4 text-center text-white placeholder-purple-300 rounded-3xl bg-dark-blue"
            />

            {/* avatar uploader */}
            <div className="flex justify-center mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <Image
                  width={100}
                  height={100}
                  alt={"avatar image"}
                  src={avatarPreview || "/avatar-default.svg"}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </label>
            </div>

            {/* wallet address */}
            <div className="relative flex w-full gap-5 p-4 mb-4 text-white border-2 border-white border-dashed rounded-3xl">
              <div className="flex w-full">
                <input
                  type="text"
                  value={publicKey}
                  readOnly
                  className="w-full mr-3 overflow-hidden bg-transparent focus:outline-none"
                />
              </div>
              <div>
                <button
                  className="absolute text-white transform -translate-y-1/2 right-4 top-1/2"
                  onClick={handleDisconnect}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* create button */}
            <div className="flex justify-center w-full">
              <button
                onClick={handleCreate}
                disabled={!username || !avatarFile || isCreating}
                className={`w-full p-4 rounded-3xl ${
                  username && avatarFile && !isCreating
                    ? "bg-primary-pink hover:bg-primary-pink/90"
                    : "bg-dark-blue cursor-not-allowed"
                } transition-colors duration-300 flex justify-center items-center`}
              >
                {isCreating ? <LoadingAnimation size={24} /> : "Create"}
              </button>
            </div>
          </>
        ) : (
          <p>
            <LoadingAnimation size={24} />
          </p>
        )}
      </div>
    </div>
  );
}
