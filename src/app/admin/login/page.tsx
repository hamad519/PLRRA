import { AuthForm } from '@/components/forms/AuthForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm type="login" />
    </div>
  );
}