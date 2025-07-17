// app/layout.js

import './globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Providers from './providers';

export const metadata = {
  title: 'Beanies On Business',
  description: 'DAO site',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Providers>
          <NavBar />
          <main className="min-h-screen px-4 sm:px-6 md:px-12">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}