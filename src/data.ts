export const profile = {
  name: 'Samyog Silwal',
  tag: 'BCT.EXE',
  role: 'Computer Engineering Student',
  school: 'Advanced College of Engineering and Management',
  bio: "HELLO WORLD. I'm Samyog, a Computer Engineering student at Advanced College of Engineering and Management, passionate about game development, cybersecurity, and building real-world projects.",
  hobbies: 'In my free time, I enjoy travelling, sketching, 3D modeling, and playing games.',
  links: {
    github: 'https://github.com/samyogsilwal61-svg',
    githubUsername: 'samyogsilwal61-svg',
    linkedin: 'https://www.linkedin.com/in/samyog-silwal-7b0850332/',
    youtube: 'https://www.youtube.com/@SIRS4G-001',
    // NOTE: placeholders — replace with your real TryHackMe / itch.io URLs
    tryhackme: 'https://tryhackme.com/p/samyogsilwal',
    itch: 'https://samyogsilwal.itch.io/',
  },
};

export type ProjectCategoryId = 'cybersecurity' | 'gamedev' | 'art' | 'realworld';

export interface ProjectItem {
  title: string;
  desc: string;
  tags: string[];
  link?: string;
}

export interface ProjectCategory {
  id: ProjectCategoryId;
  label: string;
  folderName: string;
  items: ProjectItem[];
}

// Kept empty on purpose for now — add project entries here as you build them.
export const projectCategories: ProjectCategory[] = [
  { id: 'cybersecurity', label: 'Cybersecurity', folderName: 'cybersecurity', items: [] },
  { id: 'gamedev', label: 'Game Development', folderName: 'gamedevelopment', items: [] },
  { id: 'art', label: 'Art', folderName: 'art', items: [] },
  { id: 'realworld', label: 'Real World', folderName: 'real_world', items: [] },
];

export interface ExperienceItem {
  role: string;
  company: string;
  years: string;
}

export const experience: ExperienceItem[] = [
  { role: 'Unity Game Development', company: 'College Project', years: '' },
];
