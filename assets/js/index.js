// 目录和内容数据
const menuData = [
  {
    title: 'Design',
    items: [
      'Walefall Haven',
      'Rock N’ Role',
      'The Medusozian’s Dream',
      'Debomenon',
      'Babel of Lexicons',
      'Acephere',
      'Tales of Everlasting Symphony',
    ],
  },
  {
    title: 'Artwork',
    items: [
      'Take Me To Your Bad Dreams',
      'I Broke Time Machine',
      'Suffocating',
      'In Memory Of',
      'Portrait Series',
      'Early Morning in S.S. Rd',
    ],
  },
  {
    title: 'Essay',
    items: [
      'Dream is an Offshore Fire',
      'Some People, Some Place',
      'To Bloom After the Flood',
      'By Asking Why Anthropology',
      'An Obituary for a Pig',
    ],
  },
  {
    title: 'Poem',
    items: [
      '4-4-4-44',
      'A Confession',
      'Really Not Rhetoric',
      'Ishmael',
    ],
  },
];

const contentData = {};
menuData.forEach(section => {
  section.items.forEach(item => {
    // 针对画作测试项插入图片
    if (item === 'Suffocating') {
      contentData[item] = `
        <h2>${item}</h2>
        <div class="meta">Self portrait &nbsp;·&nbsp; 12'' x 16'' &nbsp;·&nbsp; <span class="date">28 November 2025</span></div>
        <img src="./assets/projects/Suffocating-1.png" alt="Suffocating">
        <div class="desc">A self-portrait exploring the feeling of suffocation in modern life. Mixed media on paper.</div>
      `;
    } else if (item === 'In Memory Of') {
      contentData[item] = `
        <h2>${item}</h2>
        <div class="meta">My Alfa Romeo &nbsp;·&nbsp; 12'' x 16'' &nbsp;·&nbsp; <span class="date">05 December 2025</span></div>
        <img src="./assets/projects/InMemoryOf-1.png" alt="In Memory Of">
        <div class="desc">A tribute to my beloved car, capturing nostalgia and memory. Watercolor on paper.</div>
      `;
    } else if (item === 'Dream is an Offshore Fire') {
      contentData[item] = `
        <h2>Dream is an Offshore Flame</h2>
        <div class="meta">Essay &nbsp;·&nbsp; <span class="date">2024</span></div>
        <pre class="desc">Rising from beneath the pillow, air floods into the nasal cavity and freezes. The alarm rings as I step out the door. Warming the car, brushing my eyebrows hair by hair; heat melts the frost on the windshield layer by layer. Deep breath, gear shift, release handbrake, turn signal to the right, wheels crunching black ice with sharp cracking sounds. The sky still dark, interstate traffic rushes forward, steel monsters glaring with white-pupil headlights.

— It’s alright.

Disposable gloves prepared beforehand as in the past for dissection labs, the lab coat slips on again, still fits perfectly. Shell midden tumbles onto a tray from a numbered cardboard box, dust and sand invade airways; eyes redden, nostrils itch. Large ceramic shards, stone tools, bivalves, gastropods, animal remains sorted one by one; dried marrow sponge-like, bird teeth entangled with fish bones, carbonised shells still showing fine spiral textures. _Why anthropology?_ Standing on the stone bridge in the drizzle smoking with my lecturer during the first week of classes. _Why not history or psychology?_ I don’t want to forever sit behind mountains of books, deducing supposedly objective explanations, nor control any environment ever again. I want to reconcile with objectivity, walk into the communities I study, touch the material I research. At that time, I looked at him; he narrowed his eyes and exhaled a smoke ring with interest — this slender thing, is it a dry twig or a bone? I took off my gloves.

Wind crossing the Antarctic Ocean guides hailstones to smash against the window; I hold the remaining unidentifiable fragments from the tray close to my nose and sniff. Shells smell of brine; bones of musk. The projection curtain undulates like a jellyfish, ambient frequencies pulse from the speakers. Talking about childhood wandering among different cities and groups as if doing fieldwork. Just fieldwork without purpose, I shrugged. He feigned seriousness - _perhaps you’ve always been on your way to becoming an anthropologist since childhood; you just didn’t know then._ I laughed, is your department struggling to spend its budget? _Our department,_ he corrected earnestly. Time flowed silently along the spiral textures. I entered a state of flow. Have I ever asked, what’s your favorite step when doing a jigsaw puzzle? “Finding the right piece,” that person once answered without hesitation.

It’s only three in the afternoon, half the sun sinks behind mountain peaks. Leaning by the window, writing the weekly reflection. Frost crawls through window cracks onto my arm, automatically writing about A’s graffiti project, writing about that last night in London when she, I, and Vonia carried four or five spray cans to the bridge arches. Too cold. The wind brings me back to that night; car parked outside, Wei suddenly said, _don’t wear this outfit, what if it gets spray paint?_ I lowered my head, marker stains washed faint; I said I’m cold, the only unpacked coat left is a thin blazer that can’t even be dry-cleaned. She offered to find me something else upstairs, though the car had already parked outside minutes ago. I grabbed my blazer and rushed out. When did it begin to turn cold? Early spring, midnight in London, Vonia, in just a shirt, draped her jacket around my shivering shoulders. And I would remember that night forever: the steaming miso soup gifted by a Japanese restaurant, the panicked flight chased by a homeless woman, the tactile warmth of Vonia’s jacket, A quietly waving outside the car window. Temperature dropped below zero, quiet and very quiet love sealed the window gaps.

“On the last day of April, a heavy snow fell as I left Munich.” Geese scattered overhead, screaming as they passed; I bent down to gaze at the frozen river. _Germany is like this._ He said a German word I couldn’t understand and then laughed: _unfortunately, you’re driving from one winter into another._ 

I divided the shell midden into sixteen parts, brushed the remaining dust and dirt into the final small box, labeled them, and placed the sixteen samples in the cabinet printed with my name. I divided the 2000-piece puzzle into sixteen sections, sorting by color, pattern, light, and brushstroke after laying the frame. Did I ever mention this is actually my favorite step? Categorising until it can no longer be subdivided, everything neat, uniform, transparent, completely visible. Archaeology cannot experiment with the past itself; what we study settled into dust long before time could be spoken. I plunge into the river of time, swimming upstream toward the beginning.

---

Written during the winter, 2024.</pre>
      `;
    } else {
      contentData[item] = `
        <h2>${item}</h2>
        <div class="meta">Essay &nbsp;·&nbsp; <span class="date">2024</span></div>
        <div class="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam nisl nunc euismod nisi. <br><br>Aliquam erat volutpat. Etiam vitae nisi sit amet lorem accumsan porta. Quisque ultricies, sapien nec laoreet placerat, enim est dictum augue, eu dictum enim sem eu orci.</div>
      `;
    }
  });
});

const menuEl = document.getElementById('menu');
const bookDoubleContainer = document.getElementById('book-double-container');
const bookLeft = document.getElementById('book-left');
const bookRight = document.getElementById('book-right');
const closeBtn = document.getElementById('close-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const contentEl = document.getElementById('content');

// 字号调节逻辑
const fontDecreaseBtn = document.getElementById('font-decrease');
const fontIncreaseBtn = document.getElementById('font-increase');
let currentFontSize = 18;
const minFontSize = 16;
const maxFontSize = 24;
function applyContentFontSize(size) {
  contentEl.style.fontSize = size + 'px';
  // 标题等比例缩放
  contentEl.querySelectorAll('h1').forEach(h => h.style.fontSize = (size * 2.2) + 'px');
  contentEl.querySelectorAll('h2').forEach(h => h.style.fontSize = (size * 1.5) + 'px');
  contentEl.querySelectorAll('h3').forEach(h => h.style.fontSize = (size * 1.2) + 'px');
  contentEl.querySelectorAll('.meta, .desc, pre.desc').forEach(e => e.style.fontSize = (size * 1.08 / 18) + 'em');
}
fontDecreaseBtn.onclick = () => {
  if (currentFontSize > minFontSize) {
    currentFontSize--;
    applyContentFontSize(currentFontSize);
  }
};
fontIncreaseBtn.onclick = () => {
  if (currentFontSize < maxFontSize) {
    currentFontSize++;
    applyContentFontSize(currentFontSize);
  }
};
// 内容切换时重置字号
function renderMenuSection(section, containerId) {
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'menu-section';
  const title = document.createElement('div');
  title.className = 'menu-title';
  title.textContent = section.title;
  sectionDiv.appendChild(title);
  const ul = document.createElement('ul');
  ul.className = 'menu-list';
  section.items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.textContent = item;
    li.onclick = () => openContent(item, li);
    ul.appendChild(li);
  });
  sectionDiv.appendChild(ul);
  document.getElementById(containerId).appendChild(sectionDiv);
}

function renderMenu3Col() {
  document.getElementById('menu-design').innerHTML = '';
  document.getElementById('menu-artwork').innerHTML = '';
  document.getElementById('menu-essay').innerHTML = '';
  document.getElementById('menu-poem').innerHTML = '';
  renderMenuSection(menuData[0], 'menu-design');
  renderMenuSection(menuData[1], 'menu-artwork');
  renderMenuSection(menuData[2], 'menu-essay');
  renderMenuSection(menuData[3], 'menu-poem');
}

function updateBookLeftTransform(open) {
  const outer = document.getElementById('book-double-outer');
  const bookLeft = document.getElementById('book-left');
  if (!open) {
    bookLeft.style.transform = '';
    return;
  }
  // 计算左页滑动距离 = (屏幕宽度/2 - A4宽度)
  const ww = outer.clientWidth;
  const dx = Math.max(0, ww / 2 - 794);
  bookLeft.style.transform = `translateX(-${dx}px)`;
}

function openContent(item, li) {
  document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
  if (li) li.classList.add('active');
  bookDoubleContainer.classList.add('open');
  updateBookLeftTransform(true);
  contentEl.innerHTML = contentData[item] || '<p>No content.</p>';
  applyContentFontSize(currentFontSize);
  // 仅图片内容时显示全屏按钮
  if (contentData[item] && contentData[item].includes('<img')) {
    fullscreenBtn.style.display = '';
  } else {
    fullscreenBtn.style.display = 'none';
  }
}

function closeBook() {
  bookDoubleContainer.classList.remove('open');
  updateBookLeftTransform(false);
  document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
}

function fullscreenContent() {
  bookRight.classList.toggle('fullscreen');
}

function fitBookToWindow() {
  const container = document.getElementById('book-double-container');
  const outer = document.getElementById('book-double-outer');
  const isOpen = container.classList.contains('open');
  // Strict A4 or A4+A4 size
  const bw = isOpen ? 1588 : 794;
  const bh = 1123;
  // Calculate scale to fit window, but always keep A4 ratio
  const ww = outer.clientWidth;
  const wh = outer.clientHeight;
  const scale = Math.min(ww / bw, wh / bh, 1);
  container.style.width = bw + 'px';
  container.style.height = bh + 'px';
  container.style.position = 'absolute';
  container.style.left = '50%';
  container.style.top = '50%';
  container.style.transformOrigin = 'center center';
  container.style.transform = `translate(-50%, -50%) scale(${scale})`;
  // 移除marginLeft/marginTop
  container.style.marginLeft = '';
  container.style.marginTop = '';
}
window.addEventListener('resize', () => {
  fitBookToWindow();
  updateBookLeftTransform(bookDoubleContainer.classList.contains('open'));
});
window.addEventListener('DOMContentLoaded', () => {
  fitBookToWindow();
  updateBookLeftTransform(bookDoubleContainer.classList.contains('open'));
});

closeBtn.onclick = closeBook;
fullscreenBtn.onclick = fullscreenContent;

// 初始只显示左页
bookDoubleContainer.classList.remove('open');
renderMenu3Col();

// --- 左侧menu-item点击逻辑 ---
document.querySelectorAll('.menu-item a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    // 高亮当前
    document.querySelectorAll('.menu-item a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    // 翻开书页（只有未翻开时才加open和动画）
    if (!bookDoubleContainer.classList.contains('open')) {
      bookDoubleContainer.classList.add('open');
      updateBookLeftTransform(true);
    }
    // 显示内容
    const key = this.getAttribute('data-content');
    contentEl.innerHTML = contentData[key] || '<p>No content.</p>';
    applyContentFontSize(currentFontSize);
    // 仅图片内容时显示全屏按钮
    if (contentData[key] && contentData[key].includes('<img')) {
      fullscreenBtn.style.display = '';
    } else {
      fullscreenBtn.style.display = 'none';
    }
  });
});
// --- END ---

// --- 桌面图标与窗口切换 ---
const icons = document.querySelectorAll('.desktop-icon');
const windows = [
  document.getElementById('window-1'),
  document.getElementById('book-double-outer'),
  document.getElementById('window-3')
];
const iconStates = [
  {
    norm: 'assets/icons/desktop-icons/Property 1=portfolio-norm.png',
    hover: 'assets/icons/desktop-icons/Property 1=portfolio-hover.png',
    selected: 'assets/icons/desktop-icons/Property 1=portfolio-selected.png'
  },
  {
    norm: 'assets/icons/desktop-icons/Property 1=file-norm.png',
    hover: 'assets/icons/desktop-icons/Property 1=file-hover.png',
    selected: 'assets/icons/desktop-icons/Property 1=file-selected.png'
  },
  {
    norm: 'assets/icons/desktop-icons/Property 1=terminal-norm.png',
    hover: 'assets/icons/desktop-icons/Property 1=terminal-hover.png',
    selected: 'assets/icons/desktop-icons/Property 1=terminal-selected.png'
  }
];
icons.forEach((icon, idx) => {
  icon.addEventListener('mouseenter', () => {
    if (!icon.classList.contains('selected')) icon.src = iconStates[idx].hover;
  });
  icon.addEventListener('mouseleave', () => {
    if (!icon.classList.contains('selected')) icon.src = iconStates[idx].norm;
  });
  icon.addEventListener('click', () => {
    icons.forEach((ic, i) => {
      ic.classList.toggle('selected', i === idx);
      ic.src = i === idx ? iconStates[i].selected : iconStates[i].norm;
      windows[i].style.display = i === idx ? 'block' : 'none';
    });
  });
});
// --- END ---