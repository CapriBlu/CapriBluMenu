export function visibleItems(catalog, editionId, categoryId) {
  return catalog.items.filter(item => item.editionIds.includes(editionId) && (!categoryId || item.categoryId === categoryId)).sort((a,b) => a.order-b.order);
}
export function selectedOffer(item, variantId) {
  return item.variants.find(variant => variant.id === variantId) || item;
}
export function translatedItem(locales, language, fallback, id) {
  const base = locales[fallback]?.items[id] || {};
  return {...base, ...locales[language]?.items[id]};
}
export function validateMenu(config, catalog, editions, locales) {
  const errors = [];
  const fail = (test, message) => {if(!test) errors.push(message);};
  const idOK = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  const priceOK = value => Number.isSafeInteger(value) && value >= 0;
  const unique = values => new Set(values).size === values.length;
  const codesOK = codes => codes === null || (Array.isArray(codes) && unique(codes) && codes.every(code => Number.isInteger(code) && code >= 1 && code <= 14));
  const fileOK = (value, kind) => {
    if (value === null) return true;
    if (typeof value !== 'string') return false;
    const parts = value.split('/');
    return parts.length === 3 && categoryIds.includes(parts[0]) && parts[1] === kind &&
      !parts[2].includes('..') && /^[a-z0-9][a-z0-9.-]*\.(webp|avif|jpg|jpeg|png)$/.test(parts[2]);
  };
  fail(config.schemaVersion === 2 && catalog.schemaVersion === 2, 'Unsupported schema version');
  fail(config.enabledLanguages.includes(config.defaultLanguage) && config.enabledLanguages.includes(config.fallbackLanguage), 'Default/fallback language must be enabled');
  fail(unique(config.enabledLanguages), 'Duplicate language');
  const categoryIds = catalog.categories.map(category => category.id);
  const editionIds = editions.editions.map(edition => edition.id);
  const supplementIds = catalog.supplements.map(supplement => supplement.id);
  fail(unique(categoryIds) && categoryIds.every(idOK), 'Invalid/duplicate category IDs');
  fail(unique(editionIds) && editionIds.every(idOK), 'Invalid/duplicate edition IDs');
  fail(unique(supplementIds) && supplementIds.every(idOK), 'Invalid/duplicate supplement IDs');
  fail(editionIds.includes(config.activeEdition), 'Active edition does not exist');
  fail(unique(catalog.items.map(item=>item.id)), 'Duplicate item ID');
  for (const edition of editions.editions) fail(priceOK(edition.coverChargeCents), `Invalid cover charge: ${edition.id}`);
  const checkOffer = (offer, key) => {
    fail(priceOK(offer.priceCents), `Invalid price: ${key}`);
    fail(typeof offer.available === 'boolean', `Invalid availability: ${key}`);
    fail(codesOK(offer.allergenCodes), `Invalid allergen codes: ${key}`);
    fail(['pending-review','verified'].includes(offer.allergenStatus), `Invalid allergen review: ${key}`);
    fail(offer.allergenStatus !== 'verified' || (Array.isArray(offer.allergenCodes) && catalog.allergenLegend.status === 'verified'), `Allergens cannot be verified without a verified legend: ${key}`);
    fail(Number.isInteger(offer.source?.page) && offer.source.page > 0 && /^pdf\/[a-zA-Z0-9_-]+\.pdf$/.test(offer.source?.pdf), `Missing source page: ${key}`);
  };
  for (const item of catalog.items) {
    fail(idOK(item.id), `Invalid item ID: ${item.id}`);
    fail(categoryIds.includes(item.categoryId), `Unknown category: ${item.id}`);
    fail(item.editionIds.length > 0 && item.editionIds.every(id=>editionIds.includes(id)), `Unknown edition: ${item.id}`);
    fail(item.supplementIds.every(id=>supplementIds.includes(id)), `Unknown supplement: ${item.id}`);
    fail(fileOK(item.thumbnail, 'thumbnails') && fileOK(item.image, 'full'), `Invalid image path: ${item.id}`);
    fail(Number.isInteger(item.order) && item.order>=0, `Invalid order: ${item.id}`);
    checkOffer(item,item.id);
    fail(unique(item.variants.map(variant=>variant.id)), `Duplicate variant: ${item.id}`);
    for (const variant of item.variants) {fail(idOK(variant.id), `Invalid variant: ${item.id}`);checkOffer(variant,`${item.id}/${variant.id}`);}
  }
  for (const supplement of catalog.supplements) checkOffer(supplement, supplement.id);
  for (const language of config.enabledLanguages) {
    const locale = locales[language];
    fail(locale?.language === language, `Missing locale: ${language}`);
    if (!locale) continue;
    for (const key of ['menu','preview','season','intro','previewNote','details','formats','standard','allergensPending','pdf','coverCharge','perPerson','frozen','error','retry','unavailable','loading','language','back','close','itemCount']) fail(typeof locale.ui?.[key] === 'string' && locale.ui[key].trim().length > 0, `Missing interface text: ${language}/${key}`);
    for (const id of categoryIds) fail(Boolean(locale.categories?.[id]),`Missing category translation: ${language}/${id}`);
    for (const item of catalog.items) {
      fail(Boolean(locale.items?.[item.id]?.name && locale.items?.[item.id]?.description), `Missing item translation: ${language}/${item.id}`);
      for (const variant of item.variants) fail(Boolean(locale.variants?.[variant.id]), `Missing variant translation: ${language}/${variant.id}`);
    }
    for(const edition of editionIds) fail(Boolean(locale.editions?.[edition]), `Missing edition translation: ${language}/${edition}`);
    for(const supplement of supplementIds) fail(Boolean(locale.supplements?.[supplement]), `Missing supplement translation: ${language}/${supplement}`);
  }
  return errors;
}
