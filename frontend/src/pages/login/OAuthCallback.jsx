import React from 'react';
import useLogin from '@/hooks/useLogin';

const OAuthCallback = () => {
    const { handleGoogleRedirect } = useLogin();

    React.useEffect(() => {
        handleGoogleRedirect();
    }, [handleGoogleRedirect]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Processing login, please wait...</p>
        </div>
    );
};

export default OAuthCallback;
