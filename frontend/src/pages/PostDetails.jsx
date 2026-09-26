import { useNavigate, useParams } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import axios from "axios"
import { URL,IF } from "../url"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"

const FALLBACK_POSTS = [
  {
    _id: 'demo-1',
    title: 'Designing a calmer morning routine',
    desc: 'A simple morning ritual can create more focus, better energy, and a sense of control before the day begins. In this post, I share a few easy changes that worked for me and how to build a routine that feels sustainable instead of stressful.\n\nThe first step is not to overhaul your entire schedule. It is to make one or two improvements that support your energy. A better morning starts with less friction: a clear place to sit, a consistent alarm, and a quiet ritual that reminds you what matters before the internet and notifications take over.',
    photo: 'https://images.unsplash.com/photo-1497014230338-9d00fdffd5d3?auto=format&fit=crop&w=1200&q=80',
    username: 'Demo Writer',
    userId: 'demo-user',
    categories: ['Lifestyle', 'Productivity'],
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-2',
    title: 'Why creative consistency beats creative intensity',
    desc: 'Most creative work is not built from dramatic bursts of inspiration. It grows from small, repeatable habits, a clear process, and steady effort. Here is how I keep my creative practice active without burning out.\n\nInstead of waiting for a perfect mood, I treat creative work like a practice: a daily rhythm that includes research, writing, editing, and reflection. The best work usually appears after the boring steps are done.',
    photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    username: 'Demo Writer',
    userId: 'demo-user',
    categories: ['Creativity', 'Writing'],
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo-3',
    title: 'A beginner guide to building a personal brand online',
    desc: 'Personal branding is not about pretending to be someone else. It is about becoming clear about what you stand for and sharing useful ideas consistently. This guide breaks it down into simple steps for creators and professionals alike.\n\nStart with the topics you already know and care about. Then make them easier to discover by being consistent, clear, and useful. Over time, your work becomes a signal that tells people who you are and what you can help them with.',
    photo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    username: 'Demo Writer',
    userId: 'demo-user',
    categories: ['Business', 'Growth'],
    updatedAt: new Date().toISOString(),
  },
]

const PostDetails = () => {

  const postId = useParams().id
  const [post, setPost] = useState({})
  const { user } = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [articleLoading, setArticleLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const navigate = useNavigate()
  const isLoading = articleLoading || commentsLoading

  const imageSrc = post.photo?.startsWith('http') ? post.photo : (IF ? IF + post.photo : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80')

  const blogParagraphs = typeof post.desc === 'string'
    ? post.desc.split(/\n\s*\n/).filter(Boolean)
    : []

  const fetchPost = async () => {
    setArticleLoading(true)
    try {
      if (!URL) {
        throw new Error('No API URL configured')
      }
      const res = await axios.get(URL + "/api/posts/" + postId)
      setPost(res.data)
    }
    catch (err) {
      console.log('Using fallback post content for GitHub Pages mode:', err)
      const fallbackPost = FALLBACK_POSTS.find((item) => item._id === postId) || FALLBACK_POSTS[0]
      setPost(fallbackPost)
    }
    finally {
      setArticleLoading(false)
    }
  }

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(URL + "/api/posts/" + postId, { withCredentials: true })
      console.log(res.data)
      navigate("/")
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPostComments = async () => {
    setCommentsLoading(true)
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId)
      setComments(res.data)
    }
    catch (err) {
      setComments([])
      console.log(err)
    }
    finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    fetchPostComments()
  }, [postId])

  const postComment = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        URL + "/api/comments/create",
        { comment, author: user.username, postId, userId: user._id },
        { withCredentials: true }
      )
      window.location.reload(true)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <div className="flex h-[80vh] w-full items-center justify-center"><Loader /></div>
      ) : (
        <main className="mx-auto mb-12 max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <article className="glass-card soft-shadow overflow-hidden rounded-[30px]">
            <div className="relative h-[280px] overflow-hidden md:h-[420px]">
              <img src={imageSrc} alt={post.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.categories?.map((category, index) => (
                    <span key={index} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      {category}
                    </span>
                  ))}
                </div>
                <h1 className="max-w-3xl text-2xl font-black tracking-tight text-white md:text-5xl">{post.title}</h1>
              </div>
            </div>

            <div className="px-5 py-6 md:px-10 md:py-10">
              <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">By {post.username || 'Guest Author'}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{new Date(post.updatedAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{post.categories?.length || 2} topics</span>
                </div>
                {user?._id === post?.userId && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <button type="button" onClick={() => navigate('/edit/' + postId)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:border-blue-200 hover:text-blue-600">
                      <BiEdit /> Edit
                    </button>
                    <button type="button" onClick={handleDeletePost} className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                      <MdDelete /> Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="prose prose-slate max-w-none prose-lg prose-headings:font-black prose-headings:text-slate-900 prose-p:leading-8 prose-p:text-slate-700 prose-a:text-blue-600">
                {blogParagraphs.length > 0 ? (
                  blogParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>{post.desc}</p>
                )}
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">About the author</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white">
                    {post.username?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{post.username || 'Guest Author'}</p>
                    <p className="text-sm text-slate-600">Writer, creator, and storyteller</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-slate-900">Comments</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {comments.length} total
              </span>
            </div>

            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <Comment key={c._id} c={c} post={post} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No comments yet. Be the first to share your thoughts.
                </div>
              )}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Add a comment</label>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="Write a thoughtful comment"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  onClick={postComment}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      <Footer />
    </div>
  )
}

export default PostDetails