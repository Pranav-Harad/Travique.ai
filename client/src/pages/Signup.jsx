import { SignUp } from '@clerk/clerk-react';

function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <SignUp routing="path" path="/signup" fallbackRedirectUrl="/dashboard" signInUrl="/login" appearance={{ variables: { colorBackground: '#18181B', colorText: 'white', colorPrimary: 'white', colorTextOnPrimaryBackground: 'black' } }} />
        </div>
    );
}

export default Signup;
