import { LayoutDashboard } from "lucide-react";

const Logo = () => {
	return (
		<div className="flex items-center gap-2">
			<div className="rounded-md bg-amber-600 p-1 text-white">
				<LayoutDashboard />
			</div>
			<span>Lattice</span>
		</div>
	);
};

export default Logo;
