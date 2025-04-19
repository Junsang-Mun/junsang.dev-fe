<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Card from "$lib/components/Card.svelte";

    const experience = [
        {
            role: "Customer Experience Specialist",
            organization: "Business Canvas",
            period: "Nov 2021 - Apr 2022",
            description: [
                "Identified pain points in the customer journey and proposed actionable improvements.",
                "Collaborated with product and engineering teams to refine user flows and enhance customer satisfaction.",
                "Developed communication strategies to improve feedback collection and boost user retention.",
            ],
            // logo: "https://http.cat/404",
        },
        {
            role: "Freelance Designer",
            organization: "Remote",
            period: "2021 - Present",
            description: [
                "Focused on print design including posters, flyers, and business cards.",
                "When needed, also provided logo design and developed cohesive brand identities to ensure a consistent visual experience.",
                "Additionally, I took charge of the overall visual setup for event spaces, including layout and signage.",
            ],
            // logo: "https://http.cat/404",
        },
    ];

    const projects = [
        {
            name: "junsang.dev Personal Blog",
            description: "",
            techStack: "Svelte, Tailwind CSS",
            link: "https://junsang.dev",
        },
    ];

    const skills = {
        languages: ["JavaScript", "C", "C++"],
        frameworks: ["SvelteKit", "Node.js"],
        tools: ["Git", "Docker/Podman", "Linux"],
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
            description: [
                "Led community events including tech meetups, UbuCon Korea, and Ubuntu workshops.",
                "Actively promote open-source collaboration and represent the community in local and global initiatives.",
            ],
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
                    href="https://www.linkedin.com/in/준상-문-b567b027a"
                    class="text-cyan-500">LinkedIn</a
                >
                <!-- <a href="/resume.pdf" class="text-cyan-500">Resume PDF</a> -->
            </div>
        </section>

        <section class="mb-6">
            <h2 class="text-2xl font-bold mb-4 text-zinc-100">About Me</h2>
            <p class="text-zinc-100">
                I'm a curious developer who learns best by building and sharing.
                <br />
                I enjoy diving into full-stack development, DevOps, and open-source
                tools - especially when they help people collaborate better.
                <br />
                As a student at 42 Seoul and a representative of the Ubuntu Korea
                Community, I’m passionate about growing developer communities and
                creating spaces where people can learn from each other.
                <br />
                I believe the best tech is built together, not alone.
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
                    {#if Array.isArray(job.description)}
                        <ul class="list-disc pl-5 text-zinc-100">
                            {#each job.description as point}
                                <li>{point}</li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="text-zinc-100">{job.description}</p>
                    {/if}
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
                    {#if Array.isArray(vol.description)}
                        <ul class="list-disc pl-5 text-zinc-100">
                            {#each vol.description as point}
                                <li>{point}</li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="text-zinc-100">{vol.description}</p>
                    {/if}
                </div>
            {/each}
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

        <!-- <section class="mb-6">
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
        </section> -->

        <!-- <section class="mb-6">
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
        </section> -->
    </main>
    <Footer />
</div>
