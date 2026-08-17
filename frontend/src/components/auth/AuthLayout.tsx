import Logo from '../layout/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full h-screen max-h-screen relative flex flex-col">
        <div className="absolute top-5 left-5 lg:top-8 lg:left-10 z-10">
      <Logo />
      </div>

      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}