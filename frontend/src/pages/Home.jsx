import axios from "axios"
import Footer from "../components/Footer"
import HomePosts from "../components/HomePosts"
import Navbar from "../components/Navbar"
import { IF, URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Loader from '../components/Loader'
import { UserContext } from "../context/UserContext"

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
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
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

const Home = () => {

  const { search } = useLocation()
  const [posts, setPosts] = useState([])
  const [noResults, setNoResults] = useState(false)
  const [loader, setLoader] = useState(true)
  const { user } = useContext(UserContext)

  const fetchPosts = async () => {
    setLoader(true)
    try {
      if (!URL) {
        throw new Error('No API URL configured')
      }
      const res = await axios.get(URL + "/api/posts/" + search)
      setPosts(res.data)
      setNoResults(res.data.length === 0)
    }
    catch (err) {
      console.log('Using fallback posts for GitHub Pages mode:', err)
      setPosts(FALLBACK_POSTS)
      setNoResults(false)
    }
    finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [search])

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] px-4 py-8 md:px-8 xl:px-16">
        {loader ? (
          <div className="flex h-[40vh] items-center justify-center"><Loader /></div>
        ) : !noResults ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <Link key={post._id} to={user ? `/posts/post/${post._id}` : '/login'} className="block h-full">
                <HomePosts post={post} />
              </Link>
            ))}
          </div>
        ) : (
          <h3 className="mt-16 text-center text-xl font-bold text-slate-700">No posts available</h3>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Home
