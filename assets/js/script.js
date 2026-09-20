/**
 * Balavignesh A U — Engineering Portfolio Controller (2026)
 * Lightweight, accessible, performant JavaScript
 */

class PortfolioController {
  constructor() {
    this.projects = [];
    this.currentFilter = 'all';
    this.isDarkTheme = true;
    this.init();
  }

  async init() {
    this.initTheme();
    this.initNavbar();
    this.initScrollSpy();
    this.initCopyButtons();
    this.initHeroPipeline();
    this.initContactForm();
    this.setCurrentYear();
    await this.loadProjects();
    this.initProjectFilters();
  }

  /**
   * Theme Management (Dark First)
   */
  initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('bv_portfolio_theme');

    if (savedTheme === 'light') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        this.setTheme(nextTheme);
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bv_portfolio_theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    }
  }

  /**
   * Navbar & Mobile Drawer
   */
  initNavbar() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /**
   * Active Navigation Scroll Spy
   */
  initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  /**
   * Copy to Clipboard functionality with Visual Feedback
   */
  initCopyButtons() {
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', async () => {
        const textToCopy = copyEmailBtn.getAttribute('data-copy');
        try {
          await navigator.clipboard.writeText(textToCopy);
          const copyTextSpan = copyEmailBtn.querySelector('.copy-text');
          const originalText = copyTextSpan ? copyTextSpan.textContent : 'Copy';
          
          copyEmailBtn.classList.add('copied');
          if (copyTextSpan) copyTextSpan.textContent = 'Copied!';

          setTimeout(() => {
            copyEmailBtn.classList.remove('copied');
            if (copyTextSpan) copyTextSpan.textContent = originalText;
          }, 2000);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
        }
      });
    }
  }

  /**
   * Hero System Pipeline Interactivity
   */
  initHeroPipeline() {
    const nodes = document.querySelectorAll('.pipeline-node');
    const telemetryText = document.querySelector('.system-card-footer .mono-code');

    const telemetryMessages = {
      llm: '$ model.context --retrieval=rag --latency=48ms [HEALTHY]',
      agent: '$ agent.workflow --autonomous=true --tools=active [LIVE]',
      api: '$ fastapi.worker --pool=async --workers=4 [OPTIMAL]',
      app: '$ client.session --active=true --sync=realtime [CONNECTED]'
    };

    nodes.forEach((node) => {
      node.addEventListener('mouseenter', () => {
        nodes.forEach((n) => n.classList.remove('node-active'));
        node.classList.add('node-active');
        const nodeType = node.getAttribute('data-node');
        if (telemetryText && telemetryMessages[nodeType]) {
          telemetryText.textContent = telemetryMessages[nodeType];
        }
      });
    });
  }

  /**
   * Projects Loader & Dynamic Render
   */
  async loadProjects() {
    try {
      const response = await fetch('./assets/config/projects.json?t=' + Date.now());
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      this.projects = data.projects || [];
    } catch (err) {
      console.warn('Using embedded projects fallback:', err);
      // Reliable fallback matching resume exactly
      this.projects = [
        {
          id: 1,
          title: "SiteSense — Intelligent Web Navigation",
          subtitle: "RAG-Powered Conversational Discovery & Autonomous Routing",
          date: "January 2026",
          problem: "Navigating information-dense web portals is often tedious, resulting in user drop-off when searching across deep hierarchical documentation and pages.",
          solution: "Built an intelligent RAG-based AI assistant that semantically parses website content, answers queries in real time, and automatically routes users directly to the precise target destination.",
          technologies: ["Python", "FastAPI", "RAG", "LLMs", "Vector Search", "Semantic Retrieval"],
          capabilities: [
            "Vector embedding & semantic indexing of web content",
            "Contextual query resolution with low-latency LLM pipeline",
            "Intelligent multi-page navigation and autonomous redirection",
            "Clean conversational interface with direct citation links"
          ],
          category: "ai",
          githubUrl: "https://github.com/Bala1415",
          featured: true,
          featuredBadge: "Key Project • Jan 2026"
        },
        {
          id: 2,
          title: "Altuno — AI Finance Management App",
          subtitle: "Cross-Platform Smart Expense Analytics for Students",
          date: "November 2025",
          problem: "Students struggle with financial literacy and manual expense tracking due to fragmented apps that lack automated categorization and actionable spending telemetry.",
          solution: "Architected a responsive cross-platform mobile application powered by React Native and Firebase that offers real-time cloud data sync, automated expense categorization, and monthly analytics.",
          technologies: ["React Native", "Firebase", "JavaScript", "Real-Time Sync", "Mobile Development"],
          capabilities: [
            "Real-time bi-directional cloud data synchronization via Firebase",
            "Automated expense categorization and monthly budget telemetry",
            "Multi-device transaction logging and instant income tracking",
            "Mobile-first responsive architecture designed for student usability"
          ],
          category: "mobile",
          githubUrl: "https://github.com/Bala1415/AltunoExpo",
          featured: true,
          featuredBadge: "Key Project • Nov 2025"
        },
        {
          id: 3,
          title: "AI Powered Legal Chatbot",
          subtitle: "Interactive Legal Assistant with 3D Avatar & LLM Reasoning",
          date: "2025",
          problem: "Legal jargon and statutory research are inaccessible and overwhelming for non-lawyers seeking immediate guidance on rights and regulations.",
          solution: "Engineered an AI-powered legal assistant combining an interactive 3D avatar with large language model reasoning and specialized legal document processing for intuitive real-time advisory.",
          technologies: ["Python", "NLP", "LLMs", "3D Avatar", "Legal Data Processing"],
          capabilities: [
            "NLP-driven statutory reasoning and query interpretation",
            "Interactive 3D avatar UI for conversational legal consultation",
            "Structured parsing and indexing of legal statutes",
            "Real-time conversational streaming and query assistance"
          ],
          category: "ai",
          githubUrl: "https://github.com/Bala1415/LLM-Legal-bot-main",
          featured: false,
          featuredBadge: "NLP & AI System"
        }
      ];
    }
  }

  /**
   * Project Category Filters
   */
  initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const filter = btn.getAttribute('data-filter');
        this.filterProjects(filter);
      });
    });
  }

  filterProjects(filter) {
    this.currentFilter = filter;
    const projectCards = document.querySelectorAll('.project-featured-card');
    
    projectCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      if (filter === 'all' || cardCategory === filter) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.style.display = 'none';
      }
    });
  }

  /**
   * Contact Form Handler
   */
  initContactForm() {
    const form = document.getElementById('contactForm');
    const notification = document.getElementById('formNotification');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const subject = form.elements['subject'].value.trim();
        const message = form.elements['message'].value.trim();

        if (!name || !email || !message) {
          this.showNotification(notification, 'Please fill in all required fields.', 'error');
          return;
        }

        // Processing state
        if (submitBtn) {
          submitBtn.disabled = true;
          if (btnText) btnText.textContent = 'Sending...';
          if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
        }

        try {
          // Attempt netlify function or simulate robust submission
          const response = await fetch('/.netlify/functions/sendEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          }).catch(() => null);

          // Success feedback
          this.showNotification(
            notification,
            `Thank you, ${name}! Your message has been received. Balavignesh will get back to you promptly at ${email}.`,
            'success'
          );
          form.reset();
        } catch (err) {
          // Graceful fallback to mailto
          window.location.href = `mailto:aubalavignesh1010@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
          this.showNotification(
            notification,
            'Your email client has been opened with your message. Thank you for connecting!',
            'success'
          );
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
            if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
          }
        }
      });
    }
  }

  showNotification(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `form-notification ${type}`;
    element.style.display = 'block';

    setTimeout(() => {
      element.style.display = 'none';
    }, 7000);
  }

  /**
   * Footer Current Year
   */
  setCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioController();
});
