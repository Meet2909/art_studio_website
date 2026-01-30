    require('dotenv').config();
    const mongoose = require('mongoose');
    const AboutPage = require('./models/AboutPage'); // Ensure path is correct

    const seedData = {
    // 1. IMAGES (Pointing to client/public/about/)
    heroImage: "/about/hero.webp",
    storyImageLeft: "/about/1.jpg",   // Floating 1
    storyImageRight: "/about/2.jpg",  // Floating 2
    missionImageLeft: "/about/3.jpg", // Floating 3 (New distinct image)
    missionImageRight: "/about/4.jpg",// Floating 4 (New distinct image)
    statsImage: "/about/5.jpg",       // Square stats image

    // 2. STORY TEXT
    storyParagraphs: [
        "\"Chetna’s Creative Den started not just as a studio, but as a rebellion against the mundane. In a world that often prioritizes speed over soul, we wanted to build a sanctuary where time slows down and colors speak louder than words.\"",
        "Founded with a deep passion for community, this space is a lively hub where art enthusiasts of all ages—from the messy-handed 5-year-old discovering clay for the first time to the adult rediscovering a lost passion—can learn, create, and thrive.",
        "We are dedicated to the tactile arts: painting, drawing, sculpting, and hand-crafting. In an increasingly digital world, we believe in the healing, grounding power of getting your hands dirty with real materials.",
        "\"Rooted in the meaning of “Chetna” — awareness and consciousness — the Den champions mindful, sustainable art practices, offering a sanctuary where creativity becomes a meditative and transformative journey.\"",
        "Chetna’s Creative Den is Now Officially Affiliated with Suro Bharti Sangeet Kala Kendra. We are proud to announce our new academic affiliation with Suro Bharti Sangeet Kala Kendra, a respected name in the world of Indian classical music and performing arts."
    ],

    // 3. MISSION SECTION TEXT
    missionDescription: "\"To nurture creativity, inspire self-expression, and encourage mindful, therapeutic engagement through the arts. At Chetna’s Creative Den, we provide an inclusive, collaborative space where individuals of all ages can explore and grow their artistic potential.\"",
    
    visionDescription: "To build a vibrant, compassionate community where creativity is celebrated, artistic journeys are supported, and sustainable, mindful practices are embraced. We envision a world where art becomes a bridge to greater self-awareness.",
    
    coreValues: [
        "Creativity: Encouraging free expression and innovative thinking in all forms of art.",
        "Mindfulness: Promoting art as a meditative, conscious practice that nurtures inner growth.",
        "Inclusivity: Welcoming artists of every age, background, and skill level.",
        "Collaboration: Building a community where ideas are shared and talents are celebrated.",
        "Sustainability: Embracing eco-friendly methods and materials.",
        "Authenticity: Honoring each individual’s unique voice.",
        "Passion for Learning: Offering workshops, mentorship, and hands-on experiences."
    ]
    };

    const seedAbout = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Clear old data and insert new
        await AboutPage.deleteMany({});
        await AboutPage.create(seedData);
        
        console.log('✅ About page fully seeded with text and 6 image paths!');
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
    };

    seedAbout();