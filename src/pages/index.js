import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useWalletAuth } from "../hooks/useWalletAuth";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

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

	const handleCreate = async () => {
		if (username && publicKey) {
			const user = await authenticateUser(username);
			if (user) {
				router.push("/dashboard");
			}
		}
	};

	const handleDisconnect = () => {
		// Implement wallet disconnection logic here
		setWalletChecked(false);
	};

	return (
		<div className="mt-5 text-white">
			<div className="text-center">
				<h1 className="mb-8 text-4xl font-bold font-reem-kufi-fun">
					🌝 moonparty
				</h1>

				<div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 rounded-full bg-dark-blue">
					<div className="text-4xl">😊</div>
				</div>

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
							className="w-screen max-w-md py-5 mb-4 text-center text-white placeholder-purple-300 rounded-3xl bg-dark-blue"
						/>

						<div className="relative mb-4">
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

						<button
							onClick={handleCreate}
							disabled={!username}
							className={`w-full max-w-md p-4 rounded-3xl ${
								username
									? "bg-primary-pink hover:bg-primary-pink/90"
									: "bg-dark-blue cursor-not-allowed"
							} transition-colors duration-300`}
						>
							Create
						</button>
					</>
				) : (
					<p>Checking wallet...</p>
				)}
			</div>
		</div>
	);
}
