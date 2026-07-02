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
  tagline: "Material Practice · Field Experience · Digital Narrative",
  bio:     "A researcher and artist working at the intersection of archaeology, anthropology, and experimental media. Current work sits at the edges of landscape, heritage, and memory politics, tracing the processual and relational conditions through which sites and institutions accumulate afterlives.",

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

  // ── Now page (quickly editable live status) ─────────────────────
  // Update these fields whenever you want to refresh the Now window.
  now: {
    updated: "April 2026",
    updatedAuto: false,
    by: "OL",
    status: "Writing thesis, writing, writing. Many years later, as he faced the firing squad, Colonel Aureliano Buend\u00eda was to remember that distant afternoon when his father took him to discover ice.",
    picture: "assets/now/IMG_6437.jpg",
    pictureAlt: "the historical assemblage April bought me w",
    focus: [
      "Reviewing the methodology chapter.",
      "Becoming a argillite expert.",
    ],
    devlog: [
      { date: "21 April 2026", text: "initial commit and framework on live." },
    ],
  },

  // ── Seacliff field map (GeoJSON interface for QGIS export) ──────
  // Recommended workflow:
  // 1) Export vector layers from QGIS as GeoJSON (EPSG:4326)
  // 2) Put files under assets/fieldmap/
  // 3) Update assets/fieldmap/seacliff.manifest.json
  fieldMap: {
    title: "Seacliff Field Notes Atlas",
    subtitle: "Dunedin → Tūrau Aruhe Seacliff → Waikouaiti",
    description: "Monthly field notes map with timeline, revisits, and layered paths.",
    projectId: "turau-aruhe-seacliff",
    defaultMonth: "2026-05",
    accumulateDefault: true,
    extent: {
      minLat: -45.93,
      maxLat: -45.55,
      minLon: 170.45,
      maxLon: 170.73,
    },
    source: {
      manifest: "assets/fieldmap/seacliff.manifest.json",
    },
  },

  // ── Guestbook ────────────────────────────────────────────────────
  // readUrl: public GET endpoint returning { entries: [...] }
  // writeUrl: POST endpoint accepting { name, mood, message, drawing? }
  guestbookSync: {
    readUrl:  "https://dark-credit-f2c8.erljuzz.workers.dev/guestbook",
    writeUrl: "https://dark-credit-f2c8.erljuzz.workers.dev/guestbook",
    pollMs:   12000,
  },

  // Shared realtime source for now/devlog edits.
  // Public read from rawUrl; admin writes through writeUrl backend.
  nowSync: {
    provider: "endpoint",
    rawUrl: "https://raw.githubusercontent.com/orpheelyre/orpheelyre.github.io/main/assets/now/now.live.json",
    // Example: "https://your-worker.your-subdomain.workers.dev/now-sync"
    writeUrl: "https://dark-credit-f2c8.erljuzz.workers.dev",
    pollMs: 15000,
  },

  // ── The Third Nature (ecological succession game) ────────────
  thirdNature: {
    title:   "the third nature.sys",
    file:    "projects/thirdnature.html?v=thirdnature-22",
    // Shared game state (visitors read; authorized edits write via Worker)
    stateUrl: "https://raw.githubusercontent.com/orpheelyre/orpheelyre.github.io/main/assets/nature/state.json",
    writeUrl: "https://dark-credit-f2c8.erljuzz.workers.dev",
  },

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
      id:       "offshore-flame",
      title:    "Dream is an Offshore Flame: Notes on Archaeology and Belonging",
      type:     "Journal Article",
      venue:    "Anthropology & Humanism",
      date:     "Feb 2026",
      url:      "https://doi.org/10.1111/anhu.70081",
      linkLabel: "Wiley",
      abstract: "Set within an archaeology lab in Dunedin, Aotearoa, this creative non-fiction piece traces the search for dwelling through the meticulous, repetitive labor of everyday practice. The narrative finds belonging not as a static identity, but as a continuous, tactile engagement with the material world. By drifting between winters in the Southern and Northern Hemispheres, the story weaves together the sorting of ancient middens with a memory of London's contested urban spaces—where a graffiti-covered bridge and a tented sanctuary challenge the boundaries between public architecture and private survival. Through this grounding of sensory reflections in the physical act of sorting, the work unfolds the broader human struggle to find permanence in a transient world, and suggests how the act of creating order from debris might serve as a universal strategy for re-rooting oneself within the river of time. Ultimately, the narrative transforms the intimate labor of an individual into a lens for exploring the ways we might find and inhabit a sense of belonging amidst the displacement and chilly isolation of modern life.",
    },
    {
      id:       "everywhere-border",
      title:    "Everywhere is a Border, Everywhere a Wall",
      type:     "Peer-reviewed Public Anthropology",
      venue:    "Allegra Lab",
      date:     "March 2026",
      url:      "https://allegralaboratory.net/everywhere-is-a-border-everywhere-a-wall/",
      linkLabel: "Allegra Lab",
      abstract: "1 April 2024, London. Written while shifting from one transient stay to another, sixteen days before a final departure. This fragment reflects on the tonal and stratified urban space, refusals of belonging, and the uneasy ethics of crossing thresholds without staying.",
    },
  ],

  // ── Conference Presentations ──────────────────────────────────────
  // Template: { title, venue, year, type, url }
  conferences: [
    {
      id:       "epistemology-dirt",
      title:    "The Epistemology of Dirt: A Paradoxical Method for an Anthropology of the Margins",
      venue:    "ASAA/NZ Conference",
      year:     "December 2025",
      type:     "Oral Presentation",
      url:      "https://static1.squarespace.com/static/563bdbb0e4b0b249b09076eb/t/69277b9c7a77366d4c4ba309/1764195228779/ASAANZ+Programme+BOOKLET+2025.pdf",
      linkLabel: "Programme Booklet",
      abstract: "This paper proposes \"being dirt\" as an embodied method of positionality that extends Mary Douglas's concept of dirt as \"matter out of place.\" Departing from dirt as a boundary-threatening pollutant, the \"dirt\" discussed here refers to a structurally tolerated presence — persistently misaligned yet not expelled, remaining within the system through default containment. \"Being dirt\" is not a metaphor but a lived positional condition. It exists adjacent to the centre but remains unassimilated, permitted to linger precisely because it is perceived as harmless, negligible, or residual. Drawing on neurodivergent and queer experiences, this paper argues that certain forms of unsolicited openness rather reflect institutional tolerance of non-belonging. From such marginal positions, individuals are often more attuned to the tensions and ruptures embedded within social and institutional structures — fissures often invisible to those securely positioned within normative belonging. Echoing Haraway's insight on the epistemic potential of peripheral vision, this paper argues that 'being dirt,' through its persistent misplacement and unintegrated presence, acts as a cognitive probe that pierces classificatory orders to expose structural fractures. Rather than a mode of resistance or identity, \"being dirt\" denotes a logic of unclassifiability, lingering, and repetitive erasure that nonetheless refuses disappearance. Its analytical value lies not in offering a universally replicable method but in revealing that anthropological inquiry is fundamentally located in moments and locations already rendered peripheral or marked for erasure.",
      keywords: ["Otherness", "Epistemology", "Embodied Positionality", "Methodology", "Margins"],
    },
    {
      id:       "unconstituted-seacliff",
      title:    "On the Verge of Constitution: Paperwork, Institutional Space, and the Unconstituted Landscape of the Former Seacliff Asylum",
      venue:    "AAA Annual Meeting 2026",
      year:     "November 2026 (forthcoming)",
      type:     "Accepted Individual Paper",
      url:      null,
      linkLabel: null,
      abstract: "On a clifftop above the Otago coast of Aotearoa, the remains of a former psychiatric institution persist in motion. Of its Scottish baronial architecture, only fragments remain. Former routes between wards, gardens, and services are taken back by undergrowth. A plaque marks thirty-seven unnamed women killed in the 1942 Ward 5 fire beside long-dried flowers. The ground has not settled into history; neither have the questions of what remains recognizable and what governance never reached.\n\nSeacliff Asylum operated from 1884 until 1973 on unstable Neogene sediment. Its constitutive project worked through spatial and documentary reductions: institutional space materialized order through wards, paddocks, gardens, and service infrastructures, while paperwork compressed lives and relations into records and categories. Yet centuries of Kāi Tahu naming, movement, and mahika kai practice were already sedimented before the asylum broke ground, and geological instability and ecological succession continued to rework the site after closure. Successive regimes of governance attempted to overwrite a landscape in process that kept exceeding them. These unfinished reductions persist as palimpsest.\n\nDrawing on a non-intrusive design that reads documentary and spatial records against field observations, this paper proposes palimpsest as the political structure produced by these successive reductions. Time, relation, and violence are folded into maps, archives, and ruins—material products of earlier governance that accumulate back into the landscape and become available for later interpretation, management, or further reduction. Within this recursive structure, Buchli and Lucas's \"unconstituted\" is reconceptualized beyond residual matter as a condition of broken relation: what remains materially present after the networks that once connected it have withdrawn. Seacliff thus speaks to a wider problem in the governance of institutional heritage landscapes. As documentary and spatial regimes lose the authority and labor that once held them together, they leave reductions without closure. There the unconstituted persists, and the political work of memory, recognition, and accountability remains unfinished.",
      keywords: ["Palimpsest", "The Unconstituted", "Institutional Heritage", "Paperwork", "Memory Politics"],
    },
    {
      id:       "lines-unsettled-turau-aruhe",
      title:    "Lines of the Unsettled: Tracing Relational Heritage in Processual Landscapes at Tūrau Aruhe Seacliff",
      venue:    "ACHS Conference 2026",
      year:     "December 2026 (forthcoming)",
      type:     "Accepted Individual Paper",
      url:      "https://www.achs2026.nz",
      linkLabel: "ACHS 2026 official site",
      abstract: "Heritage management in geomorphically unstable landscapes unfolds under conditions of persistent destabilisation. At Tūrau Aruhe, ecological succession, geological disturbance, and anthropogenic intervention continually rework the ground through which the former institution's afterlives are negotiated and encountered. Treating the landscape as a \"taskscape\" of movement, decay, and maintenance, this paper examines how such dynamics may strain heritage frameworks that rely on fixed references, investigating a potential friction between material reworking and curated narrative stability. In dialogue with the Tūrau Aruhe Seacliff initiative's emphasis on relational ethics and whakapapa, the analysis foregrounds non-intrusive methods and interpretive openness in examining a processual landscape. By triangulating LiDAR-derived terrain models, GNSS field observations, and archival representational sequences, the paper proposes a working framework that treats lines as an analytic device across three registers: material lines in the ground and infrastructure; narrative lines that render the site legible; and institutional reference lines that define heritage. Tracing where these lines align, diverge, or sever, the paper approaches heritage legibility as a relational accomplishment shaped by interdependencies between human and more-than-human agents, materials, whenua, institutional frames, and everyday practices. This analytical move from landscape-as-object to landscape-as-process offers one way to depart from singular, authoritative heritage narratives without presuming interpretive closure. By acknowledging the landscape as \"perpetually under construction,\" the paper asks how critical heritage studies might approach inherited dualisms as matters of ongoing alignment rather than fixed categories, taking instability as constitutive of place in response to the conference theme Tūhono. Tracing relations across the three registers, the paper considers what may be lost when interpretive accounts are prematurely stabilised, and asks how attending to such losses might open space for more relational ways of engaging processual landscapes.",
      keywords: ["Processual Landscapes", "Taskscape", "Relational Heritage", "Institutional Afterlives", "People-Environment Relations"],
    },
  ],

  // ── Projects ─────────────────────────────────────────────────────
  // category: "video-games" | "mr-experience" | "research" | "artwork"
  projects: [
    {
      id:          "whalefall-haven",
      title:       "Whalefall Haven",
      category:    "video-games",
      role:        "Project Manager · World-builder · UX & UI Designer",
      orgLine:     "Whaley Studio, Worldwide",
      description: "A narrative-driven space opera RPG where players shape their build, wield Mimic abilities, and make relationship-driven choices that alter reputation, fate, and story outcomes.",
      url:         "https://store.steampowered.com/app/3061230/Whalefall_Haven/",
      tags:        ["game design", "UX", "world-building", "narrative"],
      status:      "In Development",
      mdFile:      "projects/whalefall-haven.md",
    },
    {
      id:          "turau-aruhe-seacliff",
      title:       "Tracing Heritage Visibility at Tūrau Aruhe Seacliff",
      category:    "research",
      role:        "Honours Dissertation",
      orgLine:     "Supervised by Dr Natasha Phillips and Associate Professor Tim Thomas<br>Archaeology Programme, University of Otago, Aotearoa",
      description: "An archaeological research project investigating how heritage visibility is shaped by geological instability, ecological succession, and selective remembrance within a still-forming cultural landscape. Combining remote sensing, archival reconstruction, GIS, and field observation, it examines how traces persist, shift, disappear, and re-emerge over time.",
      url:         null,
      tags:        ["Critical Heritage Studies", "Contemporary Archaeology", "Landscape Archaeology"],
      status:      "In Progress",
      mdFile:      "projects/turau-aruhe-seacliff.md",
    },
    {
      id:          "urban-heritage-platform",
      title:       "Urban Heritage AR Exploration",
      category:    "mr-experience",
      role:        "Lead UX Designer · Research Collaborator",
      orgLine:     "Digital Heritage Lab, NYU Shanghai, China",
      description: "Interactive UX/UI flows for an urban heritage exploration platform in collaboration with academic and industry partners.",
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
    "Material Culture Studies",
    "Archival and Policy Review",
    "Archaeological Survey & Excavation",
    "Ethnographic Methods & Qualitative Research",
    "Academic Writing & Theory-Building",
    "UIUX Research & Design",
    "Interactive Cultural Storytelling",
  ],

  // ── cv.md password ───────────────────────────────────────────────
  // Change this to whatever you like. Visible in source — aesthetic feature only.
  cvPassword: "1453",

  // ── now.txt edit password ────────────────────────────────────────
  // Visible in source — lightweight lock for fun/admin gate.
  nowEditPassword: "6476",

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

window.SITE = SITE;
