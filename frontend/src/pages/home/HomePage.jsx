import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton";

const FollowingList = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const { follow, isPending: isFollowPending } = useFollow();

	const { data: followingUsers, isLoading } = useQuery({
		queryKey: ["followingUsers"],
		queryFn: async () => {
			const res = await fetch(`/api/users/following/${authUser._id}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		enabled: !!authUser,
	});

	if (isLoading) {
		return (
			<div className='flex flex-col gap-4 p-4'>
				<RightPanelSkeleton />
				<RightPanelSkeleton />
				<RightPanelSkeleton />
			</div>
		);
	}

	if (!followingUsers || followingUsers.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-20 gap-3'>
				<span className='text-5xl'>👥</span>
				<p className='text-xl font-bold'>Not following anyone yet</p>
				<p className='text-slate-500 text-sm'>Follow people to see them here</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col divide-y divide-gray-700'>
			{followingUsers.map((user) => (
				<div key={user._id} className='flex items-center justify-between p-4 hover:bg-secondary transition-colors'>
					<Link to={`/profile/${user.username}`} className='flex items-center gap-3'>
						<div className='avatar'>
							<div className='w-10 rounded-full'>
								<img src={user.profileImg || "/avatar-placeholder.png"} alt={user.username} />
							</div>
						</div>
						<div className='flex flex-col'>
							<span className='font-bold hover:underline'>{user.fullName}</span>
							<span className='text-slate-500 text-sm'>@{user.username}</span>
							{user.bio && (
								<span className='text-sm text-gray-400 mt-1 max-w-xs truncate'>{user.bio}</span>
							)}
						</div>
					</Link>
					<button
						className='btn btn-outline rounded-full btn-sm text-white border-white hover:bg-white hover:text-black'
						onClick={() => follow(user._id)}
					>
						{isFollowPending ? <LoadingSpinner size='sm' /> : "Unfollow"}
					</button>
				</div>
			))}
		</div>
	);
};

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/* CREATE POST — only on For You tab */}
				{feedType === "forYou" && <CreatePost />}

				{/* CONTENT */}
				{feedType === "forYou" && <Posts feedType={feedType} />}
				{feedType === "following" && <FollowingList />}
			</div>
		</>
	);
};
export default HomePage;