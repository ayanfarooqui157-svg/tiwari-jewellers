import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useShop } from '../context/useShop';

export const Toast = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  const { title, message, type } = toastMessage;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
        type === 'gold' 
          ? 'bg-burgundy text-white border-gold/50 shadow-gold/20' 
          : type === 'burgundy'
          ? 'bg-burgundy text-gold-100 border-burgundy-700 shadow-burgundy/30'
          : type === 'error'
          ? 'bg-red-900 text-white border-red-700'
          : 'bg-charcoal-800 text-ivory border-charcoal-600'
      }`}>
        <div className="mt-0.5">
          {type === 'gold' || type === 'burgundy' ? (
            <Sparkles className="w-5 h-5 text-gold" />
          ) : type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-xs font-bold tracking-wide uppercase text-gold-200">
            {title}
          </h4>
          <p className="text-xs text-ivory/85 mt-0.5 font-sans leading-normal">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
