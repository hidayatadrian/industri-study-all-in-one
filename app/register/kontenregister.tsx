import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { auth } from '@/lib/firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Alert from '@/components/ui/alert'
interface RegisterFormProps {
    onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [showAlert, setShowAlert] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                onSuccess?.();
                setShowAlert(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleGoogleRegister = async  (e: React.FormEvent)  => {
        e.preventDefault();
    }

    return (
        <div className="">
            <Alert message="Successfully registered!" description="Continue to login page in 3 seconds." show={showAlert}
                onClose={() => setShowAlert(false)}
            />
            <div className="min-h-screen flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto space-y-8">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="6" fill="#4F46E5" />
                                <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                            <span className="text-xl font-bold">Tasky</span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold">Create an Account</h1>
                            <p className="text-gray-600">Please fill in your details to register</p>
                        </div>

                        {error && <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>}

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="password" value={password} onChange={(e) =>
                                            setPassword(e.target.value)}
                                            placeholder="Create a password"
                                            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit"
                                className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Create Account
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or</span>
                                </div>
                            </div>

                            <button onClick={handleGoogleRegister}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                                    {/* Google Icon SVG */}
                                </svg>
                                Sign up  with Google
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Right Side - Illustration */}
                <div className="hidden md:flex w-1/2 bg-indigo-50 items-center justify-center p-12">
                    {/* Your existing illustration code */}
                </div>
            </div>
        </div>

    );
};

export default RegisterForm;
