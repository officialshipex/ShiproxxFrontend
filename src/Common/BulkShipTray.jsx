import React, { useEffect } from "react";
import { ChevronUp, ChevronDown, X, Loader2, CheckCircle2, XCircle, Circle } from "lucide-react";
import { useBulkShipJob } from "../utils/BulkShipJobProvider";

const statusIcon = (status) => {
    switch (status) {
        case "processing":
            return <Loader2 className="w-3.5 h-3.5 text-[#10BE3B] animate-spin flex-shrink-0" />;
        case "success":
            return <CheckCircle2 className="w-3.5 h-3.5 text-[#10BE3B] flex-shrink-0" />;
        case "failed":
            return <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />;
        default:
            return <Circle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />;
    }
};

const BulkShipTray = () => {
    const { job, isExpanded, toggleExpanded, fetchDetailOnce, closeJob } = useBulkShipJob();

    useEffect(() => {
        if (isExpanded && job && !job.results) {
            fetchDetailOnce();
        }
    }, [isExpanded, job, fetchDetailOnce]);

    if (!job) return null;

    const isRunning = job.status === "running";
    const doneCount = (job.successCount || 0) + (job.failureCount || 0);
    const hasFailures = (job.failureCount || 0) > 0;

    const summaryText = isRunning
        ? `Creating shipments… ${doneCount}/${job.totalOrders}`
        : `Bulk Ship Completed — ${job.successCount || 0} succeeded, ${job.failureCount || 0} failed`;

    return (
        <div className="fixed bottom-6 right-6 z-[999] w-[320px] font-[600] text-[12px]">
            <div className={`rounded-xl shadow-lg border overflow-hidden bg-white ${!isRunning && hasFailures ? "border-red-200" : !isRunning ? "border-green-200" : "border-gray-200"
                }`}>
                <button
                    type="button"
                    onClick={toggleExpanded}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left ${!isRunning && hasFailures ? "bg-red-50" : !isRunning ? "bg-green-50" : "bg-white"
                        }`}
                >
                    {isRunning ? (
                        <Loader2 className="w-4 h-4 text-[#10BE3B] animate-spin flex-shrink-0" />
                    ) : hasFailures ? (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#10BE3B] flex-shrink-0" />
                    )}
                    <span className="flex-1 text-gray-700 truncate">{summaryText}</span>
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                </button>

                {isExpanded && (
                    <div className="border-t border-gray-200">
                        <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                            {job.results && job.results.length > 0 ? (
                                job.results.map((r, idx) => (
                                    <div key={idx} className="flex items-start gap-2 px-4 py-2">
                                        {statusIcon(r.status)}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-gray-700">
                                                Order {r.displayOrderId ?? "—"}
                                            </div>
                                            {r.status === "success" && r.courierServiceName && (
                                                <div className="text-[10px] text-[#10BE3B] truncate">
                                                    Shipped via {r.courierServiceName}
                                                </div>
                                            )}
                                            {r.status === "failed" && r.failureReason && (
                                                <div className="text-[10px] text-red-500 truncate" title={r.failureReason}>
                                                    {r.failureReason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-gray-400 text-center">Loading details…</div>
                            )}
                        </div>
                        {!isRunning && (
                            <div className="px-4 py-2 border-t border-gray-200 flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeJob}
                                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkShipTray;
