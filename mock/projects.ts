export const blogs = [
  {
    id: 1,
    title: "A journey to master Data Structure and Algorithm",
    date: "10 Dec, 2021",
    description:
      "A modern and responsive portfolio website using Next.js, MUI, Redux, and Saga. With Next.js, I was able to leverage server-side rendering and static site generation for improved performance and faster load times. The website was designed using MUI, a library of pre-built React components that follow Material Design principles, resulting in a sleek and professional design. To handle state management and asynchronous actions, I integrated Redux and Saga. This allowed for efficient state management and smooth user interactions, resulting in a faster and more seamless user experience. The website showcases my skills, experience, and projects, and is an excellent representation of my abilities as a web developer.",
    image:
      "https://w10.naukri.com/mailers/2022/naukri-learning/what-is/What-is-Data-Structures-and-Algorithms.jpg",
    slug: "How_To_Work_Better_Efficiency_Tools_Every_Logo_Designer_Needs",
    content: `<p>Blog content</p>`,
    showinportfolio: true,
  },
  {
    id: 2,
    title: "A journey to master High Level Designing",
    date: "10 Dec, 2021",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, porro rem quod illo quam, eum alias id, repellendus magni, quas. ",
    image:
      "https://www.tibdglobal.com/wp-content/uploads/2021/04/Technopreneurship-New-Breed-of-Entrepreneurship-min.jpg",
    slug: "How_To_Work_Better_Efficiency_Tools_Every_Logo_Designer_Needs",
    content: `<p>Blog content</p>`,
    showinportfolio: true,
  },
  {
    id: 3,
    title: "A journey to master Low Level Designing",
    date: "10 Dec, 2021",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, porro rem quod illo quam, eum alias id, repellendus magni, quas. ",
    image: "https://miro.medium.com/max/786/0*-Fy12ogfPHSMIwtF",
    slug: "How_To_Work_Better_Efficiency_Tools_Every_Logo_Designer_Needs",
    content: `<p>Blog content</p>`,
    showinportfolio: false,
  },
  {
    id: 4,
    title: "A journey to master Machine coding",
    date: "10 Dec, 2021",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, porro rem quod illo quam, eum alias id, repellendus magni, quas.",
    image:
      "https://images.newscientist.com/wp-content/uploads/2020/03/30125337/gettyimages-692654376_web.jpg?width=300",
    slug: "How_To_Work_Better_Efficiency_Tools_Every_Logo_Designer_Needs",
    content: `<p>Blog content</p>`,
    showinportfolio: true,
  },
  {
    id: 5,
    title: "How to build a portfolio web application with NextJS & ExpressJS",
    date: "10 Dec, 2021",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, porro rem quod illo quam, eum alias id, repellendus magni, quas. ",
    image:
      "https://www.tibdglobal.com/wp-content/uploads/2021/04/Technopreneurship-New-Breed-of-Entrepreneurship-min.jpg",
    slug: "How_To_Work_Better_Efficiency_Tools_Every_Logo_Designer_Needs",
    content: `<p>Blog content</p>`,
    showinportfolio: true,
  },
];

export const projects = [
  {
    id: 0,
    title: "Wizard's Chess - 3D Online Multiplayer Game",
    date: "", // Project initiation date
    visitWebsite: "https://www.chess.anandkris.com/",
    isPersonalProject: true,
    description:
      "Wizard's Chess is an online multiplayer game featuring real-time video chat options. Participants can create game sessions, invite opponents, and immerse themselves in both real-time gameplay and video conversations for a unique and engaging experience.",
    image: "/images/chess.png", // Image path
    slug: "wizards_chess",
    content: `
    <h2>Case Study:</h2>

    <h3>1. Overview</h3>
    <p>
        I wanted to learn about WebRTC, Three.js, and Firebase. After completing relevant courses, I decided to put my skills to the test with a practical project. That's when the idea of building a 3D multiplayer chess game with real-time video chat came to mind—it was the perfect way to use the tech stacks I had just learned. To make it more interesting, I chose the theme of Wizard's Chess from the Harry Potter movies.
    </p>

    <h3>2. Case Study</h3>
    <p>
        The development unfolded in several captivating stages, each contributing to the immersive gaming experience:
        <ol>
            <li><strong>Asset Preparation:</strong> The journey began with gathering essential assets, including intricately designed Harry Potter-themed chess pieces. Free sources provided the foundation, and subtle tweaks in Blender ensured these pieces harmonized seamlessly with the enchanting game environment.</li>
            <li><strong>3D Integration with Three.js and React Three Fiber:</strong> In the second stage, Three.js and React Three Fiber took center stage. Placing 3D pieces on the chessboard, fine-tuning lighting, adjusting the camera, and implementing fluid motion brought a visually stunning and interactive dimension to the game. The decision to separate movement logic from the UI layer added a layer of flexibility to the overall application architecture.</li>
            <li><strong>State Management with Redux Toolkit:</strong> Managing the intricate dance of game states marked the third stage. The symbiotic relationship between the movement and state management layers found harmony with Redux Toolkit—a choice made for its flexibility and streamlined setup, ensuring a smooth and organized development process.</li>
            <li><strong>WebRTC for Real-Time Video Chat:</strong> The fourth stage introduced WebRTC to enable real-time video chat between participants. Before integration, a Proof of Concept (POC) for a simple video chat app was meticulously crafted. Firebase played a dual role as the signaling server, laying the foundation for both video chat and the full-duplex exchange of chess piece movements between opponents.</li>
            <li><strong>Syncing State with Firebase:</strong> The final stage brought everything together by seamlessly syncing the local Redux state with Firebase. Active listening for Firebase updates and a meticulous synchronization process ensured a responsive and cohesive multiplayer experience, preserving the integrity of the game state across all participants.</li>
        </ol>
    </p>
    <h3>3. Challenges Faced</h3>
    <p>
        The journey to create Wizard's Chess was not without its hurdles:
        <ol>
            <li><strong>Building 3D Piece Models:</strong> Constructing 3D chess piece models posed a significant challenge initially. However, the solution emerged when reliable and free piece models were discovered from online sources.</li>
            <li><strong>Learning Blender:</strong> Being new to Blender presented a learning curve, causing a temporary delay in development. Acquiring proficiency in Blender was essential for the successful creation of captivating 3D models.</li>
            <li><strong>Choosing a Signaling Server:</strong> Initially considering Socket.io for the signaling server, the challenge arose due to the cost implications of maintaining a dedicated socket server. The pivot to Firebase, with its free tier, proved to be a fitting and cost-effective solution.</li>
            <li><strong>Integrating WebRTC:</strong> Integrating WebRTC brought both excitement and difficulty. Despite the challenges, this decision set Wizard's Chess apart from other online multiplayer chess games, providing a unique and valuable feature.</li>
            <li><strong>Syncing with Firebase:</strong> While syncing redux state with Firebase became relatively straightforward after integrating WebRTC, it highlighted the importance of leveraging existing boilerplate code already implemented for integrating WebRTC in the game. This streamlined the process, making it significantly easier than building from scratch.</li>
        </ol>
    </p>
    <h3>4. Future Growth</h3>
    <p>
        Looking ahead, Wizard's Chess is set for exciting developments:
        <ul>
            <li><strong>2D View for Mobile Users:</strong> The plan includes developing a 2D view to enhance the gaming experience for mobile users, making it more accessible and enjoyable on smaller screens.</li>
            <li><strong>Automatic Game Matching:</strong> A distant yet ambitious plan involves implementing automatic game matching between online players. This feature aims to streamline the process of finding opponents and enhancing the overall multiplayer experience.</li>
            <li><strong>AI-Enabled Gameplay:</strong> With a newfound interest in AI and machine learning, the future holds the possibility of introducing AI-enabled gameplay. This feature would allow participants to engage in a game against computer opponents, providing both a learning opportunity and an exciting challenge.</li>
        </ul>
        These future endeavors not only aim to enhance the user experience but also offer valuable learning opportunities in emerging technologies.
    </p>

    <h3>5. Tech Stack</h3>
    <p>
        The magical world of Wizard's Chess was brought to life using an enchanting tech stack:
        <ul>
            <li><strong>Next.js:</strong> For a seamless and optimized web development experience.</li>
            <li><strong>Three.js:</strong> Powering the mesmerizing 3D graphics in the game.</li>
            <li><strong>React Three Fiber:</strong> Enhancing the capabilities of Three.js within the React framework.</li>
            <li><strong>WebRTC:</strong> Enabling real-time video chat features, adding a unique dimension to the gameplay.</li>
            <li><strong>TypeScript:</strong> Providing a robust and statically-typed foundation for the codebase.</li>
            <li><strong>Sass:</strong> Styling the application with a touch of magic.</li>
            <li><strong>Firebase (Firestore):</strong> Works a signalling server for WebRTC and manages real-time data and communication between players seamlessly.</li>
            <li><strong>Redux Toolkit:</strong> Ensuring efficient state management for a smooth gaming experience.</li>
            <li><strong>Vercel Analytics:</strong> Leveraging analytics to gain insights and optimize performance on the Vercel platform.</li>
        </ul>
        This powerful combination of technologies was carefully chosen to create a delightful and immersive gaming experience.
    </p>
    <h3>6. Deployment</h3>
    <p>
        Bringing the magic to the online realm involved a strategic deployment plan:
        <ul>
            <li><strong>Vercel for Next.js App:</strong> The Next.js application, being the heart of Wizard's Chess, found its home on Vercel. This platform ensured seamless deployment and optimization for an enchanting user experience.</li>
            <li><strong>Firebase Firestore:</strong> Firebase played a multi-faceted role—serving as the database, signaling server, and managing socket connections. This versatile integration allowed for efficient communication and data storage, contributing to the overall magic of the game.</li>
        </ul>
    </p>
    <br/>
    <br/>
    `,
    techStack: [
      "Next.js",
      "Three.js",
      "WebRTC",
      "Redux Toolkit",
      "Firebase",
      "TypeScript",
      "SCSS",
    ],
    showinportfolio: true,
  },
  {
    id: 1,
    title: "Fashion Retail E-Commerce SPA ",
    date: "",
    description:
      "Collaborated with a diverse multinational team, developing and managing a high-traffic SPA with 40+ million monthly visits. Gained expertise in optimizing scalability, flexibility, and maintainability using mono repository and microservice architecture.",
    image: "/images/E-commerce-spa.png",
    slug: "e-commerce_spa",
    content: ` 
    <h3>Overview: Embarking on an Exciting Opportunity<br>
    </h3>
    <p></p>
    <p>It all began when the client approached my current company, seeking a skilled developer to create Proof of Concepts (POCs). Intrigued by the challenge, I was chosen by my company to spearhead this exciting opportunity. Collaborating closely with client-side Product Development Managers (PDMs) and Project Managers (PMs), I navigated through the intricate requirements and successfully completed the POCs, showcasing my strong problem-solving abilities and attention to detail.<br>
    </p>
    <p></p>
    <h3>The Journey Begins:&nbsp;Recognizing Value and Retention</h3>
    <p></p>
    <p>As the POCs reached fruition, the client recognized the value I brought to the table. Impressed by my technical expertise and dedication, they sought to retain me for their client-facing e-commerce SPA. And so, my journey with the application began</p>
    <p></p>
    <h3>Expanding Expertise and Embracing Challenges:&nbsp;Growth through Experience<br>
    </h3>
    <p></p>
    <p>Throughout this journey, I gained invaluable knowledge and exposure to a wide array of new skills and concepts. Working on the customer-facing e-commerce application allowed me to expand my expertise in various areas and explore new horizons. I learned valuable lessons in problem-solving, documentation, collaboration, technical debt management, and effective communication. This experience has not only enhanced my professional growth but also equipped me with the confidence and adaptability to take on new challenges in the future.</p>
    
    <h3><strong>Roles and responsibilities:</strong></h3>
  
    <ul>
    <li>Applied expertise in <strong>React, Redux, Saga, and TypeScript</strong> at a global fashion retail brand, enhancing the SPA for <strong>40+ million users with minimal downtime.</strong></li>

    <li>Managed efficient <strong>CI/CD releases</strong>, ensuring seamless deployment and prompt issue resolution for the e-commerce app.</li>
  
    <li>Used <strong>Google Analytics</strong> to cut a page's bounce rate from 56% to 10%, boosting user engagement and conversions by 7%.</li>
  
    <li>Actively engaged in <strong>GitHub</strong> peer reviews, upholding high code quality for continuous improvement.</li>
  
    <li>Improved code quality with automated tests, increasing coverage from 62% to 85% and reducing bugs in subsequent releases.</li>
  
    <li>Refactored outdated code into a <strong> scalable React architecture</strong>, enabling seamless expansion across sub-brands and countries.</li>
  
    <li>Developed <strong>Proof of Concepts</strong> with React, TypeScript, Redux, and more to swiftly address customer-reported issues.</li>
    </ul>
    <p></p>
    <h3>Commitment to Confidentiality:&nbsp;Upholding Loyalty and Discretion</h3>
    <p></p>
    <p>Due to the confidentiality and non-disclosure agreements in place, I am committed to maintaining the utmost loyalty and discretion regarding the specific details of the project. Rest assured, my experience in collaborating with this esteemed client has enriched my skillset and deepened my understanding of the complexities involved in developing successful e-commerce applications. I look forward to applying the valuable insights and expertise gained from this collaboration to future endeavors while upholding the trust placed in me by all parties involved.</p>
    <p></p>
    <h3>Future Growth and Opportunities:&nbsp;Eagerly Embracing New Journeys</h3>
    <p></p>
    <p>As I continue to grow in my career, I eagerly look forward to embarking on new journeys, taking on fresh challenges, and embracing the opportunities that lie ahead. My experiences thus far have prepared me to tackle new projects with confidence, and I am excited to contribute to the success of future endeavors.</p>
    <p></p>
    <p><br>
    </p>
    <p></p>
    <p> </p>
`,
    techStack: [
      "React.JS",
      "Typescript",
      "Redux",
      "GraphQL",
      "Saga",
      "Monorepo (Lerna)",
      "Google Analytics",
      "SSR",
      "Datadog",
      "Jenkins",
      "AWS",
      "Jest",
      "React Testing Library",
      "Firebase",
      "Webpack",
    ],
    showinportfolio: true,
  },
  {
    id: 2,
    title:
      "Error Handling & Endpoint Visualization for a fashion retail client (POCs)",
    date: "",
    description:
      "Developed two impactful proof-of-concept (POC) projects for a top Japanese fashion retailer. The first project streamlined error handling documentation for numerous microservices, replacing Google Sheets for easier issue identification and tracking. The second project created an endpoint diagramming tool, enhancing visualization of API calls between SPA, BFF, and microservices components.",
    image: "/images/poc.png",
    slug: "POCs_for_Fashion_Retail_Gaint",
    content: `<h3>Introduction</h3>
    <h3>Overview</h3>
<p>Collaborating with a renowned Japanese fashion retail giant, I held a pivotal role in two crucial proof-of-concept (POC) projects. The first project aimed to revolutionize error handling processes within their application, which consisted of over 50 different microservices. Previously, the client relied on Google Sheets for documenting error scenarios. To streamline this process and enhance efficiency, I single-handedly developed a comprehensive and user-friendly error handling documentation tool. The second project involved creating an endpoint diagramming tool to visually represent API calls within the application, providing valuable insights into its complex interactions.</p>

<h3>My roles and responsibilities encompassed:</h3>

<p><strong>Error Handling Documentation Tool:</strong></p>

<ul>
  <li>Conceptualizing, designing, and implementing a streamlined error handling documentation tool to replace the previous reliance on Google Sheets.</li>
  <li>Integrating the tool seamlessly with the existing infrastructure, significantly reducing the time and effort required to identify and track customer-reported issues.</li>
  <li>Collaborating closely with customer service teams, operations teams, and product managers to ensure seamless collaboration and efficient problem-solving processes.</li>
  <li>Empowering root cause analysis by implementing a systematic approach to identify and address customer-reported issues.</li>
</ul>

<p><strong>Endpoint Diagramming Tool:</strong></p>

<ul>
  <li>Creating a proof-of-concept endpoint diagramming tool that visually represented API calls between the Single Page Application (SPA), Backend for Frontend (BFF), and other microservices.</li>
  <li>Enhancing troubleshooting capabilities by providing developers and operations teams with a comprehensive visualization of the application&apos;s API communication.</li>
  <li>Ensuring scalability and flexibility by designing the tool to adapt to evolving microservice architectures and facilitate future development and maintenance.</li>
</ul>

      `,
    techStack: [
      "React.JS",
      "Typescript",
      "Node.JS",
      "Express.JS",
      "Webpack",
      "Mermaid.JS",
      "Localstack",
      "Material UI",
      "SCSS",
      "AWS S3",
      "Docker",
      "Git",
    ],
    showinportfolio: true,
  },
  {
    id: 3,
    title: "Building a React Component Library for a Japanese client",
    date: "",
    description:
      "Engineered a monorepo React component library utilizing npm and Storybook, enhancing UI development. Centralized and standardized components for optimal reusability, emphasizing the integration of npm for package management and Storybook for comprehensive component documentation and testing.",
    image: "/images/ui_lib.png",
    slug: "ui_component_library",
    content: ` 
    <h3>Overview</h3>
<p>I played a pivotal role in transforming this vision into reality. Working closely with a talented team of three junior developers, our collective focus was on delivering a collection of reusable components that would guarantee consistency throughout the hotel management application.<br>
</p>

<h3>My Roles and Responsibilities:&nbsp;</h3>

<ol>
  <li>
<p><strong>Project Planning and Execution:</strong>
I actively participated in the project&apos;s planning and execution phases. Working closely with the team, we defined clear project goals, established milestones, and allocated tasks effectively to ensure smooth progress.</p>
  </li>
  <li>
<p><strong>Component Architecture and Development:
</strong>Leveraging my expertise in UI development, I played a pivotal role in the design and development of the React component library. I focused on creating reusable components that met the specific requirements of the hotel management application while upholding best practices and ensuring a cohesive user interface.</p>
  </li>
  <li>
<p><strong>Monorepo Implementation:
</strong>I actively contributed to the implementation of the monorepo architecture, enabling efficient code sharing and maintenance. By organizing multiple packages within a single repository, we fostered seamless collaboration among team members and set the foundation for future scalability.</p>
  </li>
  <li>
<p><strong>Integration of Storybook:</strong>
Recognizing the importance of effective documentation and testing, I spearheaded the integration of Storybook into our development workflow. This powerful tool served as a platform for documenting and visually testing the components in isolation, facilitating collaboration with stakeholders and ensuring their reliability.</p>
  </li>
</ol>
      `,
    techStack: [
      "React.JS",
      "Typescript",
      "Storybook",
      "Sass",
      "Webpack",
      "Rollup",
    ],
    showinportfolio: true,
  },
  {
    id: 4,
    title: "Email Template Builder Application",
    date: "",
    description:
      "As the Project In-Charge (PIC), I played a pivotal role in developing an internal email template builder application for QBurst. This project aimed to enhance internal communication within the organization by providing a user-friendly interface for creating and managing email templates.",
    image: "/images/email_template_builder.png",
    slug: "email_template_builder",
    content: ` <h3>Overview</h3>

    <p> </p>
    
    <p>As the Project In-Charge (PIC) for an internal email template builder application, I played a pivotal role in enhancing internal communication within the organization. This project focused on developing a user-friendly interface for creating and managing email templates. In this article, I will highlight my key responsibilities and contributions to the project.</p>
    
    <p> </p>
    
    <h3>Roles and Responsibilities</h3>
    
    <p> </p>
    
    <ol>
      <li> 
    <p><strong>Project Leadership:</strong>
        I led the project, overseeing the entire development process from start to finish. This involved defining project goals, coordinating with the development team, and ensuring timely and successful delivery of the application.</p>
     </li>
      <li> 
    <p><strong>Requirement Analysis:</strong>
        I conducted thorough requirement analysis, working closely with stakeholders to understand their needs and expectations. This helped shape the scope and features of the email template builder application.</p>
     </li>
      <li> 
    <p><strong>User-Friendly Interface:</strong>
        I worked closely with the design team to create an intuitive and visually appealing user interface for the application. This interface allowed users to easily create and manage email templates, ensuring a seamless user experience.</p>
     </li>
      <li> 
    <p><strong>Email Template Management:</strong>
        I designed and implemented functionalities for effective email template management. This included features to organize templates, making it easier for users to categorize and retrieve them as needed.</p>
     </li>
      <li> 
    <p><strong>Draft Creation and Editing:
    </strong>    I oversaw the development of features that enabled users to create drafts with actual data. This allowed users to preview and fine-tune the content before sending internal emails, ensuring accuracy and personalized communication.</p>
     </li>
      <li> 
    <p><strong>Scheduling and Sending Emails:
    </strong>    I played a key role in implementing features for scheduling and sending emails within the application. This allowed users to set specific dates and times for sending internal emails, ensuring timely delivery and efficient communication.</p>
     </li>
    </ol>
    
    <p> </p>
    

      `,
    techStack: [
      "React.JS",
      "Typescript",
      "Webpack",
      "Redux",
      "Saga",
      "Sass",
      "Sendgrid",
    ],
    showinportfolio: true,
  },
  {
    id: 5,
    title: "Portfolio Frontend Application",
    date: "10 Dec, 2021 - 19 July, 2022",
    visitGithub: "https://github.com/Anand-Krishnan-M-J/Personal-Portfolio-SPA",
    isPersonalProject: true,
    description:
      "From meticulous design to seamless deployment and domain acquisition, every facet of this website was crafted with precision. This immersive project served as a valuable learning experience, offering insights and skill refinement. Join me in exploring this passion-driven website, where innovation converges with personal growth.",
    image: "/images/portfolio_spa.png",
    slug: "my_portfolio_website_spa",
    content: ` <p>My Portfolio website is a Single Page Application (SPA) that's designed to showcase my work and make it easy for visitors to navigate and explore my content. Here are some of the features that you can expect to find on my site:</p>

        <h4>Admin Routes</h4>
        <p>I've included a secure login system that allows me to manage my site's content, including my blog posts and project listings. This means that I can easily add, edit, or delete content as needed, all while ensuring that my visitors only see the most up-to-date and accurate information.</p>
      
        <h4>Email Sending with SendGrid</h4>
        <p>I've integrated SendGrid into my site, which allows visitors to easily get in touch with me by filling out a quick and easy contact form. This ensures that I never miss an important message or opportunity, and that visitors can get the help and support they need as quickly as possible.</p>
      
        <h4>Server-Side Rendering (SSR)</h4>
        <p>I've used Next.js to build my site, which allows for server-side rendering of my blog and project pages. This means that visitors will experience faster page loads and better search engine optimization (SEO) for my content, which can help drive more traffic to my site and increase engagement.</p>
      
        <h4>My Tech Stack</h4>
        <p>To build my site, I used a combination of powerful technologies and frameworks, including:</p>
      
        <ul>
          <li>Next.js for building a fast, modern, and scalable SPA</li>
          <li>Redux and Redux Saga for state management and side effects</li>
          <li>Material UI (MUI) for building beautiful and responsive UI components</li>
          <li>SASS for styling and theming my site</li>
        </ul>
      
        <p>Each of these tools played a critical role in helping me build a site that's fast, reliable, and easy to use. Together, they create a seamless user experience that visitors are sure to love!</p>
        <h4>Deployment on Vercel</h4>
        <p>I deployed my site on Vercel, a cloud platform for static sites and serverless functions. This allowed me to easily deploy and manage my site without worrying about server management, scaling, or performance. With Vercel, my site is fast, reliable, and always up-to-date.</p>
        <h4>My Domain Name</h4>
        <p>I've also purchased a custom domain name for my site: https://www.anandkris.com. I registered this domain with GoDaddy, which allowed me to easily manage my domain registration, DNS settings, and other important details. This makes it easy for visitors to remember my site and find me online!</p>

        <p>Thank you for visiting My Portfolio SPA. I hope you enjoy exploring my work, and if you have any questions or comments, please feel free to use the contact form to get in touch with me!</p>
      `,
    techStack: [
      "Next.JS",
      "Typescript",
      "Redux",
      "Saga",
      "Material UI",
      "SCSS",
    ],
    showinportfolio: true,
  },
  {
    id: 6,
    title: "Portfolio Backend Application",
    date: "10 Dec, 2021 - 19 July, 2022",
    visitGithub: "https://github.com/Anand-Krishnan-M-J/portfolio-api",
    isPersonalProject: true,
    description:
      "My portfolio website's backend application was built using Node.js and Express.js for server-side functionality, and PostgreSQL as the database management system to store and retrieve data. I also used Docker for containerization, which helped to simplify the deployment process. The application is deployed on Amazon Web Services (AWS), which ensures reliability, scalability, and high availability. Overall, the backend application provides a robust and scalable architecture for handling the data and functionality of my portfolio website.",
    image: "/images/portfolio_BE.png",
    slug: "my_portfolio_website_backend",
    content: ` <p>This Express.js application serves as the backend for my Portfolio SPA, providing the necessary server-side functionality and database access to make my site run smoothly. Here are some of the key features that you can expect to find in my backend:</p>

        <h4>Node.js and Express.js</h4>
        <p>My backend is built using Node.js, a powerful and widely-used JavaScript runtime environment, and Express.js, a popular Node.js framework that allows me to easily manage routes, handle incoming requests, and send responses back to the client.</p>
      
        <h4>PostgreSQL Database</h4>
        <p>I've also integrated a PostgreSQL database into my backend, which allows me to store and retrieve data for my site's users, projects, and blog posts. What's more, the database is present in the same Docker container as my backend, making it even easier to manage and deploy the application. For local development, I use PGWeb, which is also installed inside the container.</p>
      
        <h4>Docker Containerization</h4>
        <p>To make my backend even more efficient and scalable, I've containerized it using Docker. This allows me to easily deploy and manage my application on a variety of different platforms and environments, while ensuring that everything stays secure and isolated from other applications.</p>
      
        <h4>Deployment on Heroku and AWS</h4>
        <p>I initially deployed my backend on Heroku's free tier, which allowed me to easily deploy, manage, and scale my application without worrying about server management or configuration. However, when the free tier was no longer available, I moved my application to AWS's free tier, which provides similar benefits and features for free.</p>
      `,
    techStack: ["Node.JS", "Express.JS", "Typescript", "Docker", "PostgreSQL"],
    showinportfolio: true,
  },
];
