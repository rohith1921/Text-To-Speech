import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 max-w-2xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
            <FiAlertTriangle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
            <h2 className="mt-4 text-2xl font-bold text-red-600 dark:text-red-400">
              Oops! Something went wrong
            </h2>
            <p className="mt-2 text-red-700 dark:text-red-300">
              {this.state.error.message}
            </p>
            <button
              onClick={this.handleRefresh}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto"
            >
              <FiRefreshCw className="h-5 w-5" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}