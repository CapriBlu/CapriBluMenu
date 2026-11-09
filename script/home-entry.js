(() => {
  const select = document.getElementById('home-language');
  const link = document.getElementById('discover-menu');
  if (!select || !link) return;
  const supported = ['it', 'en'];
  const copy = {
    it: {language:'Lingua', menu:'Scopri il nostro menu', slider:"L'anima di Capri Blu", actions:'Collegamenti utili', book:'Prenota con TheFork', review:'Lascia una recensione su Google', phrases:['Sorrento','Pizzeria & Trattoria Napoletana','Sapori Autentici','Cucina Mediterranea',"Un Agrumeto Tutto l'Anno"]},
    en: {language:'Language', menu:'Discover our menu', slider:'The soul of Capri Blu', actions:'Useful links', book:'Book with TheFork', review:'Leave a review on Google', phrases:['Sorrento','Neapolitan Pizzeria & Trattoria','Authentic Flavours','Mediterranean Cuisine','A Citrus Grove All Year Round']}
  };
  let saved;
  try { saved = localStorage.getItem('capriblu-menu-language'); } catch {}
  let language = [new URL(location.href).searchParams.get('lang'), saved, 'it'].find(value => supported.includes(value));
  function render() {
    const text = copy[language];
    document.documentElement.lang = language;
    select.value = language;
    document.getElementById('home-language-label').textContent = text.language;
    document.getElementById('discover-menu-label').textContent = text.menu;
    const target = new URL(link.href);
    target.searchParams.set('lang', language);
    link.href = target.href;
    const slider = document.querySelector('.brand-slider');
    if (slider) {
      slider.lang = language;
      slider.setAttribute('aria-label', text.slider);
      slider.querySelectorAll('.brand-slider-description li').forEach((phrase, index) => { phrase.textContent = text.phrases[index]; });
      slider.querySelectorAll('.brand-slider-phrase').forEach((phrase, index) => { phrase.textContent = text.phrases[index]; });
    }
    const actions = document.querySelector('.quick-buttons');
    if (actions) actions.setAttribute('aria-label', text.actions);
    const book = document.querySelector('.thefork-button img');
    const review = document.querySelector('.google-button img');
    if (book) book.alt = text.book;
    if (review) review.alt = text.review;
  }
  select.addEventListener('change', () => {
    language = select.value;
    try { localStorage.setItem('capriblu-menu-language', language); } catch {}
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url);
    render();
  });
  render();
})();
