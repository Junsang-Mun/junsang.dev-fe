<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Card from "$lib/components/Card.svelte";

    const experience = [
        {
            role: "Nogada master",
            organization: "ACME Corp",
            period: "Jan 2020 - Present",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            // logo: "https://http.cat/404",
        },
        {
            role: "Sensei",
            organization: "Kibotos",
            period: "Jun 2022 - Present",
            description: "Teaching students how to fight",
            // logo: "https://http.cat/404",
        },
        {
            role: "박사님",
            organization: "Rhodos Island",
            period: "Jun 2022 - Present",
            description: "Fighting against the originium infection",
            // logo: "https://http.cat/404",
        },
        {
            role: "꾜주니",
            organization: "엘리아스",
            period: "Jun 2022 - Present",
            description: "버터에게 밥을 챙겨주는 역할을 맡고 있습니다",
            // logo: "https://http.cat/404",
        },
    ];

    const projects = [
        {
            name: "Project 1",
            description: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsdfasdf",
            techStack: "Svelte, Tailwind CSS",
            link: "https://http.cat/404",
        },
        {
            name: "Project 2",
            description: "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfsdfasdf",
            techStack: "Svelte, Tailwind CSS",
            link: "https://http.cat/404",
        },
    ];

    const skills = {
        languages: ["JavaScript", "C", "C++"],
        frameworks: ["Svelte", "Node.js"],
        tools: ["Git", "Docker", "Linux"],
        softSkills: ["Teamwork", "Problem-solving", "Communication"],
    };

    const education = [
        {
            school: "42 Seoul",
            program: "Software Engineering",
            degree: "Member",
            dates: "2023 - Present",
            description: "Project-based learning at 42 Seoul.",
        },
    ];

    const certifications = [
        {
            name: "Certified House Keeping Agent",
            issuingBody: "Myself",
            date: "2020",
            link: "https://http.cat/503",
        },
    ];

    const talks = [
        {
            title: "My Awesome Talk",
            event: "수요지식회",
            date: "언제더라",
            link: "https://www.youtube.com/",
        },
    ];

    const volunteering = [
        {
            role: "Representative",
            organization: "Ubuntu Korea Community",
            dates: "2023 - Present",
            description:
                "Organized community events and meetups to promote open-source software.",
        },
    ];

    const posts = [
        {
            title: "Hello World",
            summary: "This is the first post on my new blog.",
            date: "10/10/2020",
            link: "/posts/hello-world",
        },
        {
            title: "My Second Post",
            summary: "This is the second post on my new blog.",
            date: "10/11/2020",
            link: "/posts/my-second-post",
        },
    ];
</script>

<div class="flex flex-col h-screen bg-zinc-900">
    <Header title="junsang.dev" />
    <main class="flex-1 overflow-y-auto container mx-auto p-4">
        <section class="mb-6">
            <h1 class="text-3xl font-bold mb-2 text-zinc-100">
                Hi, I'm Junsang Moon
            </h1>
            <p class="text-zinc-100">
                A curious developer and community builder.
            </p>
            <div class="flex space-x-4 mt-4">
                <a href="mailto:iam@junsang.dev" class="text-cyan-500">Email</a>
                <a href="https://github.com/Junsang-Mun" class="text-cyan-500"
                    >GitHub</a
                >
                <a
                    href="https://linked.in/aaaaaaaaaaaaaaaaa"
                    class="text-cyan-500">LinkedIn</a
                >
                <a href="/resume.pdf" class="text-cyan-500">Resume PDF</a>
            </div>
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">About Me</h2>
            <p class="text-zinc-100">
                I'm a sensei, teaching students how to fight. I'm also a nogada
                master.
            </p>
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">Experience</h2>
            {#each experience as job}
                <div class="mb-4">
                    {#if job.logo}
                        <img
                            src={job.logo}
                            alt={job.organization}
                            class="w-12 h-12 mb-2"
                        />
                    {/if}
                    <h3 class="text-xl font-bold text-zinc-100">{job.role}</h3>
                    <p class="text-zinc-100">
                        {job.organization} | {job.period}
                    </p>
                    <p class="text-zinc-100">{job.description}</p>
                </div>
            {/each}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">Projects</h2>
            {#each projects as project}
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-zinc-100">
                        {project.name}
                    </h3>
                    <p class="text-zinc-100">{project.description}</p>
                    <p class="text-zinc-100">Tech Stack: {project.techStack}</p>
                    <a href={project.link} class="text-cyan-500">View Project</a
                    >
                </div>
            {/each}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">Skills</h2>
            <div class="mb-4">
                <h3 class="text-xl font-bold text-zinc-100">Languages</h3>
                <p class="text-zinc-100">{skills.languages.join(", ")}</p>
            </div>
            <div class="mb-4">
                <h3 class="text-xl font-bold text-zinc-100">Frameworks</h3>
                <p class="text-zinc-100">{skills.frameworks.join(", ")}</p>
            </div>
            <div class="mb-4">
                <h3 class="text-xl font-bold text-zinc-100">Tools</h3>
                <p class="text-zinc-100">{skills.tools.join(", ")}</p>
            </div>
            <div class="mb-4">
                <h3 class="text-xl font-bold text-zinc-100">Soft Skills</h3>
                <p class="text-zinc-100">{skills.softSkills.join(", ")}</p>
            </div>
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">Education</h2>
            {#each education as edu}
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-zinc-100">
                        {edu.school}
                    </h3>
                    <p class="text-zinc-100">
                        {edu.program} | {edu.degree} | {edu.dates}
                    </p>
                    <p class="text-zinc-100">{edu.description}</p>
                </div>
            {/each}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">
                Certifications / Achievements
            </h2>
            {#each certifications as cert}
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-zinc-100">{cert.name}</h3>
                    <p class="text-zinc-100">
                        {cert.issuingBody} | {cert.date}
                    </p>
                    <a href={cert.link} class="text-cyan-500"
                        >View Certification</a
                    >
                </div>
            {/each}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">
                Talks / Presentations
            </h2>
            {#each talks as talk}
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-zinc-100">
                        {talk.title}
                    </h3>
                    <p class="text-zinc-100">{talk.event} | {talk.date}</p>
                    <a href={talk.link} class="text-cyan-500"
                        >View Presentation</a
                    >
                </div>
            {/each}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">
                Community & Volunteering
            </h2>
            {#each volunteering as vol}
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-zinc-100">{vol.role}</h3>
                    <p class="text-zinc-100">
                        {vol.organization} | {vol.dates}
                    </p>
                    <p class="text-zinc-100">{vol.description}</p>
                </div>
            {/each}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">Blog</h2>
            {#each posts as post}
                <Card
                    title={post.title}
                    summary={post.summary}
                    date={post.date}
                    link={post.link}
                    className="mb-4"
                />
            {/each}
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">Contact</h2>
            <a href="mailto:junsang@example.com" class="text-cyan-500"
                >Email Me</a
            >
            <div class="flex space-x-4 mt-4">
                <a href="https://github.com/junsangmoon" class="text-cyan-500"
                    >GitHub</a
                >
                <a
                    href="https://linkedin.com/in/junsangmoon"
                    class="text-cyan-500">LinkedIn</a
                >
            </div>
        </section>
    </main>
    <Footer />
</div>
