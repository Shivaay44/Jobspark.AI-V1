import { Loader2 } from 'lucide-react';

interface Props {
  text?: string;
}

export default function LoadingSpinner({
  text = 'Loading...',
}: Props) {
  return (
    <div className="flex items-center gap-3 py-4 text-indigo-400 font-medium">
      <Loader2 className="animate-spin w-5 h-5 text-indigo-500" />
      <span className="text-sm text-slate-300 animate-pulse">{text}</span>
    </div>
  );
}
