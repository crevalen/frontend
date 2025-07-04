// src/components/ReplyButton.tsx
import React, { useState } from 'react';
import CommentForm from './CommentForm';

interface Props {
  postID: number;
  commentID: number;
}

export default function ReplyButton({ postID, commentID }: Props) {
    const [showForm, setShowForm] = useState(false);

    const handleReplySuccess = () => {
        setShowForm(false);
        // Untuk sementara, kita refresh halaman untuk melihat balasan baru.
        // Di masa depan, kita bisa membuatnya lebih canggih tanpa refresh.
        window.location.reload(); 
    };

    if (!showForm) {
        return (
            <button 
                onClick={() => setShowForm(true)}
                className="text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-dark-primary)] hover:underline mt-2"
            >
                Balas
            </button>
        );
    }

    return (
        <div className="mt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] pt-4">
            <CommentForm 
                postID={postID} 
                parentID={commentID} 
                onSuccess={handleReplySuccess}
                isReply={true}
            />
            <button 
                onClick={() => setShowForm(false)}
                className="text-xs text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)] mt-2 hover:underline"
            >
                Batal
            </button>
        </div>
    );
}