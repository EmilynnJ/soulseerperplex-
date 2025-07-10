import React, { useState, useEffect } from 'react';
import ThreadView from './ThreadView';
import PostForm from './PostForm';
import { useUser } from '@clerk/clerk-react'; // To get current user for posting

// Mock Data - Replace with API calls
const mockUser = { id: 'user_123', name: 'Mystic Seeker' }; // Placeholder for Clerk user

const initialThreads = [
  { id: 'thread1', title: 'Welcome to the SoulSeer Community!', opPostId: 'post1', author: { name: 'Admin Aura' }, createdAt: '2023-10-01T10:00:00Z', replyCount: 2, lastReplyAt: '2023-10-02T12:30:00Z' },
  { id: 'thread2', title: 'Tips for a Great First Reading?', opPostId: 'post3', author: { name: 'Newbie Nelly' }, createdAt: '2023-10-05T14:20:00Z', replyCount: 1, lastReplyAt: '2023-10-05T18:00:00Z' },
];

const initialPosts = [
  { id: 'post1', threadId: 'thread1', parentId: null, author: { name: 'Admin Aura' }, content: 'This is the place to discuss all things spiritual, share experiences, and connect with fellow seekers and readers. Be kind and respectful!', createdAt: '2023-10-01T10:00:00Z' },
  { id: 'post2', threadId: 'thread1', parentId: 'post1', author: { name: 'Reader Rob' }, content: 'Glad to be here! Looking forward to connecting.', createdAt: '2023-10-01T15:30:00Z' },
  { id: 'post5', threadId: 'thread1', parentId: 'post1', author: { name: 'Client Clara' }, content: 'What a great idea for a forum!', createdAt: '2023-10-02T12:30:00Z' },
  { id: 'post3', threadId: 'thread2', parentId: null, author: { name: 'Newbie Nelly' }, content: 'Hi everyone, I have my first reading next week. Any advice on how to prepare or what to expect? A bit nervous!', createdAt: '2023-10-05T14:20:00Z' },
  { id: 'post4', threadId: 'thread2', parentId: 'post3', author: { name: 'Experienced Eric' }, content: 'Just relax and be open! Have some questions in mind, but also be open to where the reading goes. Good luck!', createdAt: '2023-10-05T18:00:00Z' },
];
// End Mock Data

const Forum = () => {
  const { user } = useUser(); // Get the actual logged-in user
  const [threads, setThreads] = useState(initialThreads);
  const [posts, setPosts] = useState(initialPosts);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'trending'

  // TODO: Fetch threads and posts from API on mount
  // useEffect(() => {
  //   // api.getThreads().then(setThreads);
  //   // api.getPostsForThreads(threadIds).then(setPosts);
  // }, []);

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
    setShowNewThreadForm(false); // Hide new thread form when viewing a thread
  };

  const handleCreateThread = (threadData) => {
    // Simulate API call
    const newThreadId = `thread${threads.length + 1}`;
    const newPostId = `post${posts.length + 1}`;
    const currentUser = user ? { name: user.fullName || user.primaryEmailAddress.emailAddress } : mockUser;

    const newThread = {
      id: newThreadId,
      title: threadData.title,
      opPostId: newPostId,
      author: currentUser,
      createdAt: new Date().toISOString(),
      replyCount: 0,
      lastReplyAt: new Date().toISOString(),
    };
    const newPost = {
      id: newPostId,
      threadId: newThreadId,
      parentId: null,
      author: currentUser,
      content: threadData.content,
      createdAt: new Date().toISOString(),
    };

    setThreads([newThread, ...threads]);
    setPosts([newPost, ...posts]);
    setShowNewThreadForm(false);
    setSelectedThreadId(newThreadId); // Select the new thread
    // console.log('New thread created:', newThread, newPost); // Removed for cleanup
  };

  const handleNewReply = (replyData) => {
     // Simulate API call
    const newPostId = `post${posts.length + 1}`;
    const currentUser = user ? { name: user.fullName || user.primaryEmailAddress.emailAddress } : mockUser;

    const newReply = {
      id: newPostId,
      threadId: selectedThreadId, // Assuming reply is always to the selected thread's posts
      parentId: replyData.parentId,
      author: currentUser,
      content: replyData.content,
      createdAt: new Date().toISOString(),
    };
    setPosts([...posts, newReply]);

    // Update reply count and last reply time for the thread
    setThreads(threads.map(t =>
      t.id === selectedThreadId
      ? { ...t, replyCount: t.replyCount + 1, lastReplyAt: new Date().toISOString() }
      : t
    ));
    // console.log('New reply:', newReply); // Removed for cleanup
  };

  const handleModerationAction = (action, postId) => {
    // Placeholder for moderation
    alert(`Moderation action: ${action} on post ${postId} (Placeholder - requires backend)`);
    if (action === 'delete') {
      // Basic frontend removal for demo, real deletion needs backend
      // This doesn't handle deleting OP posts or cascading deletes
      setPosts(posts.filter(p => p.id !== postId));
      // Potentially update thread reply counts if a reply is deleted
    }
  };

  const sortedThreads = [...threads].sort((a, b) => {
    if (sortOrder === 'trending') { // Simple trending: more replies = more trending
      return b.replyCount - a.replyCount || new Date(b.lastReplyAt) - new Date(a.lastReplyAt);
    }
    return new Date(b.lastReplyAt) - new Date(a.lastReplyAt); // Default to newest (by last reply)
  });

  // Helper to format date (simplified)
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (selectedThreadId) {
    const thread = threads.find(t => t.id === selectedThreadId);
    const threadPosts = posts.filter(p => p.threadId === selectedThreadId);
    return (
      <div>
        <button onClick={() => setSelectedThreadId(null)} className="btn-mystical mb-4">
          &larr; Back to Threads
        </button>
        <ThreadView
          thread={thread}
          posts={threadPosts}
          onNewReply={handleNewReply}
          onModerationAction={handleModerationAction}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-alex-brush text-5xl text-mystical-pink">Community Forum</h1>
        <button onClick={() => setShowNewThreadForm(!showNewThreadForm)} className="btn-mystical">
          {showNewThreadForm ? 'Cancel' : 'Start New Thread'}
        </button>
      </div>

      {showNewThreadForm && (
        <PostForm
          onSubmit={handleCreateThread}
          onCancel={() => setShowNewThreadForm(false)}
          submitLabel="Create Thread"
        />
      )}

      <div className="flex items-center space-x-4 mb-4">
        <span className="font-playfair text-gray-300">Sort by:</span>
        <button
          onClick={() => setSortOrder('newest')}
          className={`px-3 py-1 rounded-md text-sm ${sortOrder === 'newest' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Newest
        </button>
        <button
          onClick={() => setSortOrder('trending')}
          className={`px-3 py-1 rounded-md text-sm ${sortOrder === 'trending' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Trending
        </button>
      </div>

      <div className="space-y-4">
        {sortedThreads.map(thread => (
          <div key={thread.id} className="p-6 bg-gray-800 rounded-lg shadow hover:shadow-purple-glow transition-shadow duration-300 cursor-pointer" onClick={() => handleSelectThread(thread.id)}>
            <h3 className="font-playfair text-2xl text-mystical-gold mb-1">{thread.title}</h3>
            <p className="text-sm text-gray-400 mb-2">
              Started by {thread.author?.name || 'Unknown'} on {formatDate(thread.createdAt)}
            </p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{thread.replyCount} replies</span>
              <span>Last reply: {formatDate(thread.lastReplyAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
