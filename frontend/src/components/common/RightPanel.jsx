import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const navigate = useNavigate();

	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			const res = await fetch("/api/users/suggested");
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong!");
			return data;
		},
	});

	const { data: trendingTopics, isLoading: isTrendingLoading } = useQuery({
		queryKey: ["trendingTopics"],
		queryFn: async () => {
			const res = await fetch("/api/post/trending");
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong!");
			return data;
		},
		refetchInterval: 60000, // refresh every minute
	});

	const { follow, isPending } = useFollow();

	return (
		<div className='hidden lg:block my-4 mx-2 w-64 shrink-0'>
			<div className='sticky top-2 flex flex-col gap-4'>

				{/* Trending Section */}
				<div className='bg-[#16181C] p-4 rounded-xl'>
					<p className='font-bold text-lg mb-3'>Trending 🔥</p>
					{isTrendingLoading && (
						<div className='flex justify-center py-4'>
							<LoadingSpinner size='md' />
						</div>
					)}
					{!isTrendingLoading && trendingTopics?.length === 0 && (
						<p className='text-slate-500 text-sm'>No trending topics yet</p>
					)}
					{!isTrendingLoading && trendingTopics?.map((topic, i) => (
						<div
							key={topic.hashtag}
							className='flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#1e2126] cursor-pointer transition-colors group'
							onClick={() => navigate(`/hashtag/${topic.hashtag}`)}
						>
							<div className='flex flex-col'>
								<span className='text-xs text-slate-500'>#{i + 1} Trending</span>
								<span className='font-bold text-sm group-hover:text-primary transition-colors'>
									#{topic.hashtag}
								</span>
								<span className='text-xs text-slate-500'>{topic.count} post{topic.count !== 1 ? "s" : ""}</span>
							</div>
							<div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm'>
								{i + 1}
							</div>
						</div>
					))}
				</div>

				{/* Who to Follow Section */}
				{suggestedUsers?.length > 0 && (
					<div className='bg-[#16181C] p-4 rounded-xl'>
						<p className='font-bold text-lg mb-3'>Who to follow</p>
						<div className='flex flex-col gap-4'>
							{isLoading && (
								<>
									<RightPanelSkeleton />
									<RightPanelSkeleton />
									<RightPanelSkeleton />
									<RightPanelSkeleton />
								</>
							)}
							{!isLoading &&
								suggestedUsers?.map((user) => (
									<Link
										to={`/profile/${user.username}`}
										className='flex items-center justify-between gap-4'
										key={user._id}
									>
										<div className='flex gap-2 items-center'>
											<div className='avatar'>
												<div className='w-8 rounded-full'>
													<img src={user.profileImg || "/avatar-placeholder.png"} />
												</div>
											</div>
											<div className='flex flex-col'>
												<span className='font-semibold tracking-tight truncate w-28'>
													{user.fullName}
												</span>
												<span className='text-sm text-slate-500'>@{user.username}</span>
											</div>
										</div>
										<div>
											<button
												className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
												onClick={(e) => {
													e.preventDefault();
													follow(user._id);
												}}
											>
												{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
											</button>
										</div>
									</Link>
								))}
						</div>
					</div>
				)}

			</div>
		</div>
	);
};
export default RightPanel;