import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaArrowLeft } from "react-icons/fa6";

const FollowingPage = () => {
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: followingUsers, isLoading } = useQuery({
		queryKey: ["followingUsers"],
		queryFn: async () => {
			const res = await fetch("/api/users/following");
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
	});

	const { mutate: unfollow, isPending } = useMutation({
		mutationFn: async (userId) => {
			const res = await fetch(`/api/users/follow/${userId}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Unfollowed successfully");
			queryClient.invalidateQueries({ queryKey: ["followingUsers"] });
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => toast.error(err.message),
	});

	return (
		<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
			<div className="flex items-center gap-4 p-4 border-b border-gray-700 sticky top-0 bg-black z-10">
				<Link to="/">
					<FaArrowLeft className="w-4 h-4" />
				</Link>
				<div>
					<p className="font-bold text-lg">Following</p>
					<p className="text-sm text-slate-500">{followingUsers?.length ?? 0} users</p>
				</div>
			</div>

			{isLoading && (
				<div className="flex justify-center mt-10">
					<LoadingSpinner size="lg" />
				</div>
			)}

			{!isLoading && followingUsers?.length === 0 && (
				<div className="flex flex-col items-center justify-center mt-20 gap-2 text-slate-500">
					<p className="text-xl font-bold">You're not following anyone yet</p>
					<p className="text-sm">When you follow someone, they'll appear here.</p>
				</div>
			)}

			{!isLoading && followingUsers?.map((user) => (
				<div
					key={user._id}
					className="flex items-center justify-between px-4 py-3 hover:bg-[#111] transition-colors border-b border-gray-800"
				>
					<Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
						<div className="avatar">
							<div className="w-10 rounded-full">
								<img src={user.profileImg || "/avatar-placeholder.png"} alt={user.fullName} />
							</div>
						</div>
						<div className="min-w-0">
							<p className="font-bold text-sm truncate">{user.fullName}</p>
							<p className="text-slate-500 text-sm">@{user.username}</p>
							{user.bio && <p className="text-sm text-slate-400 truncate mt-0.5">{user.bio}</p>}
						</div>
					</Link>

					{user._id !== authUser?._id && (
						<button
							className="btn btn-outline btn-sm rounded-full ml-3 shrink-0"
							onClick={() => unfollow(user._id)}
							disabled={isPending}
						>
							{isPending ? "..." : "Unfollow"}
						</button>
					)}
				</div>
			))}
		</div>
	);
};

export default FollowingPage;