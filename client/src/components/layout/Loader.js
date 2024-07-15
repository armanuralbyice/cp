import React, { useState, useEffect } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

const Loader = ({ size = 100, color = '#68C9EA', timeout = 3000 }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, timeout);

        return () => clearTimeout(timer);
    }, [timeout]);

    return (
        loading ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <BounceLoader color={color} loading={loading} size={size} />
            </div>
            :
            null
    );
}

export default Loader;
