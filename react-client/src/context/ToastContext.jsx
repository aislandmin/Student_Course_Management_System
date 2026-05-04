import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, variant = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, variant }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                {toasts.map((t) => (
                    <Toast
                        key={t.id}
                        onClose={() => removeToast(t.id)}
                        show={true}
                        delay={3000}
                        autohide
                        bg={t.variant}
                    >
                        <Toast.Header>
                            <strong className="me-auto">Notification</strong>
                        </Toast.Header>
                        <Toast.Body className={t.variant === "dark" || t.variant === "danger" || t.variant === "success" || t.variant === "primary" ? "text-white" : ""}>
                            {t.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
