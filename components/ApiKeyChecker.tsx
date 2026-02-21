import React, { useEffect, useState } from 'react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';

interface Props {
    onKeyReady: () => void;
}

export const ApiKeyChecker: React.FC<Props> = ({ onKeyReady }) => {
    const [showOverlay, setShowOverlay] = useState<boolean>(true);
    const [apiKey, setApiKey] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        const stored = getStoredApiKey();
        if (stored) {
            setShowOverlay(false);
            onKeyReady();
        }
    }, [onKeyReady]);

    const handleSaveKey = async () => {
        const trimmed = apiKey.trim();
        if (!trimmed) {
            setError('Please enter your API key.');
            return;
        }
        if (trimmed.length < 10) {
            setError('This doesn\'t look like a valid API key.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // Quick validation: try a lightweight API call
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: trimmed });
            await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: 'Reply with only the word OK',
            });

            // Key works — persist it
            setStoredApiKey(trimmed);
            setShowOverlay(false);
            onKeyReady();
        } catch (e: any) {
            const msg = e?.message || '';
            if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || msg.includes('401') || msg.includes('403')) {
                setError('Invalid API key. Please check your key and try again.');
            } else {
                // Key might be valid but hit a different error (like rate limit or region) — still save it
                setStoredApiKey(trimmed);
                setShowOverlay(false);
                onKeyReady();
            }
        } finally {
            setSaving(false);
        }
    };

    if (!showOverlay) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-indigo-200 mb-8">S</div>

                <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tight">
                    API Key Required
                </h2>

                <p className="text-slate-500 mb-6 leading-relaxed text-sm font-medium">
                    Enter your Google Gemini API key to enable AI smart suggestions. Your key is stored locally in your browser and never sent to our servers.
                </p>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Paste your key here</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className={`w-full bg-slate-50 border ${error ? 'border-rose-200' : 'border-slate-200'} rounded-2xl py-4 px-5 text-slate-700 outline-none focus:ring-2 ${error ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'} font-bold transition-all placeholder:text-slate-300`}
                        />
                        {error && <p className="mt-2 text-rose-500 text-[10px] font-bold ml-1">{error}</p>}
                    </div>

                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest ml-1 transition-colors"
                    >
                        Get a free key here
                        <span className="material-icons-round text-[10px]">open_in_new</span>
                    </a>
                </div>

                <button
                    onClick={handleSaveKey}
                    disabled={saving}
                    className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Validating...' : 'Get Started'}
                </button>
            </div>
        </div>
    );
};
