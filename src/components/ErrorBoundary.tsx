import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0F172A] text-white font-sans">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/20">
              <span className="text-rose-500 font-bold text-4xl">!</span>
            </div>
            
            <h1 className="text-3xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Oops! Something broke.
            </h1>

            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 mb-8 text-left overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500/50 mb-2">Error Log</p>
              <p className="text-xs font-mono text-rose-300 break-words line-clamp-4">
                {this.state.error?.message || 'Unknown runtime error occurred in the engine.'}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all shadow-lg active:scale-95"
              >
                Refresh App
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold transition-all border border-white/10"
              >
                Reset Deep Settings
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
