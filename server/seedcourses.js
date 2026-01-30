    // server/seedcourses.js
    require('dotenv').config();
    const mongoose = require('mongoose');
    const Course = require('./models/Course');

    const coursesData = [
    {
        title: "Junior Fine Arts (10 - 14 years)",
        category: "Kids",
        type: "Fine Arts",
        price: 3500,
        image: "/courses/junior.jpg", 
        description: [
        "Course Duration – 1 year",
        "Basic Drawing Skills", 
        "Introduction of Type of Colours", 
        "Colour Theory & Painting Basics",
        "Introduction to Human & Animal Drawing",  
        "Fun with Textures", 
        "Character & Cartoon Drawing",
        "Art & Nature"
        ]
    },
    {
        title: "Foundation Courses for Kids (6 - 10 years)",
        category: "Kids",
        type: "Basics of Art",
        price: 2400,
        image: "/courses/foundation.jpg",
        description: [
        "Course Duration – 1 year",
        "Basic Drawing Skills",
        "Introduction of Type of Colours", 
        "Colour Mixing activities",
        "Introduction to Human & Animal Drawing",
        "Fun with Textures"
        ]
    },
    {
        title: "Intermediate Level (15 - 18 years)",
        category: "Adults",
        type: "Fine Arts",
        price: 4000,
        image: "/courses/intermidiate.jpg",
        description: [
        "Course Duration – 1 year", 
        "Basic Drawing Skills",
        "Perspective & Composition",  
        "Introduction to Pencil Colours and Pastels",
        "Introduction of Type of Colours, Colour Theory & Painting Basics",
        "Portrait Drawing & Human Anatomy",
        "Cultural & Folk Art Exploration",
        "Portfolio Development & Art Appreciation"
        ]
    },
    {
        title: "Diploma in Fine Arts (18+ years)",
        category: "Fine Arts",
        type: "Basics of Art",
        price: 4800,
        image: "/courses/diploma.jpg",
        description: [
        "Format: 12 classes/month (1.5 hrs each)", // Moved from title to here
        "Course Duration – 1 year", 
        "Basic Drawing Skills",
        "Perspective & Composition",  
        "Introduction of Type of Colours",
        "Introduction to Water Colours & Pencils",
        "Portrait Drawing & Human Anatomy",
        "Acrylic & Oil Colours Techniques",
        "Cultural & Folk Art Exploration",
        "Portfolio Development",
        "Calligraphy & Lettering Art"
        ]
    },
    {
        title: "Advanced Level Professional (18+ years)",
        category: "Adults",
        type: "Fine Arts",
        price: 5000,
        image: "/courses/advance.jpg",
        description: [
        "Format: 12 classes/month (1.5 hrs each)",
        "Course Duration – 1 year", 
        "Sketching & Composition",
        "Advanced Shading & Textures", 
        "Portrait & Figure Drawing",
        "Landscape & Nature Painting",
        "Oil Painting & Mixed Media",
        "Advanced Watercolour Techniques",  
        "Textured Acrylic Painting",  
        "Hyperrealism & Detailing",
        "Conceptual & Abstract Art"
        ]
    },
    {
        title: "Clay Modelling Course",
        category: "Sculpting",
        type: "Figures and clay modeling",
        price: 4500,
        image: "/courses/clay.jpg",
        description: [
        "Format: 12 classes/month (1.5 hrs each)",
        "Course Duration – 1 year", 
        "Module 1: Introduction to Clay Modelling (6-8 Weeks)",
        "Module 2: Intermediate Clay Modelling (8-10 Weeks)",
        "Module 3: Advanced Clay Modelling & Sculpture (8-10 Weeks)"
        ]
    }
    ];

    const seedDB = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ Connected to MongoDB');

            // 1. DELETE ALL OLD DATA
            await Course.deleteMany({});
            console.log('🗑️  Old courses removed (Database Wiped)');

            // 2. INSERT NEW DATA
            await Course.insertMany(coursesData);
            console.log('🚀 Success! 6 clean courses inserted.');
            
            process.exit();
        } catch (error) {
            console.error("❌ Seeding failed:", error);
            process.exit(1);
        }
    };

    seedDB();