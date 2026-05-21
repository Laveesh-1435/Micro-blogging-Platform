import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const EMOJI_LIST = [
	"😀","😂","😍","🥰","😎","🤔","😭","😡","🥳","🤩",
	"👍","👎","❤️","🔥","✨","🎉","🙌","💯","😢","😅",
	"🤣","😊","😇","🥺","😏","😤","🤯","🥴","😴","🤗",
	"👀","💀","🫡","🫠","🤌","💪","🙏","👏","🎊","⭐",
	"🌟","💥","🎯","🚀","💡","🌈","🍕","🎮","📸","🏆",
];

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const [showCommentEmoji, setShowCommentEmoji] = useState(false);
	const commentRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);
	const isReposted = post.reposts?.includes(authUser._id);
	const isBookmarked = post.bookmarks?.includes(authUser._id);
	const isMyPost = authUser._id === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/post/${post._id}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/post/like/${post._id}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: (updatedLikes) => {
			queryClient.setQueryData(["posts"], (oldData) =>
				oldData.map((p) => (p._id === post._id ? { ...p, likes: updatedLikes } : p))
			);
		},
		onError: (error) => toast.error(error.message),
	});

	const { mutate: repostPost, isPending: isReposting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/post/repost/${post._id}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: (updatedReposts) => {
			queryClient.setQueryData(["posts"], (oldData) =>
				oldData.map((p) => (p._id === post._id ? { ...p, reposts: updatedReposts } : p))
			);
			toast.success(isReposted ? "Repost removed" : "Reposted!");
		},
		onError: (error) => toast.error(error.message),
	});

	const { mutate: bookmarkPost, isPending: isBookmarking } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/post/bookmark/${post._id}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: (updatedBookmarks) => {
			queryClient.setQueryData(["posts"], (oldData) =>
				oldData.map((p) => (p._id === post._id ? { ...p, bookmarks: updatedBookmarks } : p))
			);
			toast.success(isBookmarked ? "Bookmark removed" : "Post bookmarked!");
		},
		onError: (error) => toast.error(error.message),
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/post/comment/${post._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: comment }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			setShowCommentEmoji(false);
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => toast.error(error.message),
	});

	const handleCommentEmojiClick = (emoji) => {
		const textarea = commentRef.current;
		if (!textarea) { setComment((prev) => prev + emoji); return; }
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const newText = comment.slice(0, start) + emoji + comment.slice(end);
		setComment(newText);
		setTimeout(() => {
			textarea.selectionStart = start + emoji.length;
			textarea.selectionEnd = start + emoji.length;
			textarea.focus();
		}, 0);
	};

	const renderTextWithHashtags = (text) => {
		if (!text) return null;
		const parts = text.split(/(#\w+)/g);
		return parts.map((part, i) =>
			part.startsWith("#") ? (
				<Link
					key={i}
					to={`/hashtag/${part.slice(1)}`}
					className="text-primary hover:underline"
					onClick={(e) => e.stopPropagation()}
				>
					{part}
				</Link>
			) : (
				<span key={i}>{part}</span>
			)
		);
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (
									<FaTrash className='cursor-pointer hover:text-red-500' onClick={() => deletePost()} />
								)}
								{isDeleting && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>

					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{renderTextWithHashtags(post.text)}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>

					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>

							{/* Comment button */}
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>

							{/* Comments Modal */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{post.comments.map((c) => (
											<div key={c._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img src={c.user.profileImg || "/avatar-placeholder.png"} />
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{c.user.fullName}</span>
														<span className='text-gray-700 text-sm'>@{c.user.username}</span>
													</div>
													<div className='text-sm'>{c.text}</div>
												</div>
											</div>
										))}
									</div>

									{/* Comment input with emoji */}
									<form
										className='flex flex-col gap-2 mt-4 border-t border-gray-600 pt-2'
										onSubmit={(e) => { e.preventDefault(); if (!isCommenting) commentPost(); }}
									>
										<div className='flex gap-2 items-center'>
											<textarea
												ref={commentRef}
												className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800'
												placeholder='Add a comment...'
												value={comment}
												onChange={(e) => setComment(e.target.value)}
											/>
											<button
												type='submit'
												className='btn btn-primary rounded-full btn-sm text-white px-4'
											>
												{isCommenting ? <LoadingSpinner size='md' /> : "Post"}
											</button>
										</div>

										{/* Emoji toggle row */}
										<div className='relative'>
											<button
												type='button'
												className='flex items-center gap-1 text-slate-500 hover:text-primary transition-colors text-sm'
												onClick={() => setShowCommentEmoji((prev) => !prev)}
											>
												<BsEmojiSmileFill className='w-4 h-4' />
												<span>Add emoji</span>
											</button>

											{showCommentEmoji && (
												<div className='absolute bottom-7 left-0 z-50 bg-[#16181C] border border-gray-700 rounded-xl p-3 w-72 shadow-xl'>
													<div className='flex justify-between items-center mb-2'>
														<span className='text-sm text-gray-400 font-semibold'>Pick an emoji</span>
														<IoCloseSharp
															className='w-4 h-4 cursor-pointer text-gray-400 hover:text-white'
															onClick={() => setShowCommentEmoji(false)}
														/>
													</div>
													<div className='grid grid-cols-10 gap-1'>
														{EMOJI_LIST.map((emoji, i) => (
															<button
																key={i}
																type='button'
																className='text-xl hover:bg-gray-700 rounded p-0.5 cursor-pointer transition-colors'
																onClick={() => handleCommentEmojiClick(emoji)}
															>
																{emoji}
															</button>
														))}
													</div>
												</div>
											)}
										</div>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>

							{/* Repost */}
							<div
								className='flex gap-1 items-center group cursor-pointer'
								onClick={() => { if (!isReposting) repostPost(); }}
							>
								{isReposting ? (
									<LoadingSpinner size='sm' />
								) : (
									<BiRepost
										className={`w-6 h-6 group-hover:text-green-500 ${isReposted ? "text-green-500" : "text-slate-500"}`}
									/>
								)}
								<span className={`text-sm group-hover:text-green-500 ${isReposted ? "text-green-500" : "text-slate-500"}`}>
									{post.reposts?.length || 0}
								</span>
							</div>

							{/* Like */}
							<div
								className='flex gap-1 items-center group cursor-pointer'
								onClick={() => { if (!isLiking) likePost(); }}
							>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && (
									<FaHeart className='w-4 h-4 cursor-pointer text-pink-500' />
								)}
								<span className={`text-sm group-hover:text-pink-500 ${isLiked ? "text-pink-500" : "text-slate-500"}`}>
									{post.likes.length}
								</span>
							</div>
						</div>

						{/* Bookmark */}
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							{isBookmarking ? (
								<LoadingSpinner size='sm' />
							) : isBookmarked ? (
								<FaBookmark
									className='w-4 h-4 text-primary cursor-pointer'
									onClick={() => bookmarkPost()}
								/>
							) : (
								<FaRegBookmark
									className='w-4 h-4 text-slate-500 cursor-pointer hover:text-primary'
									onClick={() => bookmarkPost()}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;