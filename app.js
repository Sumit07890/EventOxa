// EventOxa UI General Interactive Logic

export function initApp() {
  // Mobile Hamburger Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = menuToggle.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.innerText = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
      }
    });

    // Close menu when clicking links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuToggle.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.innerText = 'menu';
        }
      });
    });
  }

  // Input micro-interactions
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('scale-[1.01]');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('scale-[1.01]');
    });
  });


  // Category Selection Toggle
  const categoryChips = document.querySelectorAll('.category-chip');
  let selectedCategory = 'Photography'; // Default selected category from HTML

  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => {
        c.classList.remove('border-primary-container', 'bg-primary-fixed/20');
        c.classList.add('border-outline-variant');
        const icon = c.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.classList.remove('text-primary');
          icon.classList.add('text-on-surface-variant');
        }
      });
      chip.classList.add('border-primary-container', 'bg-primary-fixed/20');
      chip.classList.remove('border-outline-variant');
      const icon = chip.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.classList.add('text-primary');
        icon.classList.remove('text-on-surface-variant');
      }
      selectedCategory = chip.dataset.category || chip.querySelector('.font-label-sm').innerText;
      document.getElementById('summary-category').innerText = selectedCategory;
    });
  });

  // Multi-step Form Navigation
  const steps = document.querySelectorAll('.form-step');
  const progressLine = document.getElementById('progress-line');
  const progressIndicators = document.querySelectorAll('.progress-indicator');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  let currentStep = 0;

  function updateForm() {
    steps.forEach((step, idx) => {
      if (idx === currentStep) {
        step.classList.remove('hidden');
      } else {
        step.classList.add('hidden');
      }
    });

    // Update progress bar
    if (progressLine) {
      const progressPercent = (currentStep / (steps.length - 1)) * 100;
      progressLine.style.width = `${progressPercent}%`;
    }

    // Update progress bubble steps
    progressIndicators.forEach((ind, idx) => {
      if (idx <= currentStep) {
        ind.classList.add('primary-gradient', 'text-white');
        ind.classList.remove('bg-white', 'border-outline-variant', 'text-outline');
      } else {
        ind.classList.remove('primary-gradient', 'text-white');
        ind.classList.add('bg-white', 'border-outline-variant', 'text-outline');
      }
    });

    // Update Button States
    if (currentStep === 0) {
      prevBtn.classList.add('invisible');
    } else {
      prevBtn.classList.remove('invisible');
    }

    if (currentStep === steps.length - 1) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      
      // Populate Summary step
      const fullName = document.getElementById('full-name').value || 'N/A';
      const emailAddr = document.getElementById('email-addr').value || 'N/A';
      const phoneNum = document.getElementById('phone-num').value || 'N/A';
      document.getElementById('summary-name').innerText = fullName;
      document.getElementById('summary-email').innerText = emailAddr;
      document.getElementById('summary-phone').innerText = phoneNum;
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  }

  if (nextBtn && prevBtn && submitBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Step 1 validation
      if (currentStep === 0) {
        const nameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email-addr');
        const phoneInput = document.getElementById('phone-num');
        if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
          alert('Please enter your name, email address, and phone number.');
          return;
        }
      }
      
      if (currentStep < steps.length - 1) {
        currentStep++;
        updateForm();
      }
    });

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 0) {
        currentStep--;
        updateForm();
      }
    });

    document.getElementById('vendor-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        type: 'vendor',
        name: document.getElementById('full-name').value.trim(),
        email: document.getElementById('email-addr').value.trim(),
        phone: document.getElementById('phone-num').value.trim(),
        category: selectedCategory
      };

      try {
        await fetch('https://script.google.com/macros/s/AKfycby71ocKU9Lug7KkzXZziUmG_VBdaPwSWxVe7t6m67SjnF8DWL0gvatytTb21zbtGhN2dw/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        alert('Congratulations! Your application has been submitted successfully.');
        e.target.reset();
        currentStep = 0;
        selectedCategory = 'Photography';
        updateForm();
      } catch {
        alert('Submission failed. Please check your internet connection and try again.');
      }
    });
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby71ocKU9Lug7KkzXZziUmG_VBdaPwSWxVe7t6m67SjnF8DWL0gvatytTb21zbtGhN2dw/exec';

  // Ask a Question
  const askBtn = document.getElementById('ask-btn');
  const askInput = document.getElementById('user-question');
  const askStatus = document.getElementById('ask-status');

  if (askBtn) {
    askBtn.addEventListener('click', async () => {
      const question = askInput.value.trim();
      if (!question) return;

      askBtn.disabled = true;
      askBtn.innerText = 'Sending...';

      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'question', question })
        });
        askInput.value = '';
        askStatus.innerText = '✅ Question submitted! We will answer it shortly.';
        askStatus.classList.remove('hidden', 'text-error');
        askStatus.classList.add('text-primary');
      } catch {
        askStatus.innerText = '❌ Failed to submit. Please try again.';
        askStatus.classList.remove('hidden', 'text-primary');
        askStatus.classList.add('text-error');
      }

      askBtn.disabled = false;
      askBtn.innerText = 'Submit';
    });
  }

  // Load approved Q&As from Google Sheets
  async function loadCommunityQnA() {
    const container = document.getElementById('community-qna');
    if (!container) return;

    try {
      const res = await fetch(APPS_SCRIPT_URL);
      const questions = await res.json();

      if (!questions.length) return;

      const heading = document.createElement('h3');
      heading.className = 'font-headline-md text-on-surface mt-8 mb-4';
      heading.innerText = 'Community Questions';
      container.appendChild(heading);

      questions.forEach(({ question, answer }) => {
        const card = document.createElement('div');
        card.className = 'glass-card rounded-2xl overflow-hidden text-left';
        card.innerHTML = `
          <button class="w-full flex items-center justify-between p-6 text-left"
            onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.arrow').classList.toggle('rotate-180')">
            <span class="font-headline-md text-on-surface">${question}</span>
            <span class="material-symbols-outlined arrow transition-transform duration-300">keyboard_arrow_down</span>
          </button>
          <div class="px-6 pb-6 text-on-surface-variant font-body-md hidden border-t border-outline-variant/20 pt-4">${answer}</div>
        `;
        container.appendChild(card);
      });
    } catch {
      // silently fail if sheet is empty or unreachable
    }
  }

  loadCommunityQnA();

  // Scroll Reveal Observer
  const observerOptions = {
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
    observer.observe(section);
  });
}
