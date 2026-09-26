const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const User=require('./models/User')
const Post=require('./models/Post')
const bcrypt=require('bcrypt')

const seedSamplePosts = async () => {
    try {
        const postCount = await Post.countDocuments()
        if (postCount >= 100) {
            return
        }

        if (postCount > 0) {
            await Post.deleteMany({})
        }

        const demoEmail = 'demo@blogmarket.com'
        let demoUser = await User.findOne({ email: demoEmail })

        if (!demoUser) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash('demo123', salt)
            demoUser = await User.create({
                username: 'Demo Writer',
                email: demoEmail,
                password: hashedPassword,
            })
        }

        const titles = [
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
            'A practical philosophy for sustainable creative work',
        ]

        const imagePool = [
            '1691325126464pexels-cottonbro-studio-6153354.jpg',
            '1691325229381pexels-antonio-batinić-4164418.jpg',
            '1691325325689pexels-anna-shvets-3683040.jpg',
            '1691325448327pexels-ivan-babydov-7788006.jpg',
            '1691325576058pexels-quang-nguyen-vinh-2518861.jpg',
            '1691325808668pexels-aleksandar-pasaric-2070118.jpg',
            '1691325898532pexels-pixabay-41953.jpg',
            '1691325976449pexels-miriam-espacio-110854.jpg',
        ]

        const samplePosts = titles.slice(0, 100).map((title, index) => ({
            title,
            desc: `This article explores ${title.toLowerCase()} with practical ideas, realistic examples, and a fresh perspective on everyday creative work. It highlights how small habits, thoughtful systems, and deliberate choices can improve focus, confidence, and long-term momentum. The goal is to make the topic useful for real life rather than theoretical only.`,
            photo: imagePool[index % imagePool.length],
            username: demoUser.username,
            userId: demoUser._id.toString(),
            categories: [
                index % 2 === 0 ? 'Lifestyle' : 'Productivity',
                index % 3 === 0 ? 'Writing' : 'Creativity',
            ],
        }))

        await Post.insertMany(samplePosts)
        console.log('Sample posts seeded successfully!')
    }
    catch (err) {
        console.log('Error seeding sample posts:', err)
    }
}

//database
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")
        await seedSamplePosts()

    }
    catch(err){
        console.log(err)
    }
}



//middlewares
dotenv.config()
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})


app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})