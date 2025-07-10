import React, { useState } from 'react';
import PostForm from './PostForm'; // Assuming PostForm is in the same directory

// Helper to format date (simplified)
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const PostItem = ({ post, onReply, onModerationAction, isOP = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (replyData) => {
    onReply(replyData); // Pass it up to ThreadView/Forum
    setShowReplyForm(false);
  };

  return (
    <div className={`p-4 rounded-lg shadow ${isOP ? 'bg-gray-850' : 'bg-gray-800 ml-0 md:ml-8'} mb-4`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-mystical-pink">
            {post.author?.name || 'Anonymous'} {isOP && <span className="text-xs text-green-400 ml-2">(OP)</span>}
          </p>
          <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
        </div>
        <div className="text-xs">
          {/* Placeholder for moderation tools */}
          <button onClick={() => onModerationAction('report', post.id)} className="text-yellow-400 hover:text-yellow-300 mr-2">Report</button>
          <button onClick={() => onModerationAction('delete', post.id)} className="text-red-400 hover:text-red-300">Delete</button>
        </div>
      </div>
      <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>
      <div className="mt-3">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          {showReplyForm ? 'Cancel Reply' : 'Reply'}
        </button>
      </div>
      {showReplyForm && (
        <div className="mt-3">
          <PostForm
            parentId={post.id}
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
            submitLabel="Submit Reply"
          />
        </div>
      )}
    </div>
  );
};


const ThreadView = ({ thread, posts = [], onNewReply, onModerationAction }) => {
  if (!thread) {
    return <div className="text-center text-gray-400 py-8">Thread not found or loading...</div>;
  }

  const opPost = posts.find(p => p.id === thread.opPostId);
  const replies = posts.filter(p => p.id !== thread.opPostId && p.parentId === thread.opPostId || posts.find(op => op.id === p.parentId)); // Simple reply logic for now

  return (
    <div className="space-y-6">
      <h2 className="font-alex-brush text-4xl text-mystical-pink mb-2">{thread.title}</h2>

      {opPost ? (
        <PostItem post={opPost} onReply={onNewReply} onModerationAction={onModerationAction} isOP={true} />
      ) : <p className="text-gray-400">Original post not found.</p>}

      <h3 className="font-playfair text-2xl text-mystical-gold mt-6 mb-3">Replies</h3>
      {replies && replies.length > 0 ? (
        replies.map(reply => (
          <PostItem key={reply.id} post={reply} onReply={onNewReply} onModerationAction={onModerationAction} />
        ))
      ) : (
        <p className="text-gray-400">No replies yet. Be the first to respond!</p>
      )}

      {/* To reply directly to the thread (OP) - could be placed differently */}
      {/* This is a simplified reply-to-OP, more complex nesting would require recursive rendering & better data structure */}
      {!opPost && posts.length === 0 && ( // Only show if OP is missing and no replies (edge case or initial state)
         <div className="mt-6">
            <h3 className="font-playfair text-xl text-mystical-gold mb-2">Reply to Thread</h3>
            <PostForm parentId={thread.id} onSubmit={onNewReply} submitLabel="Post Reply" />
         </div>
      )}
    </div>
  );
};

export default ThreadView;
