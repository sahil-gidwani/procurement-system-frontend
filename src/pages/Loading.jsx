import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Loading() {
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay for demonstration
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }, []);

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                // Your main content goes here
                <div className="text-center mt-8">
                    <p className="text-xl font-semibold text-green-600">
                        Download Complete!
                    </p>
                    <p className="text-sm text-gray-500">
                        Your motivation is ready to go.
                    </p>
                </div>
            )}
        </>
    );
}

export default Loading;
