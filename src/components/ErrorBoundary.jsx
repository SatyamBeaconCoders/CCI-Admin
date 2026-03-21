import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

/**
 * GLOBAL ERROR BOUNDARY
 * Catches runtime crashes and shows a friendly recovery UI instead of a blank white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("🚨 [RUNTIME CRASH]:", error, errorInfo);
  }

  handleReset = () => {
    // replace avoids history bloat
    window.location.replace("/dashboard");
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-red-50 p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Something went wrong
              </h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                The application encountered an unexpected error. Don't worry,
                your data is safe.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="p-4 bg-gray-50 rounded-2xl text-left overflow-auto max-h-32 border border-gray-100 mb-4">
                <code className="text-[10px] text-red-600 font-bold whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
              >
                <Home className="w-4 h-4" /> Go Home
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              CCI Admin Production Shield Activated
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
