import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import WalletConnectButton from "./WalletConnectButton";
import { useWalletConnection } from "../context/WalletConnectionProvider";

const Navbar = () => {
	const { isAuthenticated, logout } = useWalletConnection();
	const [showDropdown, setShowDropdown] = useState(false);

	const toggleDropdown = () => setShowDropdown(!showDropdown);

	return (
		<nav className="h-16 px-6 py-3.5 justify-center items-center gap-3.5 inline-flex w-full">
			<div className="flex items-center justify-start grow shrink basis-0 h-9">
				<Link href="/" className="text-2xl text-center text-white">MoonParty</Link>
				<ChevronDown className="text-white" size={30} />
			</div>
			<button onClick={toggleDropdown} className="focus:outline-none">
				<Image
					width={40}
					height={40}
					alt="User Avatar"
					src="/sample-img.png"
					className="w-8 h-8 rounded-full"
				/>
			</button>

			{showDropdown && (
				<div className="absolute right-0 z-10 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
					<WalletConnectButton />
					{isAuthenticated && (
						<button
							onClick={logout}
							className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
						>
							Logout
						</button>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
