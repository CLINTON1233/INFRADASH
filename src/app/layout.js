import { AuthProvider } from './context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'InfraDash - IT Infrastructure Dashboard',
  description: 'IT Infrastructure Dashboard for Seatrium',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}