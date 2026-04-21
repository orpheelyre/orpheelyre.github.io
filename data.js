// ═══════════════════════════════════════════════════════════════
//  data.js  —  All site content lives here
//
//  HOW TO ADD CONTENT:
//  • New publication  → push an object into SITE.publications
//  • New conference   → push into SITE.conferences
//  • New project      → push into SITE.projects
//                       category: "video-games"|"mr-experience"|"research"|"artwork"
//  • New experience   → push into SITE.experience
//  • Trash notes      → push a { date, text } object into SITE.trash
// ═══════════════════════════════════════════════════════════════

const SITE = {

  name:    "Orlan Y. Syshui",
  tagline: "Material Evidence · Field Experience · Digital Narrative",
  bio:     "Researcher and artist working at the intersection of archaeology, anthropology, and experimental media. Based at the University of Otago. Current work sits at the edges of landscape, heritage, medical anthropology, and memory politics, tracing the processual and relational conditions through which sites and institutions accumulate afterlives.",

  interests: [
    "Archaeological Theory",
    "Landscape Archaeology",
    "Digital Heritage",
    "Critical Heritage Studies",
    "Material Culture and Semiotics",
    "Embodiment and Medical Anthropology",
    "Critical Disability Studies",
  ],

  email: "orlan.syshui@gmail.com",

  // ── Social / external links (rendered as desktop icons) ─────────
  social: [
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/42inchestomars/",   icon: "camera"    },
    { id: "linkedin",  label: "LinkedIn",  url: "https://www.linkedin.com/in/42inchestomars/", icon: "briefcase" },
    { id: "itchio",    label: "itch.io",   url: "https://42inchestomars.itch.io",              icon: "gamepad"   },
  ],

  // ── Education ────────────────────────────────────────────────────
  education: [
    { degree: "BA(Hon) in Archaeology",                       institution: "University of Otago, NZ", period: "2026" },
    { degree: "DipGrad in Anthropology and Archaeology (HD)", institution: "University of Otago, NZ", period: "2024–2025"          },
    { degree: "BSc in Computer Science",                      institution: "University of Otago, NZ", period: "2016–2020"          },
    {
      degree:      "Homeschooling",
      institution: "Self-directed",
      period:      "2009–2014",
      note:        "Liberal education in natural science, literature, philosophy, semiotics, music theory, art and natural history; extensive independent reading; early unstructured field observation in varied cultural and social contexts.",
    },
  ],

  // ── Publications ─────────────────────────────────────────────────
  // Template: { title, type, venue, date, url }
  // type: "Journal Article" | "Public Anthropology" | etc.
  publications: [
    {
      title: "Dream is an Offshore Flame: Notes on Archaeology and Belonging",
      type:  "Journal Article",
      venue: "Anthropology & Humanism",
      date:  "2026",
      url:   "https://doi.org/10.1111/anhu.70081",
    },
    {
      title: "Everywhere is a Border, Everywhere a War",
      type:  "Public Anthropology",
      venue: "Allegra Lab",
      date:  "March 2026",
      url:   null,
    },
  ],

  // ── Conference Presentations ──────────────────────────────────────
  // Template: { title, venue, year, type, url }
  conferences: [
    {
      title: "The Epistemology of Dirt: A Paradoxical Method for an Anthropology of the Margins",
      venue: "ASAA/NZ Conference",
      year:  "December 2025",
      type:  "Oral Presentation",
      url:   null,
    },
  ],

  // ── Projects ─────────────────────────────────────────────────────
  // category: "video-games" | "mr-experience" | "research" | "artwork"
  projects: [
    {
      id:          "whalefall-haven",
      title:       "Whalefall Haven",
      category:    "video-games",
      role:        "Project Manager · World-builder · Lead UX Designer",
      description: "An immersive role-playing game featuring deep-sea world-building and narrative design.",
      url:         "https://store.steampowered.com/app/3061230/Whalefall_Haven/",
      tags:        ["game design", "UX", "world-building", "narrative"],
      status:      "In Development",
      mdFile:      "projects/whalefall-haven.md",
    },
    {
      id:          "urban-heritage-platform",
      title:       "Urban Heritage Exploration Platform",
      category:    "mr-experience",
      role:        "Lead UX Designer · Research Collaborator",
      description: "Interactive UX/UI flows for an urban heritage exploration platform in collaboration with academic and industry partners. Digital Heritage Lab, NYU Shanghai.",
      url:         null,
      tags:        ["UX/UI", "digital heritage", "interactive design"],
      status:      "Completed 2025",
      mdFile:      "projects/urban-heritage-platform.md",
    },
  ],

  // ── Experience ───────────────────────────────────────────────────
  experience: [
    {
      title:    "Project Manager, World-builder, Game & UX Designer",
      org:      "Whaley Studio",
      location: "Shanghai / New York",
      period:   "August 2023 – Present",
      bullets: [
        "Leading end-to-end UX design process: wireframes, UI elements, and design documentation for an immersive RPG.",
        "Collecting and analysing qualitative player feedback through user interviews and iterative testing sessions.",
        "Directing the narrative world-building.",
        "Managing collaborative timelines across a multidisciplinary team of artists, writers, and developers.",
      ],
    },
    {
      title:    "Lead UX Designer, Research Collaborator",
      org:      "Digital Heritage Lab, New York University (NYU) Shanghai",
      location: "Shanghai, China",
      period:   "May 2025 – September 2025",
      bullets: [
        "Designed and implemented UX/UI flows for an interactive urban heritage exploration platform.",
        "Applied game design principles to support cultural storytelling and audience engagement.",
        "Coordinated directly with developers to integrate design into functional prototypes.",
      ],
    },
    {
      title:    "Data Administrator",
      org:      "Wakari Hospital",
      location: "Dunedin, Aotearoa",
      period:   "November 2023 – February 2024",
      bullets: [
        "Entered confidential medical data into a government-secured system with high accuracy and confidentiality.",
        "Managed repetitive input tasks under time constraints without loss of quality.",
        "Maintained naming conventions and file structures consistently across departments.",
      ],
    },
  ],

  // ── Fieldwork & Lab Experience ───────────────────────────────────
  fieldExperience: [
    {
      title:    "Archaeology Lab Assistant (Volunteer)",
      org:      "Dept. of Social Anthropology and Archaeology, University of Otago",
      location: "Dunedin, Aotearoa",
      period:   "March – June 2025",
      bullets: [
        "Pre-processed archaeological samples for weighing and analysis.",
        "Conducted manual sorting and removal of contaminants to prepare clean subsamples.",
        "Ensured label and ID integrity across multi-phase analysis workflows.",
      ],
    },
  ],

  // ── Research Toolkit ─────────────────────────────────────────────
  skills: [
    "GIS and Spatial Analysis",
    "Material Analysis",
    "Archival and Policy Review",
    "Ethnographic Methods & Qualitative Research",
    "Academic Writing & Theory-Building",
    "UIUX Research & Design",
    "Interactive Cultural Storytelling",
    "Archaeological Survey & Excavation",
  ],

  // ── Hidden icons (appear in Bin, not on desktop) ─────────────────
  // Remove an id from this array and push to restore it to the desktop.
  hiddenIcons: ['cv'],

  // ── Trash ────────────────────────────────────────────────────────
  // Add short notes here — visitors can empty from their view.
  // Push new entries to show them again after someone empties.
  trash: [
    // { date: "Apr 2026", text: "example note" },
  ],
};
