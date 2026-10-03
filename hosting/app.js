const currencyButtons = [...document.querySelectorAll('[data-currency]')];

function setCurrency(currency) {
  document.documentElement.dataset.currency = currency;
  currencyButtons.forEach(button => {
    button.classList.toggle('selected', button.dataset.currency === currency);
  });
  document.querySelectorAll('[data-inr][data-usd]').forEach(item => {
    item.textContent = item.dataset[currency.toLowerCase()];
  });
}

currencyButtons.forEach(button => {
  button.addEventListener('click', () => setCurrency(button.dataset.currency));
});

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const opened = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();