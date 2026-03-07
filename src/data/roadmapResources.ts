// Helper to get YouTube thumbnail
const getYoutubeThumb = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

export const roadmapResources: Record<string, any> = {
    "_defaults": [
        { 
            title: "Stack Overflow", 
            description: "The world's largest developer community.", 
            type: "Practice", 
            difficulty: "All", 
            link: "https://stackoverflow.com",
            duration: "N/A",
            source: "Stack Overflow",
            relevance: 80,
            aiCurated: false
        },
        { 
            title: "GitHub Explore", 
            description: "Discover trending repositories.", 
            type: "Project", 
            difficulty: "Intermediate", 
            link: "https://github.com/explore",
            duration: "Ongoing",
            source: "GitHub",
            relevance: 85,
            aiCurated: false
        },
        {
            title: "DevDocs",
            description: "Fast, offline documentation browser.",
            type: "Documentation",
            difficulty: "All",
            link: "https://devdocs.io",
            duration: "Reference",
            source: "DevDocs",
            relevance: 90,
            aiCurated: true
        }
    ],

    "Full Stack Developer": {
        "HTML/CSS Foundations": [
            { 
                title: "MDN Web Docs: HTML", 
                description: "The official guide to HTML standards and semantics.", 
                type: "Documentation", 
                difficulty: "Beginner", 
                link: "https://developer.mozilla.org/en-US/docs/Web/HTML", 
                duration: "10h",
                source: "MDN",
                relevance: 98,
                aiCurated: true 
            },
            { 
                title: "HTML & CSS Full Course", 
                description: "Complete beginner course by SuperSimpleDev.", 
                type: "Video", 
                difficulty: "Beginner", 
                link: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
                videoId: "Ke90Tje7VS0",
                duration: "6h 30m",
                source: "YouTube",
                relevance: 95,
                aiCurated: true 
            },
            { 
                title: "Frontend Mentor", 
                description: "Solve real-world HTML, CSS and JS challenges.", 
                type: "Practice", 
                difficulty: "Beginner", 
                link: "https://www.frontendmentor.io/", 
                duration: "Project",
                source: "Frontend Mentor",
                relevance: 90,
                aiCurated: false 
            }
        ],
        "JS/TypeScript Depth": [
            { title: "JavaScript.info", description: "The Modern JavaScript Tutorial.", type: "Documentation", difficulty: "Intermediate", link: "https://javascript.info/", duration: "20h", source: "JS.info", relevance: 99, aiCurated: true },
            { title: "JavaScript Mastery", description: "Complete JS course with projects.", type: "Video", difficulty: "Intermediate", link: "https://www.youtube.com/watch?v=PkZNo7MFNFg", videoId: "PkZNo7MFNFg", duration: "3h", source: "YouTube", relevance: 92, aiCurated: false },
            { title: "LeetCode: JavaScript 30", description: "30 days of JS coding challenges.", type: "Practice", difficulty: "Advanced", link: "https://leetcode.com/studyplan/30-days-of-javascript/", duration: "30 Days", source: "LeetCode", relevance: 88, aiCurated: true }
        ],
        "Frontend Frameworks (React)": [
            { title: "React.dev", description: "The library for web and native user interfaces.", type: "Documentation", difficulty: "Intermediate", link: "https://react.dev/", duration: "15h", source: "React", relevance: 100, aiCurated: true },
            { title: "React JS - Full Course", description: "Build a Netflix Clone with React.", type: "Video", difficulty: "Beginner", link: "https://www.youtube.com/watch?v=SqcY0GlETPk", videoId: "SqcY0GlETPk", duration: "10h", source: "YouTube", relevance: 94, aiCurated: true },
            { title: "Build Your Own React", description: "Rewrite React from scratch to understand it.", type: "Project", difficulty: "Advanced", link: "https://pomb.us/build-your-own-react/", duration: "4h", source: "Rodrigo Pombo", relevance: 96, aiCurated: true }
        ],
        "Backend (Node/Python/Go)": [
            { title: "Node.js Design Patterns", description: "Design patterns for robust Node.js apps.", type: "Documentation", difficulty: "Advanced", link: "https://www.nodejsdesignpatterns.com/", duration: "Book", source: "Node.js", relevance: 90, aiCurated: true },
            { title: "Node.js Full Course", description: "Learn Node.js in 1 Hour.", type: "Video", difficulty: "Beginner", link: "https://www.youtube.com/watch?v=TlB_eWDSMt4", videoId: "TlB_eWDSMt4", duration: "1h", source: "YouTube", relevance: 85, aiCurated: false },
            { title: "Roadmap.sh Backend", description: "Step by step guide to becoming a backend dev.", type: "Practice", difficulty: "Intermediate", link: "https://roadmap.sh/backend", duration: "Ongoing", source: "Roadmap.sh", relevance: 95, aiCurated: true }
        ]
    }
};
