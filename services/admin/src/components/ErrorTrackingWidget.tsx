import React from 'react';
import cl from "@/utils/styles/modules/ErrorTrackingWidget.module.scss"

type TrackedError = {
    id: string
    name: "TypeError" | "ReferenceError"
    type: "normal" | "critical" | "warning"
    isFixed: boolean
    message: string
}

type ErrorTrackingWidgetProps = {
    errors: TrackedError[];
};

const ErrorTrackingWidget: React.FC<ErrorTrackingWidgetProps> = ({ errors }) => {
    return (
        <div className={cl.widget}>
            {errors.length === 0 && (
                <div className={cl.altText}>Поки все чисто ^)</div>
            )}

            {errors.length > 0 && errors.map((error) => (
                <div 
                    key={error.id}
                    className={`${cl.errorCard} ${cl[error.type]}`}
                >{error.message}</div>
            ))}
        </div>
    );
};


export default ErrorTrackingWidget;