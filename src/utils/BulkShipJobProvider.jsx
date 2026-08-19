import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const POLL_INTERVAL_MS = 2500;

const BulkShipJobContext = createContext(null);
export const useBulkShipJob = () => useContext(BulkShipJobContext);

// Module-level bridge so files outside this provider's subtree (e.g. Orders.jsx,
// which unmounts on every tab switch) can start/check a job without prop drilling —
// mirrors the pattern used by Notification.jsx/ToastRegister.
let bridge = null;

export const startBulkShipJob = (jobId, totalOrders) => {
    if (bridge) {
        bridge.startJob(jobId, totalOrders);
    } else {
        console.warn("BulkShipJobProvider not mounted yet");
    }
};

export const hasActiveBulkShipJob = () => (bridge ? bridge.hasActiveJob() : false);

const authHeaders = () => ({ headers: { authorization: `Bearer ${Cookies.get("session")}` } });

export const BulkShipJobProvider = ({ children }) => {
    const [job, setJob] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const jobRef = useRef(job);
    const isExpandedRef = useRef(isExpanded);
    const intervalRef = useRef(null);

    useEffect(() => { jobRef.current = job; }, [job]);
    useEffect(() => { isExpandedRef.current = isExpanded; }, [isExpanded]);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const pollOnce = useCallback(async () => {
        const currentJob = jobRef.current;
        if (!currentJob) return;
        try {
            const detail = isExpandedRef.current ? "?detail=true" : "";
            const response = await axios.get(
                `${REACT_APP_BACKEND_URL}/bulk/bulk-ship-status/${currentJob.jobId}${detail}`,
                authHeaders()
            );
            const updated = response.data?.job;
            if (!updated) return;
            setJob((prev) => (prev ? { ...prev, ...updated, jobId: prev.jobId } : prev));
            if (updated.status === "completed") stopPolling();
        } catch (error) {
            if (error?.response?.status === 401) stopPolling();
        }
    }, [stopPolling]);

    const startPolling = useCallback(() => {
        stopPolling();
        intervalRef.current = setInterval(pollOnce, POLL_INTERVAL_MS);
    }, [pollOnce, stopPolling]);

    const startJob = useCallback((jobId, totalOrders) => {
        setJob({
            jobId,
            totalOrders,
            status: "running",
            successCount: 0,
            failureCount: 0,
            results: undefined,
        });
        setIsExpanded(false);
        startPolling();
    }, [startPolling]);

    const hasActiveJob = useCallback(() => !!jobRef.current, []);

    useEffect(() => {
        bridge = { startJob, hasActiveJob };
        return () => { bridge = null; };
    }, [startJob, hasActiveJob]);

    // Recover an in-progress or unacknowledged-completed job after a page refresh.
    useEffect(() => {
        const recover = async () => {
            try {
                const response = await axios.get(`${REACT_APP_BACKEND_URL}/bulk/bulk-ship-active`, authHeaders());
                const recovered = response.data?.job;
                if (recovered) {
                    setJob({
                        jobId: recovered._id,
                        totalOrders: recovered.totalOrders,
                        status: recovered.status,
                        successCount: recovered.successCount,
                        failureCount: recovered.failureCount,
                        results: undefined,
                    });
                    if (recovered.status === "running") startPolling();
                }
            } catch (error) {
                // no session yet / not authenticated — nothing to recover
            }
        };
        recover();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Pause polling while the tab is hidden, resume + refresh immediately when visible.
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) {
                stopPolling();
            } else if (jobRef.current && jobRef.current.status === "running") {
                pollOnce();
                startPolling();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [pollOnce, startPolling, stopPolling]);

    useEffect(() => stopPolling, [stopPolling]);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const fetchDetailOnce = useCallback(async () => {
        const currentJob = jobRef.current;
        if (!currentJob) return;
        try {
            const response = await axios.get(
                `${REACT_APP_BACKEND_URL}/bulk/bulk-ship-status/${currentJob.jobId}?detail=true`,
                authHeaders()
            );
            const updated = response.data?.job;
            if (updated) setJob((prev) => (prev ? { ...prev, ...updated, jobId: prev.jobId } : prev));
        } catch (error) {
            // ignore — next poll tick will retry
        }
    }, []);

    const closeJob = useCallback(async () => {
        const currentJob = jobRef.current;
        if (!currentJob) return;
        try {
            await axios.post(
                `${REACT_APP_BACKEND_URL}/bulk/bulk-ship-acknowledge/${currentJob.jobId}`,
                {},
                authHeaders()
            );
        } catch (error) {
            // even if the ack fails, still clear locally so the user isn't stuck
        }
        stopPolling();
        setJob(null);
        setIsExpanded(false);
    }, [stopPolling]);

    return (
        <BulkShipJobContext.Provider value={{ job, isExpanded, toggleExpanded, fetchDetailOnce, closeJob }}>
            {children}
        </BulkShipJobContext.Provider>
    );
};
