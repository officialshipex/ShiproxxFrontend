import React from "react";

// Without this, any uncaught render-time error anywhere in the tree unmounts
// the whole app to a blank white page with no indication anything went wrong
// (confirmed no error boundary existed anywhere in this codebase). This
// catches that, logs the real error/stack to the console for debugging, and
// shows a recoverable message instead of a silent blank screen.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-sm w-full text-center">
            <h1 className="text-[14px] font-bold text-gray-800 mb-1">Something went wrong</h1>
            <p className="text-[12px] text-gray-500 mb-4">
              This page ran into an unexpected error. Reloading usually fixes it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#10BE3B] text-white text-[12px] font-[600] hover:opacity-90 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
