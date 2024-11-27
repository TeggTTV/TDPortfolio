import Link from "next/link";

export default function Navbar({ page }: { page: string }) {


	return (
		<div className="absolute top-0 w-full h-24">
			<div className="container mx-auto h-full flex items-center justify-between">
				<Link href={
                    page === "/" ? "" : "/"
                } className="text-2xl font-bold">
					TDPortfolio
				</Link>
				<div className="flex space-x-4">
					<Link href={
                        page === "/" ? "" : "/"
                    } className="hover:text-blue-500">
						Home
					</Link>
					<Link href="/about" className="hover:text-blue-500">
						About
					</Link>
					<Link href="/contact" className="hover:text-blue-500">
						Contact
					</Link>
				</div>
			</div>
		</div>
	);
}
