import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/common/Post";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import { IoArrowBack } from "react-icons/io5";

const HashtagPage = () => {
	const { tag } = useParams();

	const { data: posts, isLoading } = useQuery({
		queryKey: ["hashtagPosts", tag],
		queryFn: async () => {
			const res = await fetch(`/api/post/hashtag/${tag}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
	});

	return (
		<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
			{/* Header */}
			<div className='flex items-center gap-4 p-4 border-b border-gray-700 sticky top-0 bg-black/80 backdrop-blur z-10'>
				<Link to='/' className='hover:bg-stone-900 p-2 rounded-full transition-colors'>
					<IoArrowBack className='w-5 h-5' />
				</Link>
				<div>
					<h1 className='font-bold text-xl'>#{tag}</h1>
					<p className='text-slate-500 text-sm'>
						{isLoading ? "Loading..." : `${posts?.length || 0} post${posts?.length !== 1 ? "s" : ""}`}
					</p>
				</div>
			</div>

			{/* Posts */}
			{isLoading && (
				<div className='flex flex-col'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && (
				<div className='flex flex-col items-center justify-center py-20 gap-3'>
					<span className='text-5xl'>🔍</span>
					<p className='text-xl font-bold'>No posts found</p>
					<p className='text-slate-500'>No one has posted about #{tag} yet</p>
				</div>
			)}
			{!isLoading && posts?.length > 0 && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</div>
	);
};
export default HashtagPage;