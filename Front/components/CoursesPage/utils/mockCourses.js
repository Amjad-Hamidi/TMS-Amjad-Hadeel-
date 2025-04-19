export const categories = [
    { id: 1, name: 'Web Development', courseCount: 42 },
    { id: 2, name: 'Data Science', courseCount: 36 },
    { id: 3, name: 'Business', courseCount: 28 },
    { id: 4, name: 'Design', courseCount: 24 },
    { id: 5, name: 'Marketing', courseCount: 19 },
    { id: 6, name: 'IT & Software', courseCount: 31 },
    { id: 7, name: 'Personal Development', courseCount: 15 },
    { id: 8, name: 'Project Management', courseCount: 12 },
];

export const instructors = [
    {
        id: 1,
        name: 'Dr. Sarah Wilson',
        title: 'Senior Web Development Instructor',
        image: 'https://randomuser.me/api/portraits/women/32.jpg',
        bio: 'Dr. Wilson is a renowned web development expert with over 10 years of industry experience. She specializes in modern JavaScript frameworks and has taught thousands of students worldwide.',
        rating: 4.8,
        students: 15420,
        courses: 12
    },
    {
        id: 2,
        name: 'Michael Johnson',
        title: 'Lead Data Science Instructor',
        image: 'https://randomuser.me/api/portraits/men/39.jpg',
        bio: 'Michael is a data scientist with experience at top tech companies. He specializes in machine learning and has a passion for making complex topics accessible to learners of all levels.',
        rating: 4.9,
        students: 12385,
        courses: 8
    },
    {
        id: 3,
        name: 'Emily Chen',
        title: 'UX/UI Design Expert',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        bio: 'Emily is an award-winning designer who has worked with Fortune 500 companies. She brings a wealth of practical knowledge to her courses on user experience and interface design.',
        rating: 4.7,
        students: 9870,
        courses: 6
    },
    {
        id: 4,
        name: 'David Rodriguez',
        title: 'Digital Marketing Specialist',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'David has helped businesses of all sizes grow their online presence. His courses focus on practical marketing strategies that deliver measurable results.',
        rating: 4.6,
        students: 8540,
        courses: 5
    },
];

export const courses = [
    {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        subtitle: 'Learn HTML, CSS, JavaScript, React, Node and more!',
        description: 'A comprehensive course covering all aspects of full-stack web development from the fundamentals to advanced concepts.',
        fullDescription: 'This comprehensive web development bootcamp takes you from beginner to advanced developer. You\'ll learn HTML, CSS, JavaScript, React, Node.js, Express, MongoDB and more. Through hands-on projects and real-world examples, you\'ll gain the skills needed to build responsive, dynamic websites and web applications. By the end of this course, you\'ll have a portfolio of projects to showcase to potential employers or clients. Whether you\'re looking to start a career in web development or enhance your existing skills, this course provides everything you need.',
        instructor: 'Dr. Sarah Wilson',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80',
        price: 129.99,
        discountedPrice: 89.99,
        discountPercentage: 30,
        rating: 4.8,
        reviews: 1250,
        enrolled: 15420,
        durationHours: 42,
        level: 'Beginner',
        lastUpdated: '2023-10-10',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: true,
        bestseller: true,
        new: false,
        topics: ['JavaScript', 'React', 'Node.js'],
        category: 'Web Development',
        learningOutcomes: [
            'Build responsive websites using HTML, CSS, and JavaScript',
            'Create dynamic web applications with React',
            'Develop server-side applications with Node.js and Express',
            'Work with databases including MongoDB and SQL',
            'Implement authentication and security in web applications',
            'Deploy applications to production environments',
            'Understand web development best practices and patterns',
            'Debug and troubleshoot common web development issues'
        ],
        prerequisites: [
            'Basic computer skills',
            'No prior programming experience required'
        ],
        modules: [
            {
                title: 'HTML Fundamentals',
                lessons: [
                    'Introduction to HTML',
                    'HTML Document Structure',
                    'Working with Text',
                    'Links and Images',
                    'HTML Forms',
                    'HTML5 Semantic Elements'
                ]
            },
            {
                title: 'CSS Styling',
                lessons: [
                    'CSS Syntax and Selectors',
                    'Colors, Fonts, and Text',
                    'The Box Model',
                    'Layout with Flexbox',
                    'Layout with CSS Grid',
                    'Responsive Design with Media Queries'
                ]
            },
            {
                title: 'JavaScript Basics',
                lessons: [
                    'JavaScript Syntax',
                    'Variables and Data Types',
                    'Control Flow and Loops',
                    'Functions and Scope',
                    'DOM Manipulation',
                    'Event Handling'
                ]
            },
            {
                title: 'Advanced JavaScript',
                lessons: [
                    'ES6+ Features',
                    'Promises and Async/Await',
                    'Fetch API and AJAX',
                    'Error Handling',
                    'Modern JavaScript Practices'
                ]
            },
            {
                title: 'React Fundamentals',
                lessons: [
                    'Introduction to React',
                    'Components and Props',
                    'State and Lifecycle',
                    'Handling Events',
                    'Forms in React',
                    'React Hooks'
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Data Science and Machine Learning Masterclass',
        subtitle: 'Learn Python, data analysis, visualization, and ML algorithms',
        description: 'Master the tools and techniques used by professional data scientists, including Python, pandas, scikit-learn, and TensorFlow.',
        fullDescription: 'This comprehensive masterclass covers all essential aspects of data science and machine learning. Starting with Python programming fundamentals, you\'ll progress to data manipulation with pandas, visualization with matplotlib and seaborn, and machine learning with scikit-learn and TensorFlow. Through real-world projects and datasets, you\'ll learn how to clean data, extract insights, build predictive models, and communicate results effectively. By the end of this course, you\'ll have the skills to tackle complex data challenges and build a career in this high-demand field.',
        instructor: 'Michael Johnson',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        price: 149.99,
        discountedPrice: 99.99,
        discountPercentage: 33,
        rating: 4.9,
        reviews: 980,
        enrolled: 12385,
        durationHours: 38,
        level: 'Intermediate',
        lastUpdated: '2023-09-25',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: true,
        bestseller: true,
        new: false,
        topics: ['Python', 'Data Science', 'Machine Learning'],
        category: 'Data Science',
        learningOutcomes: [
            'Master Python programming for data science',
            'Perform data cleaning and preprocessing with pandas',
            'Create informative visualizations with matplotlib and seaborn',
            'Build and evaluate machine learning models with scikit-learn',
            'Implement deep learning models with TensorFlow and Keras',
            'Apply statistical analysis techniques to real-world data',
            'Extract actionable insights from complex datasets',
            'Complete end-to-end data science projects'
        ],
        prerequisites: [
            'Basic understanding of programming concepts',
            'Familiarity with mathematics (algebra, basic statistics)'
        ],
        modules: [
            {
                title: 'Python Programming Fundamentals',
                lessons: [
                    'Getting Started with Python',
                    'Data Types and Variables',
                    'Control Flow and Loops',
                    'Functions and Modules',
                    'Object-Oriented Programming'
                ]
            },
            {
                title: 'Data Analysis with Pandas',
                lessons: [
                    'Introduction to Pandas',
                    'Data Structures: Series and DataFrames',
                    'Data Cleaning and Preprocessing',
                    'Data Aggregation and Group Operations',
                    'Working with Time Series Data'
                ]
            },
            {
                title: 'Data Visualization',
                lessons: [
                    'Visualization with Matplotlib',
                    'Advanced Visualizations with Seaborn',
                    'Interactive Visualizations',
                    'Dashboards and Reporting'
                ]
            },
            {
                title: 'Machine Learning Fundamentals',
                lessons: [
                    'Introduction to Machine Learning',
                    'Supervised vs Unsupervised Learning',
                    'Model Evaluation and Validation',
                    'Regression Algorithms',
                    'Classification Algorithms',
                    'Clustering Algorithms'
                ]
            },
            {
                title: 'Deep Learning with TensorFlow',
                lessons: [
                    'Neural Network Basics',
                    'Building Models with Keras',
                    'Convolutional Neural Networks',
                    'Recurrent Neural Networks',
                    'Transfer Learning'
                ]
            }
        ]
    },
    {
        id: 3,
        title: 'UI/UX Design Principles and Practice',
        subtitle: 'Learn to create user-centered designs for digital products',
        description: 'Develop the skills to design intuitive, beautiful user interfaces and create exceptional user experiences for websites and apps.',
        fullDescription: 'This comprehensive UI/UX Design course teaches you how to create user-centered designs that are both functional and aesthetically pleasing. You\'ll learn essential design principles, user research methods, wireframing, prototyping, and usability testing. Working with industry-standard tools like Figma and Adobe XD, you\'ll create responsive designs for various devices and platforms. Through practical projects, you\'ll build a professional portfolio showcasing your ability to solve real design challenges. By the end of the course, you\'ll have the skills and confidence to pursue a career in UI/UX design.',
        instructor: 'Emily Chen',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
        price: 119.99,
        discountedPrice: 0,
        discountPercentage: 0,
        rating: 4.7,
        reviews: 850,
        enrolled: 9870,
        durationHours: 32,
        level: 'Beginner',
        lastUpdated: '2023-10-05',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: true,
        bestseller: false,
        new: false,
        topics: ['Design', 'UI/UX'],
        category: 'Design',
        learningOutcomes: [
            'Understand core principles of user interface design',
            'Conduct effective user research and create user personas',
            'Create wireframes and prototypes using Figma and Adobe XD',
            'Design responsive interfaces for web and mobile applications',
            'Apply color theory, typography, and visual hierarchy in your designs',
            'Conduct usability testing and iterate designs based on feedback',
            'Create a professional UI/UX design portfolio',
            'Understand the UI/UX design process from concept to implementation'
        ],
        prerequisites: [
            'No prior design experience required',
            'Access to a computer with internet connection'
        ],
        modules: [
            {
                title: 'Introduction to UI/UX Design',
                lessons: [
                    'What is UI/UX Design?',
                    'The Role of UI/UX Designers',
                    'Design Thinking Process',
                    'Understanding User-Centered Design'
                ]
            },
            {
                title: 'User Research and Analysis',
                lessons: [
                    'User Research Methods',
                    'Creating User Personas',
                    'User Journey Mapping',
                    'Information Architecture'
                ]
            },
            {
                title: 'Wireframing and Prototyping',
                lessons: [
                    'Introduction to Figma',
                    'Creating Wireframes',
                    'Interactive Prototyping',
                    'Design Systems and Components'
                ]
            },
            {
                title: 'Visual Design Principles',
                lessons: [
                    'Color Theory for Digital Design',
                    'Typography in UI Design',
                    'Layout and Composition',
                    'Visual Hierarchy and Emphasis'
                ]
            },
            {
                title: 'Responsive and Mobile Design',
                lessons: [
                    'Designing for Multiple Devices',
                    'Mobile-First Design Approach',
                    'Responsive Layout Patterns',
                    'Touch Interactions and Gestures'
                ]
            }
        ]
    },
    {
        id: 4,
        title: 'Digital Marketing Strategy and Implementation',
        subtitle: 'Master digital channels and grow your online presence',
        description: 'Learn to create and execute effective digital marketing campaigns across multiple channels including social media, SEO, email, and paid advertising.',
        fullDescription: 'This comprehensive digital marketing course provides you with the strategy and implementation skills to succeed in today\'s online business environment. You\'ll learn how to develop effective marketing campaigns across multiple channels including social media, search engines, email, and paid advertising. Through practical exercises and real-world case studies, you\'ll understand how to identify target audiences, create compelling content, analyze campaign performance, and optimize your marketing efforts for maximum ROI. By the end of this course, you\'ll be able to develop and execute complete digital marketing strategies that drive real business results.',
        instructor: 'David Rodriguez',
        image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        price: 99.99,
        discountedPrice: 79.99,
        discountPercentage: 20,
        rating: 4.6,
        reviews: 760,
        enrolled: 8540,
        durationHours: 28,
        level: 'Intermediate',
        lastUpdated: '2023-09-15',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: false,
        new: true,
        topics: ['Marketing', 'SEO', 'Social Media'],
        category: 'Marketing',
        learningOutcomes: [
            'Develop comprehensive digital marketing strategies',
            'Create and optimize content for search engines',
            'Build effective social media marketing campaigns',
            'Implement email marketing campaigns with high conversion rates',
            'Manage paid advertising campaigns on Google and social platforms',
            'Analyze marketing metrics and calculate ROI',
            'Use marketing automation tools to increase efficiency',
            'Integrate multiple marketing channels for maximum impact'
        ],
        prerequisites: [
            'Basic understanding of marketing concepts',
            'Familiarity with social media platforms'
        ],
        modules: [
            {
                title: 'Digital Marketing Fundamentals',
                lessons: [
                    'The Digital Marketing Landscape',
                    'Setting Marketing Objectives',
                    'Understanding Target Audiences',
                    'Creating Customer Personas',
                    'Digital Marketing Strategy Framework'
                ]
            },
            {
                title: 'Content Marketing',
                lessons: [
                    'Content Strategy Development',
                    'Content Creation Best Practices',
                    'Content Distribution Channels',
                    'Content Performance Measurement',
                    'Content Calendar Management'
                ]
            },
            {
                title: 'Search Engine Optimization (SEO)',
                lessons: [
                    'SEO Fundamentals',
                    'Keyword Research and Analysis',
                    'On-Page SEO Techniques',
                    'Off-Page SEO Strategies',
                    'Technical SEO Essentials'
                ]
            },
            {
                title: 'Social Media Marketing',
                lessons: [
                    'Platform Selection and Strategy',
                    'Content Creation for Social Media',
                    'Community Management',
                    'Social Media Advertising',
                    'Measuring Social Media ROI'
                ]
            },
            {
                title: 'Email Marketing',
                lessons: [
                    'Building Email Lists',
                    'Email Campaign Design',
                    'Automation and Drip Campaigns',
                    'A/B Testing',
                    'Email Analytics and Optimization'
                ]
            }
        ]
    },
    {
        id: 5,
        title: 'Advanced JavaScript: Modern Patterns and Best Practices',
        subtitle: 'Take your JavaScript skills to the next level',
        description: 'Master advanced JavaScript concepts including modern ES6+ features, design patterns, functional programming, and performance optimization.',
        fullDescription: 'This advanced JavaScript course goes beyond the basics to help experienced developers write cleaner, more efficient, and more maintainable code. You\'ll deep dive into ES6+ features, asynchronous programming with Promises and async/await, functional programming principles, and design patterns. The course covers performance optimization techniques and best practices for modern JavaScript development. Through challenging exercises and real-world projects, you\'ll strengthen your skills and learn to solve complex programming problems. By the end of this course, you\'ll have the expertise to build sophisticated applications and work with any modern JavaScript framework.',
        instructor: 'Dr. Sarah Wilson',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        price: 119.99,
        discountedPrice: 0,
        discountPercentage: 0,
        rating: 4.9,
        reviews: 540,
        enrolled: 6780,
        durationHours: 24,
        level: 'Advanced',
        lastUpdated: '2023-10-01',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: false,
        new: true,
        topics: ['JavaScript', 'Web Development'],
        category: 'Web Development',
        learningOutcomes: [
            'Master ES6+ features including arrow functions, destructuring, and modules',
            'Implement asynchronous programming with Promises and async/await',
            'Apply functional programming principles to JavaScript development',
            'Utilize design patterns to solve common programming challenges',
            'Optimize JavaScript code for better performance',
            'Write clean, maintainable, and testable code',
            'Understand JavaScript\'s event loop and runtime environment',
            'Use modern JavaScript tools and build processes'
        ],
        prerequisites: [
            'Solid understanding of JavaScript fundamentals',
            'Experience with basic DOM manipulation',
            'Familiarity with ES6 syntax'
        ],
        modules: [
            {
                title: 'Modern JavaScript Syntax',
                lessons: [
                    'ES6+ Features Overview',
                    'Arrow Functions and Lexical Scope',
                    'Destructuring and Spread/Rest Operators',
                    'Template Literals and Tagged Templates',
                    'Modules and Import/Export'
                ]
            },
            {
                title: 'Advanced Functions and Objects',
                lessons: [
                    'First-Class Functions',
                    'Closures and Scope',
                    'This Keyword and Binding',
                    'Prototypal Inheritance',
                    'Classes and Object-Oriented Patterns'
                ]
            },
            {
                title: 'Asynchronous JavaScript',
                lessons: [
                    'Callbacks and Callback Hell',
                    'Promises and Promise Chaining',
                    'Async/Await Patterns',
                    'Error Handling in Async Code',
                    'Generators and Iterators'
                ]
            },
            {
                title: 'Functional Programming',
                lessons: [
                    'Pure Functions',
                    'Immutability',
                    'Higher Order Functions',
                    'Function Composition',
                    'Currying and Partial Application'
                ]
            },
            {
                title: 'Design Patterns and Best Practices',
                lessons: [
                    'Module Pattern',
                    'Singleton and Factory Patterns',
                    'Observer Pattern',
                    'MVC and MVVM Architecture',
                    'Testing and Debugging Strategies'
                ]
            }
        ]
    },
    {
        id: 6,
        title: 'SQL for Data Analysis',
        subtitle: 'Master database querying for business insights',
        description: 'Learn to write powerful SQL queries to extract, analyze, and visualize data for business intelligence and data-driven decision making.',
        fullDescription: 'This practical SQL course focuses on data analysis techniques using SQL. Starting with the fundamentals of relational databases, you\'ll quickly progress to writing complex queries for data extraction, transformation, and analysis. You\'ll learn how to work with various SQL database systems including MySQL, PostgreSQL, and SQL Server, and understand the nuances between them. Through hands-on exercises using real-world datasets, you\'ll practice aggregating data, joining multiple tables, writing subqueries, and creating views. By the end of this course, you\'ll be able to use SQL confidently to answer business questions and provide data-driven insights.',
        instructor: 'Michael Johnson',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80',
        price: 89.99,
        discountedPrice: 59.99,
        discountPercentage: 33,
        rating: 4.7,
        reviews: 620,
        enrolled: 7450,
        durationHours: 18,
        level: 'Intermediate',
        lastUpdated: '2023-08-20',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: true,
        new: false,
        topics: ['SQL', 'Data Science'],
        category: 'Data Science',
        learningOutcomes: [
            'Write complex SQL queries to extract and analyze data',
            'Understand relational database principles and design',
            'Use aggregate functions and GROUP BY for data summarization',
            'Join multiple tables to combine related data',
            'Apply filtering with WHERE and HAVING clauses',
            'Write subqueries and common table expressions (CTEs)',
            'Create views and stored procedures',
            'Perform data analysis and solve business problems with SQL'
        ],
        prerequisites: [
            'No prior SQL experience required',
            'Basic understanding of spreadsheets and data concepts',
            'No programming experience necessary'
        ],
        modules: [
            {
                title: 'SQL Fundamentals',
                lessons: [
                    'Introduction to Relational Databases',
                    'Basic SELECT Statements',
                    'Filtering Data with WHERE',
                    'Sorting Data with ORDER BY',
                    'LIMIT and OFFSET'
                ]
            },
            {
                title: 'Data Manipulation',
                lessons: [
                    'Arithmetic Operations',
                    'String Functions and Operations',
                    'Date and Time Functions',
                    'Conditional Logic: CASE Statements',
                    'Handling NULL Values'
                ]
            },
            {
                title: 'Aggregations and Grouping',
                lessons: [
                    'Aggregate Functions (COUNT, SUM, AVG, etc.)',
                    'GROUP BY Clause',
                    'HAVING vs WHERE',
                    'Window Functions',
                    'Rolling Calculations'
                ]
            },
            {
                title: 'Joining Tables',
                lessons: [
                    'INNER JOINs',
                    'LEFT, RIGHT, and FULL OUTER JOINs',
                    'CROSS JOINs',
                    'Self-Joins',
                    'UNION and UNION ALL'
                ]
            },
            {
                title: 'Advanced SQL Techniques',
                lessons: [
                    'Subqueries',
                    'Common Table Expressions (CTEs)',
                    'Temporary Tables',
                    'Views',
                    'Performance Optimization'
                ]
            }
        ]
    },
    {
        id: 7,
        title: 'Project Management Essentials',
        subtitle: 'Learn to plan, execute and deliver successful projects',
        description: 'Master the fundamentals of project management including planning, scheduling, risk management, and team leadership.',
        fullDescription: 'This comprehensive course covers all essential aspects of modern project management. You\'ll learn how to initiate, plan, execute, monitor, and close projects successfully using both traditional and agile methodologies. The course provides practical tools and techniques for defining project scope, creating work breakdown structures, developing schedules, managing resources, identifying and mitigating risks, and monitoring progress. You\'ll also develop leadership skills for managing project teams and stakeholder communications. Through case studies and interactive exercises, you\'ll apply these principles to real-world scenarios. By the end of this course, you\'ll be prepared to manage projects of various sizes and complexities.',
        instructor: 'Michelle Park',
        image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        price: 109.99,
        discountedPrice: 87.99,
        discountPercentage: 20,
        rating: 4.6,
        reviews: 480,
        enrolled: 5620,
        durationHours: 25,
        level: 'Beginner',
        lastUpdated: '2023-09-05',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: false,
        new: false,
        topics: ['Management', 'Project Management'],
        category: 'Business',
        learningOutcomes: [
            'Develop comprehensive project plans and schedules',
            'Apply best practices for project initiation and scope definition',
            'Create work breakdown structures and activity sequencing',
            'Manage project resources, budgets, and timelines effectively',
            'Identify and mitigate project risks',
            'Track and report project progress using appropriate metrics',
            'Lead project teams and manage stakeholder communication',
            'Apply both traditional and agile project management approaches'
        ],
        prerequisites: [
            'No prior project management experience required',
            'Basic computer skills',
            'Experience working in teams is helpful but not required'
        ],
        modules: [
            {
                title: 'Project Management Fundamentals',
                lessons: [
                    'Introduction to Project Management',
                    'Project Life Cycle',
                    'Project Management Methodologies',
                    'The Role of the Project Manager',
                    'Project Stakeholders and Communication'
                ]
            },
            {
                title: 'Project Initiation and Planning',
                lessons: [
                    'Defining Project Scope',
                    'Creating the Work Breakdown Structure',
                    'Developing the Project Schedule',
                    'Resource Planning and Allocation',
                    'Budget Development and Cost Estimation'
                ]
            },
            {
                title: 'Project Execution and Control',
                lessons: [
                    'Leading Project Teams',
                    'Managing Project Changes',
                    'Risk Identification and Mitigation',
                    'Quality Management',
                    'Performance Tracking and Reporting'
                ]
            },
            {
                title: 'Agile Project Management',
                lessons: [
                    'Agile Principles and Methodologies',
                    'Scrum Framework',
                    'Sprint Planning and Execution',
                    'Kanban Method',
                    'Hybrid Approaches'
                ]
            },
            {
                title: 'Project Closure and Lessons Learned',
                lessons: [
                    'Project Closure Activities',
                    'Final Deliverables and Acceptance',
                    'Project Documentation',
                    'Lessons Learned Process',
                    'Continuous Improvement'
                ]
            }
        ]
    },
    {
        id: 8,
        title: 'Photography Masterclass: From Beginner to Professional',
        subtitle: 'Master your camera and create stunning photographs',
        description: 'Learn the technical and creative aspects of photography, from camera basics to composition, lighting, editing, and building a photography business.',
        fullDescription: 'This comprehensive photography masterclass takes you from complete beginner to confident photographer. You\'ll learn how to master your camera\'s manual settings, understand exposure, and use different lenses and equipment effectively. The course covers composition techniques, lighting principles, and post-processing workflows using Lightroom and Photoshop. You\'ll explore various photography genres including portrait, landscape, street, and product photography. Through practical assignments and instructor feedback, you\'ll develop your unique photographic style and build a stunning portfolio. The course also includes guidance on building a photography business, from finding clients to pricing your services. By the end, you\'ll have all the skills needed to create professional-quality images.',
        instructor: 'James Wilson',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        price: 129.99,
        discountedPrice: 0,
        discountPercentage: 0,
        rating: 4.8,
        reviews: 720,
        enrolled: 6850,
        durationHours: 35,
        level: 'Beginner',
        lastUpdated: '2023-08-15',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: true,
        new: false,
        topics: ['Photography'],
        category: 'Photography',
        learningOutcomes: [
            'Master your camera\'s manual settings and controls',
            'Understand exposure, aperture, shutter speed, and ISO',
            'Apply composition principles to create visually compelling images',
            'Work with natural and artificial lighting effectively',
            'Edit and enhance photos using Lightroom and Photoshop',
            'Develop skills in multiple photography genres',
            'Build a professional photography portfolio',
            'Start and grow a photography business'
        ],
        prerequisites: [
            'A digital camera (DSLR or mirrorless preferred but not required)',
            'Basic computer skills',
            'No prior photography experience needed'
        ],
        modules: [
            {
                title: 'Camera Basics and Exposure',
                lessons: [
                    'Understanding Your Camera',
                    'Exposure Triangle: Aperture, Shutter Speed, and ISO',
                    'Shooting Modes: Manual, Aperture Priority, Shutter Priority',
                    'Focus Techniques',
                    'Lenses and Their Creative Uses'
                ]
            },
            {
                title: 'Photography Composition',
                lessons: [
                    'Rule of Thirds and Golden Ratio',
                    'Leading Lines and Patterns',
                    'Framing and Perspective',
                    'Color Theory in Photography',
                    'Creating Visual Stories'
                ]
            },
            {
                title: 'Lighting Techniques',
                lessons: [
                    'Natural Light Photography',
                    'Golden Hour and Blue Hour',
                    'Introduction to Flash Photography',
                    'Studio Lighting Setups',
                    'Light Modifiers and Their Effects'
                ]
            },
            {
                title: 'Post-Processing Workflow',
                lessons: [
                    'Adobe Lightroom Basics',
                    'Color Correction and Enhancement',
                    'Retouching in Adobe Photoshop',
                    'Creating Presets and Actions',
                    'Exporting for Different Purposes'
                ]
            },
            {
                title: 'Photography Genres',
                lessons: [
                    'Portrait Photography',
                    'Landscape Photography',
                    'Street Photography',
                    'Product and Still Life Photography',
                    'Event Photography'
                ]
            }
        ]
    },
    {
        id: 9,
        title: 'Financial Modeling and Valuation',
        subtitle: 'Master financial analysis and company valuation techniques',
        description: 'Learn to build financial models and perform company valuation using Excel, including DCF, comparable company analysis, and precedent transactions.',
        fullDescription: 'This comprehensive course teaches you the essential financial modeling and valuation skills used by investment bankers, equity research analysts, and finance professionals. You\'ll learn to build dynamic financial models from scratch using Microsoft Excel, including three-statement models (income statement, balance sheet, cash flow statement), DCF valuation models, LBO models, and M&A models. The course covers financial statement analysis, forecasting methods, and various valuation techniques including comparable company analysis and precedent transactions. Through hands-on case studies and real-world examples, you\'ll gain practical skills that you can immediately apply in your career. By the end of this course, you\'ll be able to build sophisticated financial models and perform company valuations with confidence.',
        instructor: 'Robert Chang',
        image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80',
        price: 159.99,
        discountedPrice: 127.99,
        discountPercentage: 20,
        rating: 4.7,
        reviews: 540,
        enrolled: 4980,
        durationHours: 30,
        level: 'Intermediate',
        lastUpdated: '2023-09-10',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: false,
        new: false,
        topics: ['Finance', 'Excel'],
        category: 'Business',
        learningOutcomes: [
            'Build dynamic three-statement financial models in Excel',
            'Perform discounted cash flow (DCF) valuation',
            'Conduct comparable company analysis and precedent transactions analysis',
            'Create merger and acquisition (M&A) models',
            'Build leveraged buyout (LBO) models',
            'Analyze financial statements and forecast future performance',
            'Apply sensitivity and scenario analysis to financial models',
            'Present valuation results and investment recommendations'
        ],
        prerequisites: [
            'Basic knowledge of accounting and finance concepts',
            'Proficiency with Microsoft Excel',
            'Understanding of financial statements (income statement, balance sheet, cash flow statement)'
        ],
        modules: [
            {
                title: 'Financial Modeling Fundamentals',
                lessons: [
                    'Excel for Financial Modeling',
                    'Financial Statement Analysis',
                    'Forecasting Techniques',
                    'Model Design and Best Practices',
                    'Formatting and Presentation'
                ]
            },
            {
                title: 'Three-Statement Modeling',
                lessons: [
                    'Income Statement Modeling',
                    'Balance Sheet Modeling',
                    'Cash Flow Statement Modeling',
                    'Linking the Three Statements',
                    'Circular References and Debt Sweeps'
                ]
            },
            {
                title: 'Discounted Cash Flow (DCF) Valuation',
                lessons: [
                    'Free Cash Flow Calculation',
                    'WACC Calculation',
                    'Terminal Value Estimation',
                    'Calculating Enterprise and Equity Value',
                    'Sensitivity Analysis'
                ]
            },
            {
                title: 'Relative Valuation Techniques',
                lessons: [
                    'Comparable Company Analysis',
                    'Precedent Transactions Analysis',
                    'Selecting Appropriate Multiples',
                    'Interpreting Valuation Results',
                    'Creating Valuation Football Fields'
                ]
            },
            {
                title: 'Advanced Modeling Techniques',
                lessons: [
                    'Merger and Acquisition (M&A) Modeling',
                    'Accretion/Dilution Analysis',
                    'Leveraged Buyout (LBO) Modeling',
                    'Scenario and Sensitivity Analysis',
                    'Presenting Investment Recommendations'
                ]
            }
        ]
    },
    {
        id: 10,
        title: 'Mobile App Development with Flutter',
        subtitle: 'Build cross-platform mobile apps for iOS and Android',
        description: 'Learn to develop beautiful, native-quality iOS and Android apps from a single codebase using Flutter and Dart programming language.',
        fullDescription: 'This comprehensive Flutter course teaches you to build high-performance, visually attractive mobile applications that work on both iOS and Android from a single codebase. You\'ll learn the Dart programming language and the Flutter framework from the ground up, starting with the fundamentals and progressing to advanced topics. Through hands-on projects, you\'ll master Flutter widgets, state management, navigation, data persistence, API integration, and more. You\'ll also learn best practices for app architecture, testing, and deployment to app stores. By the end of this course, you\'ll have the skills to develop and publish professional-quality mobile applications using Flutter.',
        instructor: 'Alex Kumar',
        image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        price: 139.99,
        discountedPrice: 0,
        discountPercentage: 0,
        rating: 4.8,
        reviews: 680,
        enrolled: 6120,
        durationHours: 36,
        level: 'Intermediate',
        lastUpdated: '2023-10-12',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: true,
        new: true,
        topics: ['Flutter', 'Mobile Development', 'Dart'],
        category: 'Web Development',
        learningOutcomes: [
            'Develop cross-platform mobile apps with Flutter for iOS and Android',
            'Master the Dart programming language',
            'Build responsive and visually appealing user interfaces with Flutter widgets',
            'Implement state management using Provider and Bloc patterns',
            'Integrate REST APIs and handle data persistence',
            'Create custom animations and transitions',
            'Test and debug Flutter applications',
            'Deploy apps to Google Play Store and Apple App Store'
        ],
        prerequisites: [
            'Basic programming knowledge in any language',
            'Understanding of object-oriented programming concepts',
            'Familiarity with mobile app concepts is helpful but not required',
            'Mac required for iOS deployment (optional, not required for learning)'
        ],
        modules: [
            {
                title: 'Getting Started with Flutter',
                lessons: [
                    'Introduction to Flutter and Dart',
                    'Setting Up the Development Environment',
                    'Flutter Project Structure',
                    'Dart Fundamentals',
                    'Your First Flutter App'
                ]
            },
            {
                title: 'Flutter UI Development',
                lessons: [
                    'Understanding Widgets',
                    'Layout Widgets and Techniques',
                    'Styling and Theming',
                    'Building Responsive Interfaces',
                    'Custom Widgets and UI Components'
                ]
            },
            {
                title: 'State Management',
                lessons: [
                    'StatefulWidget and State',
                    'Provider Pattern',
                    'Bloc Pattern',
                    'Redux in Flutter',
                    'Choosing the Right State Management Approach'
                ]
            },
            {
                title: 'Data and Backend Integration',
                lessons: [
                    'Working with HTTP and REST APIs',
                    'JSON Serialization',
                    'Local Data Storage',
                    'Firebase Integration',
                    'Authentication and User Management'
                ]
            },
            {
                title: 'Advanced Flutter Techniques',
                lessons: [
                    'Navigation and Routing',
                    'Animations and Transitions',
                    'Testing Flutter Applications',
                    'Performance Optimization',
                    'Publishing to App Stores'
                ]
            }
        ]
    },
    {
        id: 11,
        title: 'The Complete Drawing and Illustration Masterclass',
        subtitle: 'From basic sketching to advanced digital art techniques',
        description: 'Learn to draw professionally, from fundamentals to advanced techniques in both traditional and digital media.',
        fullDescription: 'This comprehensive drawing and illustration course takes you from basic sketching techniques to advanced digital illustration. Beginning with the fundamentals of line, shape, and perspective, you\'ll develop a strong foundation in traditional drawing skills using pencil, charcoal, and ink. You\'ll study figure drawing, portraits, landscapes, and still life. The course then transitions to digital illustration using industry-standard software like Procreate, Adobe Photoshop, and Illustrator. You\'ll learn color theory, composition, stylization, and advanced rendering techniques. Through guided projects and personalized feedback, you\'ll develop your unique artistic style and build a professional portfolio. Whether you\'re a complete beginner or looking to enhance your existing skills, this course provides the tools and knowledge to achieve professional-level drawing and illustration abilities.',
        instructor: 'Emma Rodriguez',
        image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1756&q=80',
        price: 119.99,
        discountedPrice: 83.99,
        discountPercentage: 30,
        rating: 4.7,
        reviews: 810,
        enrolled: 7240,
        durationHours: 40,
        level: 'Beginner',
        lastUpdated: '2023-08-25',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: false,
        new: false,
        topics: ['Drawing', 'Design', 'Illustration'],
        category: 'Design',
        learningOutcomes: [
            'Master fundamental drawing techniques for line, shape, and form',
            'Understand and apply perspective and composition principles',
            'Develop realistic shading and texturing skills',
            'Draw human figures, faces, and expressions accurately',
            'Transition from traditional to digital drawing tools',
            'Create professional illustrations using digital software',
            'Apply color theory and lighting principles effectively',
            'Develop a unique artistic style and professional portfolio'
        ],
        prerequisites: [
            'No prior drawing experience required',
            'Basic computer skills for the digital illustration sections',
            'Access to basic drawing supplies (pencils, paper)',
            'Digital drawing tools recommended but not required (tablet, stylus)'
        ],
        modules: [
            {
                title: 'Drawing Fundamentals',
                lessons: [
                    'Line, Shape, and Form',
                    'Perspective and Depth',
                    'Light and Shadow',
                    'Texture and Detail',
                    'Composition Principles'
                ]
            },
            {
                title: 'Subject-Based Drawing',
                lessons: [
                    'Still Life Drawing',
                    'Landscape Drawing',
                    'Figure Drawing Basics',
                    'Portrait and Face Drawing',
                    'Dynamic Poses and Movement'
                ]
            },
            {
                title: 'Advanced Traditional Techniques',
                lessons: [
                    'Pencil Rendering Techniques',
                    'Charcoal Drawing',
                    'Ink and Pen Techniques',
                    'Watercolor and Mixed Media',
                    'Creating Texture and Atmosphere'
                ]
            },
            {
                title: 'Digital Drawing Fundamentals',
                lessons: [
                    'Introduction to Digital Tools',
                    'Procreate for iPad',
                    'Adobe Photoshop Basics',
                    'Brushes and Effects',
                    'Digital Coloring Techniques'
                ]
            },
            {
                title: 'Professional Illustration',
                lessons: [
                    'Developing Your Style',
                    'Character Design',
                    'Environment Illustration',
                    'Editorial and Commercial Illustration',
                    'Building Your Portfolio'
                ]
            }
        ]
    },
    {
        id: 12,
        title: 'Artificial Intelligence: Modern Applications and Ethics',
        subtitle: 'Understand AI concepts, implementations, and ethical considerations',
        description: 'Explore the world of artificial intelligence, machine learning, neural networks, and the ethical implications of AI in society.',
        fullDescription: 'This comprehensive course provides a balanced exploration of artificial intelligence technologies and their ethical implications. Starting with the fundamentals of AI, machine learning, and neural networks, you\'ll gain a solid understanding of how these technologies work and are applied in various industries. Through practical examples and case studies, you\'ll learn about natural language processing, computer vision, reinforcement learning, and generative AI. The course also deeply examines the ethical considerations surrounding AI implementation, including bias, privacy, transparency, and automation impacts. You\'ll analyze real-world ethical dilemmas and develop frameworks for responsible AI development and deployment. By the end of this course, you\'ll have both technical knowledge and ethical awareness to engage meaningfully with AI technologies.',
        instructor: 'Dr. Patricia Martinez',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80',
        price: 149.99,
        discountedPrice: 119.99,
        discountPercentage: 20,
        rating: 4.9,
        reviews: 560,
        enrolled: 5840,
        durationHours: 32,
        level: 'Intermediate',
        lastUpdated: '2023-10-15',
        language: 'English',
        format: 'Video',
        certificate: true,
        featured: false,
        bestseller: false,
        new: true,
        topics: ['AI', 'Machine Learning', 'Ethics'],
        category: 'IT & Software',
        learningOutcomes: [
            'Understand the fundamental concepts and theories behind artificial intelligence',
            'Recognize different AI approaches including machine learning, deep learning, and neural networks',
            'Explore practical applications of AI across various industries',
            'Identify ethical challenges posed by AI technologies',
            'Analyze issues of bias, privacy, and transparency in AI systems',
            'Develop frameworks for responsible AI development and use',
            'Evaluate societal impacts of automation and AI integration',
            'Apply ethical considerations to real-world AI implementation scenarios'
        ],
        prerequisites: [
            'Basic understanding of computer science concepts',
            'Familiarity with logic and critical thinking',
            'No programming experience required, though it can be helpful',
            'Interest in both technology and ethics'
        ],
        modules: [
            {
                title: 'Introduction to Artificial Intelligence',
                lessons: [
                    'What is Artificial Intelligence?',
                    'History and Evolution of AI',
                    'Types of AI: Narrow vs. General',
                    'Key Components of AI Systems',
                    'Current State of AI Technology'
                ]
            },
            {
                title: 'Machine Learning and Neural Networks',
                lessons: [
                    'Machine Learning Fundamentals',
                    'Supervised vs. Unsupervised Learning',
                    'Neural Networks and Deep Learning',
                    'Natural Language Processing',
                    'Computer Vision Applications'
                ]
            },
            {
                title: 'AI Applications and Case Studies',
                lessons: [
                    'AI in Healthcare',
                    'AI in Finance and Business',
                    'AI in Transportation and Autonomous Vehicles',
                    'AI in Entertainment and Creative Fields',
                    'AI in Education and Research'
                ]
            },
            {
                title: 'Ethical Implications of AI',
                lessons: [
                    'Bias and Fairness in AI Systems',
                    'Privacy and Surveillance Concerns',
                    'Transparency and Explainability',
                    'Automation and Economic Impacts',
                    'Accountability in AI Development'
                ]
            },
            {
                title: 'Responsible AI Development',
                lessons: [
                    'Ethical Frameworks for AI',
                    'Policy and Regulation Approaches',
                    'Designing for Human-Centered AI',
                    'Testing and Mitigating Bias',
                    'Future of AI Ethics and Governance'
                ]
            }
        ]
    }
];