/* eslint-disable react/prop-types */
import { resolveImageUrl } from '../url'

const HomePosts = ({ post }) => {
  return (
    <article className="glass-card soft-shadow group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(37,99,235,0.18)]">
      <div className="relative h-56 overflow-hidden rounded-[22px]">
        <img
          src={resolveImageUrl(post.photo)}
          alt={post.title}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3 md:p-4">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
            {post.categories?.[0] || 'Featured'}
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

        <p className="text-sm leading-7 text-slate-600 md:text-base">
          {post.desc?.slice(0, 180) + ' ...Read more'}
        </p>
      </div>
    </article>
  )
}

export default HomePosts

