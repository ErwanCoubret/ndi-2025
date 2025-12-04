"use client";

import { usePathname } from "next/navigation";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
	const currentRoute = usePathname();

	return (
		<>
			<div className="hidden lg:flex">
				<DesktopNavbar
					currentRoute={currentRoute}
				/>
			</div>

			<div className="lg:hidden">
				<MobileNavbar
					currentRoute={currentRoute}
				/>
			</div>
		</>
	);
};

export default Navbar;