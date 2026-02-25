import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import PlaneLoader from './PlaneLoader';

function ProtectedRoute({ children }) {
    const { isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return <PlaneLoader text="Authenticating..." />;

    if (!isSignedIn) return <Navigate to="/login" />;

    return children;
}

export default ProtectedRoute;
