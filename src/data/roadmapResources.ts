// Helper to get YouTube thumbnail
const getYoutubeThumb = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

export const roadmapResources: Record<string, any> = {
    "_defaults": [
        { title: "Stack Overflow", source: "Stack Overflow", type: "Practice", link: "https://stackoverflow.com", relevance: 80 },
        { title: "GitHub Explore", source: "GitHub", type: "Project", link: "https://github.com/explore", relevance: 85 },
        { title: "DevDocs", source: "DevDocs", type: "Documentation", link: "https://devdocs.io", relevance: 90 },
        { title: "Roadmap.sh", source: "Roadmap.sh", type: "Guide", link: "https://roadmap.sh", relevance: 95 }
    ],

    "Python": [
        { title: "Python Official Docs", source: "Python.org", type: "Documentation", link: "https://docs.python.org/3/tutorial/" },
        { title: "Automate the Boring Stuff", source: "Al Sweigart", type: "Free Book", link: "https://automatetheboringstuff.com/" },
        { title: "Real Python Tutorials", source: "Real Python", type: "Tutorial", link: "https://realpython.com/" },
        { title: "Python for Everybody (FCC)", source: "freeCodeCamp", type: "Video", link: "https://www.youtube.com/watch?v=8DvywoWv6fI" },
        { title: "LeetCode Python Track", source: "LeetCode", type: "Practice", link: "https://leetcode.com/problemset/" },
        { title: "100 Days of Code (Udemy)", source: "Udemy", type: "Course", link: "https://www.udemy.com/course/100-days-of-code/" }
    ],

    "JavaScript": [
        { title: "JavaScript.info", source: "JS.info", type: "Tutorial", link: "https://javascript.info/" },
        { title: "MDN JavaScript Guide", source: "MDN", type: "Documentation", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
        { title: "Eloquent JavaScript (Free)", source: "Marijn Haverbeke", type: "Free Book", link: "https://eloquentjavascript.net/" },
        { title: "JavaScript Mastery (YT)", source: "YouTube", type: "Video", link: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
        { title: "30 Days of JavaScript", source: "LeetCode", type: "Practice", link: "https://leetcode.com/studyplan/30-days-of-javascript/" }
    ],

    "React": [
        { title: "React Official Docs", source: "React.dev", type: "Documentation", link: "https://react.dev/learn" },
        { title: "React Full Course 2024", source: "YouTube", type: "Video", link: "https://www.youtube.com/watch?v=SqcY0GlETPk" },
        { title: "Build Your Own React", source: "Rodrigo Pombo", type: "Tutorial", link: "https://pomb.us/build-your-own-react/" },
        { title: "Frontend Mentor", source: "Frontend Mentor", type: "Practice", link: "https://www.frontendmentor.io/" }
    ],

    "Frontend": [
        { title: "MDN Web Docs: HTML", source: "MDN", type: "Documentation", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
        { title: "CSS Tricks", source: "CSS Tricks", type: "Tutorial", link: "https://css-tricks.com/" },
        { title: "Frontend Mentor", source: "Frontend Mentor", type: "Practice", link: "https://www.frontendmentor.io/" },
        { title: "Kevin Powell CSS (YT)", source: "YouTube", type: "Video", link: "https://www.youtube.com/@KevinPowell" },
        { title: "JavaScript.info", source: "JS.info", type: "Tutorial", link: "https://javascript.info/" }
    ],

    "Backend": [
        { title: "Node.js Official Docs", source: "Node.js", type: "Documentation", link: "https://nodejs.org/en/docs/" },
        { title: "Express.js Guide", source: "Express", type: "Tutorial", link: "https://expressjs.com/en/starter/installing.html" },
        { title: "Roadmap.sh Backend", source: "Roadmap.sh", type: "Guide", link: "https://roadmap.sh/backend" },
        { title: "REST API Design Best Practices", source: "freeCodeCamp", type: "Video", link: "https://www.youtube.com/watch?v=DcLnCfR0qSw" }
    ],

    "DevOps": [
        { title: "Roadmap.sh DevOps", source: "Roadmap.sh", type: "Guide", link: "https://roadmap.sh/devops" },
        { title: "Docker Official Docs", source: "Docker", type: "Documentation", link: "https://docs.docker.com/get-started/" },
        { title: "Kubernetes Docs", source: "Kubernetes", type: "Documentation", link: "https://kubernetes.io/docs/tutorials/" },
        { title: "TechWorld with Nana (YT)", source: "YouTube", type: "Video", link: "https://www.youtube.com/@TechWorldwithNana" },
        { title: "GitHub Actions Docs", source: "GitHub", type: "Tutorial", link: "https://docs.github.com/en/actions" }
    ],

    "Data Science": [
        { title: "Kaggle Learn", source: "Kaggle", type: "Tutorial", link: "https://www.kaggle.com/learn" },
        { title: "fast.ai Free Course", source: "fast.ai", type: "Course", link: "https://www.fast.ai/" },
        { title: "Python Data Science Handbook", source: "Jake VanderPlas", type: "Free Book", link: "https://jakevdp.github.io/PythonDataScienceHandbook/" },
        { title: "StatQuest (YT)", source: "YouTube", type: "Video", link: "https://www.youtube.com/@statquest" }
    ],

    "Machine Learning": [
        { title: "Andrew Ng's ML Course", source: "Coursera", type: "Course", link: "https://www.coursera.org/learn/machine-learning" },
        { title: "Scikit-Learn Docs", source: "Scikit-Learn", type: "Documentation", link: "https://scikit-learn.org/stable/tutorial/" },
        { title: "Google ML Crash Course", source: "Google", type: "Course", link: "https://developers.google.com/machine-learning/crash-course" },
        { title: "Hands-On ML (Book)", source: "Aurélien Géron", type: "Book", link: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" }
    ],

    "Cloud": [
        { title: "AWS Free Tier", source: "AWS", type: "Platform", link: "https://aws.amazon.com/free/" },
        { title: "AWS Skill Builder", source: "AWS", type: "Course", link: "https://explore.skillbuilder.aws/" },
        { title: "A Cloud Guru", source: "Pluralsight", type: "Course", link: "https://acloudguru.com/" },
        { title: "AWS Well-Architected", source: "AWS", type: "Documentation", link: "https://aws.amazon.com/architecture/well-architected/" }
    ],

    "Kotlin": [
        { title: "Kotlin Official Docs", source: "Kotlin", type: "Documentation", link: "https://kotlinlang.org/docs/getting-started.html" },
        { title: "Android Developer Guide", source: "Google", type: "Tutorial", link: "https://developer.android.com/courses" },
        { title: "Kotlin Bootcamp (Google)", source: "Udacity", type: "Course", link: "https://www.udacity.com/course/developing-android-apps-with-kotlin--ud9012" }
    ],

    "Rust": [
        { title: "The Rust Book (Free)", source: "Rust Lang", type: "Free Book", link: "https://doc.rust-lang.org/book/" },
        { title: "Rustlings Exercises", source: "GitHub", type: "Practice", link: "https://github.com/rust-lang/rustlings" },
        { title: "Rust By Example", source: "Rust Lang", type: "Tutorial", link: "https://doc.rust-lang.org/rust-by-example/" }
    ],

    "Java": [
        { title: "Oracle Java Tutorials", source: "Oracle", type: "Documentation", link: "https://docs.oracle.com/javase/tutorial/" },
        { title: "Java Full Course (YT)", source: "YouTube", type: "Video", link: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
        { title: "Baeldung Spring Boot", source: "Baeldung", type: "Tutorial", link: "https://www.baeldung.com/spring-boot" },
        { title: "HackerRank Java", source: "HackerRank", type: "Practice", link: "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript" }
    ],

    "Go": [
        { title: "Go Tour (Official)", source: "Go.dev", type: "Tutorial", link: "https://go.dev/tour/welcome/1" },
        { title: "Go by Example", source: "Go by Example", type: "Tutorial", link: "https://gobyexample.com/" },
        { title: "Effective Go", source: "Go.dev", type: "Documentation", link: "https://go.dev/doc/effective_go" }
    ],

    "Cybersecurity": [
        { title: "TryHackMe", source: "TryHackMe", type: "Practice", link: "https://tryhackme.com/" },
        { title: "HackTheBox", source: "HackTheBox", type: "Practice", link: "https://www.hackthebox.com/" },
        { title: "OWASP Top 10", source: "OWASP", type: "Documentation", link: "https://owasp.org/www-project-top-ten/" },
        { title: "Cybrary Free Courses", source: "Cybrary", type: "Course", link: "https://www.cybrary.it/" }
    ],

    "Full Stack": [
        { title: "The Odin Project", source: "Odin Project", type: "Free Course", link: "https://www.theodinproject.com/" },
        { title: "freeCodeCamp Full Stack", source: "freeCodeCamp", type: "Course", link: "https://www.freecodecamp.org/" },
        { title: "Full Stack Open (Helsinki)", source: "University of Helsinki", type: "Course", link: "https://fullstackopen.com/en/" },
        { title: "MDN Web Docs", source: "MDN", type: "Documentation", link: "https://developer.mozilla.org/" }
    ],

    "AWS": [
        { title: "AWS Skill Builder", source: "AWS", type: "Course", link: "https://explore.skillbuilder.aws/" },
        { title: "AWS Well-Architected Framework", source: "AWS", type: "Documentation", link: "https://aws.amazon.com/architecture/well-architected/" },
        { title: "AWS Free Tier", source: "AWS", type: "Platform", link: "https://aws.amazon.com/free/" },
        { title: "AWS Certified Solutions Architect", source: "AWS", type: "Certification", link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
        { title: "AWS Cloud Practitioner Essentials", source: "Coursera", type: "Course", link: "https://www.coursera.org/learn/aws-cloud-practitioner-essentials" },
        { title: "Adrian Cantrill AWS Courses", source: "learn.cantrill.io", type: "Course", link: "https://learn.cantrill.io/" }
    ],

    "Architect": [
        { title: "AWS Well-Architected Framework", source: "AWS", type: "Documentation", link: "https://aws.amazon.com/architecture/well-architected/" },
        { title: "System Design Primer", source: "GitHub", type: "Free Book", link: "https://github.com/donnemartin/system-design-primer" },
        { title: "Roadmap.sh System Design", source: "Roadmap.sh", type: "Guide", link: "https://roadmap.sh/system-design" },
        { title: "AWS Solutions Architect Cert", source: "AWS", type: "Certification", link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
        { title: "ByteByteGo (System Design)", source: "YouTube", type: "Video", link: "https://www.youtube.com/@ByteByteGo" }
    ],

    "Android": [
        { title: "Android Developer Docs", source: "Google", type: "Documentation", link: "https://developer.android.com/" },
        { title: "Android Basics with Compose", source: "Google", type: "Course", link: "https://developer.android.com/courses/android-basics-compose/course" },
        { title: "Philipp Lackner (YT)", source: "YouTube", type: "Video", link: "https://www.youtube.com/@PhilippLackner" }
    ],

    "Flutter": [
        { title: "Flutter Official Docs", source: "Flutter.dev", type: "Documentation", link: "https://flutter.dev/docs" },
        { title: "Flutter Codelabs", source: "Google", type: "Tutorial", link: "https://codelabs.developers.google.com/?cat=Flutter" },
        { title: "Flutter Crash Course (YT)", source: "YouTube", type: "Video", link: "https://www.youtube.com/results?search_query=flutter+crash+course" }
    ],

    "SQL": [
        { title: "SQLBolt (Interactive)", source: "SQLBolt", type: "Tutorial", link: "https://sqlbolt.com/" },
        { title: "Mode SQL Tutorial", source: "Mode", type: "Tutorial", link: "https://mode.com/sql-tutorial/" },
        { title: "LeetCode SQL 50", source: "LeetCode", type: "Practice", link: "https://leetcode.com/studyplan/top-sql-50/" },
        { title: "PostgreSQL Docs", source: "PostgreSQL", type: "Documentation", link: "https://www.postgresql.org/docs/current/tutorial.html" }
    ],

    "Blockchain": [
        { title: "CryptoZombies (Free)", source: "CryptoZombies", type: "Tutorial", link: "https://cryptozombies.io/" },
        { title: "Solidity by Example", source: "Solidity", type: "Tutorial", link: "https://solidity-by-example.org/" },
        { title: "Ethereum.org Learn", source: "Ethereum", type: "Documentation", link: "https://ethereum.org/en/developers/" }
    ],

    "AI": [
        { title: "Google AI Crash Course", source: "Google", type: "Course", link: "https://developers.google.com/machine-learning/crash-course" },
        { title: "fast.ai Practical Deep Learning", source: "fast.ai", type: "Course", link: "https://www.fast.ai/" },
        { title: "Hugging Face Courses", source: "Hugging Face", type: "Course", link: "https://huggingface.co/learn" },
        { title: "Papers With Code", source: "PWC", type: "Research", link: "https://paperswithcode.com/" }
    ]
};
