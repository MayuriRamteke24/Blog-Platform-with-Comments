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
        if (postCount > 0) {
            return
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

        const samplePosts = [
            {
                title: 'Designing a calmer morning routine',
                desc: 'A simple morning ritual can create more focus, better energy, and a sense of control before the day begins. In this post, I share a few easy changes that worked for me and how to build a routine that feels sustainable instead of stressful.',
                photo: '1691325126464pexels-cottonbro-studio-6153354.jpg',
                username: demoUser.username,
                userId: demoUser._id.toString(),
                categories: ['Lifestyle', 'Productivity'],
            },
            {
                title: 'Why creative consistency beats creative intensity',
                desc: 'Most creative work is not built from dramatic bursts of inspiration. It grows from small, repeatable habits, a clear process, and steady effort. Here is how I keep my creative practice active without burning out.',
                photo: '1691325229381pexels-antonio-batinić-4164418.jpg',
                username: demoUser.username,
                userId: demoUser._id.toString(),
                categories: ['Creativity', 'Writing'],
            },
            {
                title: 'A beginner guide to building a personal brand online',
                desc: 'Personal branding is not about pretending to be someone else. It is about becoming clear about what you stand for and sharing useful ideas consistently. This guide breaks it down into simple steps for creators and professionals alike.',
                photo: '1691325325689pexels-anna-shvets-3683040.jpg',
                username: demoUser.username,
                userId: demoUser._id.toString(),
                categories: ['Business', 'Growth'],
            },
        ]

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