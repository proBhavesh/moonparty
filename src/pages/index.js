import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useWalletAuth } from "../hooks/useWalletAuth";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import LoadingAnimation from "@/components/ui/Loader";
import { supabase } from "../lib/supabase";
import Image from "next/image";

const WalletConnectButton = dynamic(
	() => import("../components/WalletConnectButton"),
	{ ssr: false }
);

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, user, publicKey } = useWalletConnection();
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
				router.push("/dashboard");
			}
			setWalletChecked(true);
		}
	}, [publicKey, walletChecked, checkWalletExists, loginUser, router]);

	useEffect(() => {
		checkWallet();
	}, [checkWallet]);

	useEffect(() => {
		if (isAuthenticated && user) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, user, router]);

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
				// Upload avatar to Supabase Storage
				const { data: uploadData, error: uploadError } =
					await supabase.storage
						.from("avatars")
						.upload(`${publicKey}/${avatarFile.name}`, avatarFile);

				if (uploadError) throw uploadError;

				console.log("Uploaded avatar:", uploadData);
				console.log("upload error:", uploadError);

				// Get public URL of the uploaded avatar
				const {
					data: { publicUrl },
				} = supabase.storage
					.from("avatars")
					.getPublicUrl(uploadData.path);

				// Create user with avatar URL
				const user = await authenticateUser(username, publicUrl);

				if (user) {
					// Create a party for the user
					await createParty(user.id, username);
					router.push("/dashboard");
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

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error creating party:", error);
			throw error;
		}
	};

	const handleDisconnect = () => {
		// Implement wallet disconnection logic here
		setWalletChecked(false);
	};

	return (
		<div className="text-white">
			<div className="text-center">
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
							className="w-full max-w-md py-5 mb-4 text-center text-white placeholder-purple-300 rounded-3xl bg-dark-blue"
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
							<label
								htmlFor="avatar-upload"
								className="cursor-pointer"
							>
								<Image
									width={100}
									height={100}
									alt={"avatar image"}
									src={"/avatar-default.svg"}
								/>
							</label>
						</div>

						{/* <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="inline-block px-4 py-2 font-bold text-white rounded-full cursor-pointer bg-primary-pink hover:bg-primary-pink/90"
              >
                {avatarPreview ? "Change Avatar" : "Upload Avatar"}
              </label>
              {avatarPreview && (
                <div className="mt-2">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-24 h-24 mx-auto rounded-full"
                  />
                </div>
              )}
            </div> */}

						<div className="relative w-full max-w-md mx-auto mb-4">
							<input
								type="text"
								value={publicKey}
								readOnly
								className="w-full p-4 text-white border-2 border-white border-dashed rounded-3xl bg-primary-blue focus:outline-none"
							/>
							<button
								className="absolute text-white transform -translate-y-1/2 right-4 top-1/2"
								onClick={handleDisconnect}
							>
								<X size={20} />
							</button>
						</div>

						<div className="flex justify-center w-full max-w-md mx-auto">
							<button
								onClick={handleCreate}
								disabled={
									!username || !avatarFile || isCreating
								}
								className={`w-full p-4 rounded-3xl ${
									username && avatarFile && !isCreating
										? "bg-primary-pink hover:bg-primary-pink/90"
										: "bg-dark-blue cursor-not-allowed"
								} transition-colors duration-300 flex justify-center items-center`}
							>
								{isCreating ? (
									<LoadingAnimation size={24} />
								) : (
									"Create"
								)}
							</button>
						</div>
					</>
				) : (
					<p>Checking wallet...</p>
				)}
			</div>
		</div>
	);
}
