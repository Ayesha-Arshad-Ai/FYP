import React, { useEffect, useState } from "react";
import { useToken } from "../context/TokenContext";
import { useNavigate } from "react-router-dom";
import {
  FaHeart, FaRegHeart, FaRegCommentDots,
  FaEllipsisH, FaTimes
} from "react-icons/fa";
import Header from "../components/Header";

const PostPage = () => {
  const { token } = useToken();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState({});
  const [activeModal, setActiveModal] = useState(null); // postId for comment modal
  const [commentErrors, setCommentErrors] = useState({}); // store error messages

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchPosts();
  }, [token]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/posts?token=${token}`);
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (id) => {
    const form = new FormData();
    form.append("token", token);
    try {
      const res = await fetch(`http://localhost:8000/posts/${id}/like`, { method: 'POST', body: form });
      const result = await res.json();
      setPosts(ps => ps.map(p => p._id === id ? {
        ...p,
        liked: result.liked,
        like_count: p.like_count + (result.liked ? 1 : -1)
      } : p));
    } catch (e) { console.error(e); }
  };

  const handleCommentSubmit = async (postId, text) => {
    if (!text) return;
    const form = new FormData();
    form.append("token", token);
    form.append("comment_text", text);
    try {
      const res = await fetch(`http://localhost:8000/posts/${postId}/comments`, { method: 'POST', body: form });
      const result = await res.json();
      if (result.status) {
        // success
        fetchPosts();
        setComments(cs => ({ ...cs, [postId]: '' }));
        setIsCommenting(cs => ({ ...cs, [postId]: false }));
        setCommentErrors(cs => ({ ...cs, [postId]: '' }));
      } else {
        // handle false status
        setCommentErrors(cs => ({ ...cs, [postId]: result.message || 'Unable to add comment.' }));
      }
    } catch (e) {
      console.error(e);
      setCommentErrors(cs => ({ ...cs, [postId]: 'Error submitting comment.' }));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Explore Posts</h2>

        {loading ? (
          <div className="animate-pulse text-center text-gray-400 py-20">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No posts available.</div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center px-6 py-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                    {post.user.profile ? (
                      <img src={`../assests/profile_images/${post.user.profile}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-lg font-medium text-white">
                        {post.user.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">{post.user.name}</p>
                    <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="ml-auto text-gray-400 hover:text-gray-600 cursor-pointer">
                    <FaEllipsisH />
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-4">
                  <p className="text-gray-700 mb-4 leading-relaxed">{post.caption}</p>
                  {post.image && (
                    <div className="w-full mb-4">
                      <img
                        src={`../assests/post_images/${post.image}`}
                        alt="Post"
                        className="w-full rounded-lg object-contain"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 mb-2">
                    <button onClick={() => handleLikeToggle(post._id)} className="flex items-center focus:outline-none">
                      {post.liked ? <FaHeart className="text-red-500 text-lg" /> : <FaRegHeart className="text-gray-600 text-lg" />}
                      <span className="ml-1 text-gray-800 text-sm">{post.like_count}</span>
                    </button>
                    <button
                      onClick={() => setActiveModal(post._id)}
                      className="flex items-center focus:outline-none"
                    >
                      <FaRegCommentDots className="text-gray-600 text-lg" />
                      <span className="ml-1 text-gray-800 text-sm">{post.comment_count}</span>
                    </button>
                  </div>
                </div>

                {/* Comment Modal */}
                {activeModal === post._id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h3 className="text-lg font-medium text-gray-800">Comments</h3>
                        <button onClick={() => setActiveModal(null)} className="text-gray-600 hover:text-gray-800">
                          <FaTimes />
                        </button>
                      </div>
                      {/* Comment List */}
                      <div className="max-h-80 overflow-y-auto px-6 py-4 space-y-4">
                        {post.comments.map(c => (
                          <div key={c.created_at} className="flex items-start">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                              {c.user.profile_pic ? (
                                <img src={`../assests/profile_images/${c.user.profile_pic}`} alt="Commenter" className="w-full h-full object-cover" />
                              ) : (
                                <span className="flex items-center justify-center h-full text-sm font-medium text-white">
                                  {c.user.name?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="ml-3 w-full">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">{c.user.name}</span> {c.text}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(c.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Add New Comment */}
                      <div className="border-t px-6 py-4">
                        {commentErrors[post._id] && (
                          <p className="text-sm text-red-600 mb-2">{commentErrors[post._id]}</p>
                        )}
                        <div className="flex items-center">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comments[post._id] || ''}
                            onChange={e => setComments(cs => ({ ...cs, [post._id]: e.target.value }))}
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post._id, comments[post._id])}
                            className="ml-4 text-sm font-semibold text-blue-600"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PostPage;