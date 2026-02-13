
import React from 'react';
import { SmartSuggestion } from '../types';
import { SparklesIcon, PlusIcon } from './Icons';

interface SmartSuggestionsPanelProps {
  suggestions: SmartSuggestion[];
  onAdd: (name: string) => void;
  isLoading: boolean;
}

const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({ suggestions, onAdd, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-indigo-100 mb-8 animate-pulse">
        <div className="h-4 bg-indigo-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-white rounded-xl"></div>
          <div className="h-12 bg-white rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50 rounded-2xl p-6 border border-indigo-100 mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-indigo-700">
        <SparklesIcon />
        <h2 className="font-bold text-lg">Smart Suggestions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-50 flex flex-col justify-between group">
            <div>
              <h3 className="font-bold text-gray-800">{suggestion.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{suggestion.reason}</p>
            </div>
            <button 
              onClick={() => onAdd(suggestion.name)}
              className="mt-3 flex items-center justify-center gap-1 w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <PlusIcon /> Add to List
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestionsPanel;
