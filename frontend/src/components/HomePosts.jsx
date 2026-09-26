/* eslint-disable react/prop-types */
import { IF } from '../url'

const HomePosts = ({ post }) => {
  return (
    <article className="glass-card soft-shadow mt-8 flex flex-col overflow-hidden rounded-3xl p-3 transition duration-200 hover:-translate-y-1 hover:shadow-xl md:flex-row md:p-4">
      <div className="h-56 overflow-hidden rounded-2xl md:w-[34%]">
        <img
          src={IF + post.photo}
          alt={post.title}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3 md:p-5">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
            Featured
          </div>
          <h1 className="mb-2 text-xl font-black tracking-tight text-slate-900 md:text-2xl">
            {post.title}
          </h1>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
          <p>@{post.username}</p>
          <div className="flex items-center gap-2">
            <span>{new Date(post.updatedAt).toString().slice(0, 15)}</span>
            <span>{new Date(post.updatedAt).toString().slice(16, 24)}</span>
          </div>
        </div>

        <p className="line-clamp-4 text-sm leading-7 text-slate-600 md:text-base">
          {post.desc?.slice(0, 200) + ' ...Read more'}
        </p>
      </div>
    </article>
  )
}

export default HomePosts

