// src/components/CommentForm.tsx
import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

interface Props {
  postID: number;
  parentID?: number;
  onSuccess?: () => void;
  isReply?: boolean;
}

export default function CommentForm({ postID, parentID, onSuccess, isReply = false }: Props) {
    const [author, setAuthor] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!author || !content || !email) {
            setMessage('Nama, Email, dan Komentar tidak boleh kosong.');
            setStatus('error');
            return;
        }
        setStatus('submitting');
        setMessage('');

        const payload = {
            author_name: author,
            author_email: email,
            content: content,
            post: postID,
            ...(parentID && { parent: parentID })
        };

        try {
            const response = await fetch(`/items/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Gagal mengirim komentar.');

            setStatus('success');
            setMessage(isReply ? 'Balasan Anda telah terkirim.' : 'Terima kasih! Komentar Anda sedang menunggu persetujuan.');
            setAuthor(''); setEmail(''); setContent('');
            if (onSuccess) onSuccess();
        } catch (err) {
            setStatus('error');
            setMessage('Terjadi kesalahan. Coba lagi nanti.');
        }
    };

    if (status === 'success' && !isReply) {
        return (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                <h3 className="text-xl font-bold font-sans text-green-700 dark:text-green-300">{message}</h3>
            </div>
        );
    }
     if (status === 'success' && isReply) {
        return (
            <div className="p-4 bg-green-500/10 rounded-lg text-center">
                <p className="font-sans text-sm text-green-700 dark:text-green-300">{message}</p>
            </div>
        );
    }


    return (
        <div className={isReply ? 'mt-4' : 'p-6 md:p-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl'}>
            {!isReply && <h3 className="text-2xl font-bold font-sans mb-6">Tinggalkan Komentar</h3>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`author_name_${parentID || 'root'}`} className="block text-sm font-medium mb-2 text-[var(--color-secondary)]">Nama*</label>
                        <input 
                            type="text" 
                            id={`author_name_${parentID || 'root'}`}
                            value={author} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} 
                            required 
                            className="w-full p-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-shadow"
                        />
                    </div>
                    <div>
                        <label htmlFor={`author_email_${parentID || 'root'}`} className="block text-sm font-medium mb-2 text-[var(--color-secondary)]">Email*</label>
                        <input 
                            type="email" 
                            id={`author_email_${parentID || 'root'}`}
                            value={email} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                            required 
                            className="w-full p-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-shadow"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor={`content_${parentID || 'root'}`} className="block text-sm font-medium mb-2 text-[var(--color-secondary)]">Komentar*</label>
                    <textarea 
                        id={`content_${parentID || 'root'}`}
                        value={content} 
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} 
                        required 
                        rows={isReply ? 3 : 5} 
                        placeholder="Tulis sesuatu yang menarik..."
                        className="w-full p-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-shadow"
                    ></textarea>
                </div>
                
                {message && <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                
                <div>
                    <button type="submit" disabled={status === 'submitting'} className="bg-[var(--color-primary)] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-80 disabled:bg-[var(--color-secondary)] transition-colors flex items-center gap-2">
                        {status === 'submitting' && (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>)}
                        {status === 'submitting' ? 'Mengirim...' : 'Kirim Komentar'}
                    </button>
                </div>
            </form>
        </div>
    );
}