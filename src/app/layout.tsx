import { Inter } from 'next/font/google';
import { Bounce, ToastContainer } from 'react-toastify';
import { headers } from 'next/headers';
import Script from 'next/script';

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: "TDBlog - A article for developers",
//   description: "A article for developers",
// };

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headerList = headers();
	const pathname = headerList.get('x-current-path');


	return (
		<html lang="en" className="">
			<body className={inter.className}>
				{children}
				<ToastContainer
					position="top-center"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="dark"
					transition={Bounce}
				/>
				{/* syntax highlighting for <code> blocks */}
				<Script
					id="google-pretty"
					src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"
				></Script>
				<Script type="application/ld+json" id="json-ld">
					{/* {await generateStructuredData()} */}
				</Script>

				<Script async src="https://www.googletagmanager.com/gtag/js?id=G-M4ZQBTYJ98"></Script>
				<Script
					id="googleanalytics"
					dangerouslySetInnerHTML={{
						__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-M4ZQBTYJ98');
          `,
					}}
				></Script>

			</body>
		</html>
	);
}
