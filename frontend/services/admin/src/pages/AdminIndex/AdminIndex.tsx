import ErrorTrackingWidget from '@/components/ErrorTrackingWidget';
import React from 'react';

const AdminIndex = () => {
    return (
        <div>
            <ErrorTrackingWidget errors={
                [
                    {
                        id: 'string',
                        name: "ReferenceError",
                        type: "critical",
                        isFixed: false,
                        message: 'string'
                    }
                ]
            }
            />
        </div>
    );
};

export default AdminIndex;

