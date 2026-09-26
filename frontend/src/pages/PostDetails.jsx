import { useNavigate, useParams } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import axios from "axios"
import { URL, resolveImageUrl } from "../url"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"

const SAMPLE_TITLES = [
  'Designing a calmer morning routine',
  'Why creative consistency beats creative intensity',
  'A beginner guide to building a personal brand online',
  'How I organize my creative ideas',
  'The power of small daily wins',
  'What I learned from writing every week',
  'The future of work is deeply human',
  'How to build a meaningful daily reading habit',
  'Why thoughtful design makes products memorable',
  'Five ways to reduce digital overwhelm',
  'How great teams turn ideas into action',
  'Making time for creativity in a busy schedule',
  'A simple framework for better planning',
  'The quiet power of a well-designed workspace',
  'How to write with more clarity and confidence',
  'Why storytelling still matters in business',
  'The value of intentional routines',
  'Learning to enjoy the process, not just the outcome',
  'How to turn inspiration into consistent output',
  'Why community matters more than audience size',
  'The essentials of sustainable productivity',
  'What I wish I knew before starting my side project',
  'How to create a creative habit that lasts',
  'The beginner mindset that keeps you learning',
  'Three habits that make remote work better',
  'Why a slower pace often leads to stronger work',
  'Designing content that actually feels useful',
  'How to build trust with your audience online',
  'The role of curiosity in personal growth',
  'Creating better systems for everyday life',
  'A smarter way to manage your attention',
  'The benefits of journaling for clarity',
  'Why a clear message matters more than volume',
  'How to make decisions without overthinking',
  'Lessons from building a habit that sticks',
  'The underrated impact of great onboarding',
  'How to keep your focus in a noisy world',
  'Making your goals realistic and exciting',
  'Why refreshes and resets matter for creativity',
  'How to build a memorable online presence',
  'The hidden value in consistency over intensity',
  'What emotional intelligence looks like at work',
  'How to use feedback without losing momentum',
  'A stronger approach to planning your week',
  'Why small rituals can improve your energy',
  'How to set goals that support your real life',
  'Designing content with a reader-first mindset',
  'The power of clear communication in teams',
  'Why your next idea may need more patience',
  'What healthy creative routines look like',
  'How to turn a rough draft into a finished thought',
  'A practical guide to sustainable focus',
  'The benefits of long-form thinking online',
  'Why shipping work matters more than perfecting it',
  'What better habits can teach you about leadership',
  'How to build a culture of curiosity',
  'The role of rest in creative performance',
  'Why simplicity often wins in product design',
  'What makes a good digital experience feel effortless',
  'How to create better meetings without wasting time',
  'Why strategy is more valuable than hustle alone',
  'Three ways to become more consistent online',
  'How to make your ideas easier to understand',
  'The value of editing with a fresh eye',
  'Why saying less can create more impact',
  'How thoughtful reflection helps you grow',
  'What being productive really means',
  'The importance of user trust in every product',
  'How to recover from creative blocks with intention',
  'Why creators should build systems, not just inspiration',
  'How to build momentum without pressure',
  'A better way to set priorities',
  'How creative leaders make room for experimentation',
  'Why environment shapes your work quality',
  'The connection between clarity and confidence',
  'Making content that people remember',
  'How to keep your ideas organized and useful',
  'The long-term value of writing regularly',
  'What healthy growth looks like in practice',
  'How to start before you feel ready',
  'Why better habits lead to better outcomes',
  'The power of thoughtful check-ins',
  'How to turn knowledge into meaningful action',
  'A guide to building a calmer workweek',
  'What makes online communities feel welcoming',
  'How to create content your audience truly values',
  'The rewards of building slowly and intentionally',
  'Why a clear process beats a chaotic workflow',
  'How to keep learning without burnout',
  'The value of revisiting old ideas with new perspective',
  'How to design your environment for deep work',
  'A more sustainable version of ambition',
  'Why personal reflection improves product thinking',
  'How to make progress visible and motivating',
  'The real meaning of creative freedom',
  'How to turn a winning idea into a repeatable system',
  'What readers actually respond to online',
  'Lessons for building a career with intention',
  'Why emotional clarity improves decision making',
  'How to build a blog that feels authentic',
  'The role of patience in meaningful work',
  'A new approach to planning your next chapter',
  'How to design a life that supports your work',
  'Why your strongest work often comes from constraints',
  'How to create less noise and more focus',
  'The art of making progress visible',
  'A practical philosophy for sustainable creative work'
].slice(0, 100)

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497014230338-9d00fdffd5d3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
]

const buildFallbackPosts = () =>
  Array.from({ length: 100 }, (_, index) => {
    const title = SAMPLE_TITLES[index % SAMPLE_TITLES.length]
    const categories = [
      index % 2 === 0 ? 'Lifestyle' : 'Productivity',
      index % 3 === 0 ? 'Writing' : 'Design',
      index % 4 === 0 ? 'Growth' : 'Creativity',
    ].slice(0, 2)

    return {
      _id: `sample-${index + 1}`,
      title,
      desc: `This article explores ${title.toLowerCase()} with practical ideas, realistic examples, and a fresh perspective on everyday creative work. It highlights how small habits, thoughtful systems, and deliberate choices can improve focus, confidence, and long-term momentum. The goal is to make the topic useful for real life rather than theoretical only.`,
      photo: IMAGE_POOL[index % IMAGE_POOL.length],
      username: 'Demo Writer',
      userId: 'demo-user',
      categories,
      updatedAt: new Date(Date.now() - index * 86400000).toISOString(),
    }
  })

const FALLBACK_POSTS = buildFallbackPosts()

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

  const imageSrc = resolveImageUrl(post.photo)

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

    if (!user) {
      navigate('/login')
      return
    }

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
          <article className="glass-card soft-shadow overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
            <div className="relative h-[300px] overflow-hidden md:h-[440px]">
              <img
                src={imageSrc}
                alt={post.title}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent" />
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