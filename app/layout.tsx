import './globals.css';
// import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import AppIcon from './../public/logo-app.png';

// const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hệ thống quản lý lớp học',
  description: 'English Learning App',
  // icon: [{ rel: 'icon', url: AppIcon.src }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="icon" href="/logo-app.png" sizes="any" />
      </head>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
