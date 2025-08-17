import type { Applicant } from '../types/caProgram'

export const ambassadors: readonly Applicant[] = [
  {
    id: 'Himanshu-Sahu',
    name: "Himanshu Sahu",
    college: "JECRC Foundation",
    experience: "My journey as a Campus Ambassador for MNIT Sphinx 2024 was truly rewarding. It enhanced my communication, leadership, and networking skills while giving me the chance to represent my institute on a larger platform.",
    image: "/CA/CA1.jpeg",
  },
  {
    id: 'Yash-Chavan',
    name: "Yash Chavan", 
    college: "BITS Pilani",
    experience: "Led impactful promotional activities for Sphinx’24, built strong connections with student communities, and collaborated with campus clubs to maximize fest visibility and participation.",
    image: "/CA/CA2.jpeg",
  },
  {
    id: 'neha',
    name: "Neha",
    college: "BITS Pilani", 
    experience: "Organized workshops and seminars, coordinated with multiple departments, and created engaging content for fest promotion.",
    image: "/image/human.webp",
  },
  {
    id: 'kartik-garg',
    name: "Kartik Garg",
    college: "VIT Vellore",
    experience: "Managed cross-college partnerships, developed promotional strategies, and facilitated participation from 15+ student societies.",
    image: "/image/human.webp",
  },
] as const