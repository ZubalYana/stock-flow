import Logo from '../layout/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full max-h-screen relative flex flex-col lg:flex-row">
        <div className="absolute top-5 left-5 lg:top-8 lg:left-10 z-10">
      <Logo />
      </div>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-primary/10 p-16">
        <img src="/trip-illustration.svg" alt="trip illustration" className="w-full max-w-[90%]" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 py-24 lg:py-5">
        {children}
      </div>
    </div>
  );
}