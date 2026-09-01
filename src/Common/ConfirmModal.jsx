import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmModal = ({
    isOpen,
    title = "Are you sure?",
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1100]">
            <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-100 p-1.5 rounded-full text-red-500">
                        <FiAlertTriangle size={14} />
                    </div>
                    <h2 className="text-[12px] sm:text-[14px] text-gray-700 font-[600]">{title}</h2>
                </div>
                {message && (
                    <p className="text-[10px] sm:text-[12px] text-gray-500 mb-4">{message}</p>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        className="bg-gray-200 text-[10px] sm:text-[12px] font-[600] text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-all"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 font-[600] rounded-lg text-[10px] sm:text-[12px] transition-all"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
