import React, { useState, useEffect } from 'react';
import { getOrchids } from '../api/orchidApi';

const ListOfOrchids = () => {
    const [orchids, setOrchids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        getOrchids()
            .then(res => { 
                if (active) setOrchids(res.data); 
            })
            .catch(err => { 
                if (active) setError(err.message || 'Error fetching data'); 
            })
            .finally(() => { 
                if (active) setLoading(false); 
            });
        return () => { active = false; };
    }, []);

    if (loading) return <div>Loading orchids...</div>;
    if (error) return <div style={{color: 'red'}}>Error: {error}</div>;
    if (orchids.length === 0) return <div>No orchids found.</div>;

    return (
        <div>
            <h2>Orchid List</h2>
            <ul>
                {orchids.map(orchid => (
                    <li key={orchid.orchidID}>
                        <strong>{orchid.orchidName}</strong> - {orchid.isNatural ? 'Natural' : 'Hybrid'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListOfOrchids;
