import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-medium">U</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="/signup" className="font-medium text-black hover:text-gray-900">
              create a new account
            </a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}