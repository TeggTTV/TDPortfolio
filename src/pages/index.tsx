import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import '../app/globals.css';
import { ThemeProvider } from 'next-themes';
import Navbar from '../components/Navbar';

export default function Home({ data }: any) {
	const router = useRouter();

	useEffect(() => {}, []);

	// get pathname
	const pathname = usePathname();

	return (
		<ThemeProvider defaultTheme="light">
			<Navbar page={pathname === '/' ? '/' : pathname} />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				transition={Bounce}
			/>
		</ThemeProvider>
	);
}

export async function getStaticProps() {
	return {
		props: {},
	};
}
