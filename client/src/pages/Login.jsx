import { SignIn } from '@clerk/clerk-react';

function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <SignIn routing="path" path="/login" fallbackRedirectUrl="/dashboard" signUpUrl="/signup" appearance={{ variables: { colorBackground: '#18181B', colorText: 'white', colorPrimary: 'white', colorTextOnPrimaryBackground: 'black' } }} />
        </div>
    );
}

export default Login;
