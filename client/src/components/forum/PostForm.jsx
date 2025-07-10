import React, { useState } from 'react';

const PostForm = ({ onSubmit, parentId = null, onCancel, submitLabel = "Post" }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState(''); // Only for new threads

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !title.trim() && !parentId) return; // Basic validation
    if (!content.trim() && parentId) return;


    const postData = parentId ? { content, parentId } : { title, content };
    onSubmit(postData);
    setContent('');
    if (!parentId) setTitle(''); // Clear title only for new threads
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-800 rounded-lg shadow">
      {!parentId && ( // Only show title input for new threads
        <div className="mb-4">
          <label htmlFor="threadTitle" className="block text-sm font-medium text-mystical-pink mb-1">
            Thread Title
          </label>
          <input
            type="text"
            id="threadTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-mystical w-full"
            placeholder="Enter title for your new thread"
            required={!parentId}
          />
        </div>
      )}
      <div className="mb-4">
        <label htmlFor={parentId ? `replyContent-${parentId}` : "threadContent"} className="block text-sm font-medium text-mystical-pink mb-1">
          {parentId ? "Your Reply" : "Your Post Content"}
        </label>
        <textarea
          id={parentId ? `replyContent-${parentId}` : "threadContent"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          className="input-mystical w-full"
          placeholder={parentId ? "Write your reply..." : "What's on your mind?"}
          required
        />
      </div>
      <div className="flex items-center justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-mystical px-4 py-2 text-sm"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
