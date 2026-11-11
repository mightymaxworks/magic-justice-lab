export const wpuImage = {
  path: "/project-media/wpu-pickleball.webp",
  alt: "A pickleball player reaches for the ball on an outdoor court.",
  width: 828,
  height: 414,
} as const;

export const pages = {
  home: { path: "/", title: "MAGIC JusTICe Lab | Imagine Better Justice", description: "MAGIC JusTICe Lab: exploring AI, law and responsible innovation at Jigme Singye Wangchuck School of Law in Bhutan." },
  purpose: { path: "/our-purpose", title: "Our Purpose | MAGIC JusTICe Lab", description: "Explore the Lab’s approach to human-centred experimentation in law, governance and responsible technology." },
  labs: { path: "/innovation-labs", title: "Innovation Labs | MAGIC JusTICe Lab", description: "Explore AI, legal technology and governance research, the proposed Lab design, and the computing infrastructure provided by OurOwn." },
  projects: { path: "/projects", title: "Projects | MAGIC JusTICe Lab", description: "Explore how MAGIC JusTICe Lab reviews and shares its research projects and experiments." },
  wpu: { path: "/projects/wpu-living-laboratory", title: "The WPU Living Laboratory | MAGIC JusTICe Lab", description: "A proposed MAGIC JusTICe Lab case study on where AI can assist sports governance and where people should make the final decision." },
  challenges: { path: "/innovation-challenges", title: "Innovation Challenges | MAGIC JusTICe Lab", description: "Explore potential research challenges in accessible legal information, multilingual communication and accountable AI." },
  ideas: { path: "/magic-ideas", title: "MAGIC Ideas | MAGIC JusTICe Lab", description: "Learn about the Lab’s planned programme for sharing ideas for better justice." },
  insights: { path: "/insights-and-events", title: "Insights & Events | MAGIC JusTICe Lab", description: "Find information about future Lab workshops, research updates and publications." },
  collaborate: { path: "/collaborate", title: "Collaborate | MAGIC JusTICe Lab", description: "Explore potential ways to collaborate with the Lab through research, prototyping and institutional partnerships." },
} as const;

export type PageKey = keyof typeof pages;

export function pageForPath(path: string): PageKey | undefined {
  const normalized = path.replace(/\/$/, "") || "/";
  return (Object.keys(pages) as PageKey[]).find(key => pages[key].path === normalized);
}
