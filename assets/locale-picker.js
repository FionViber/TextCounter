(() => {
  const select = document.querySelector('#interface-language');
  if (!select || select.dataset.customPicker) return;
  select.dataset.customPicker = 'true';
  const label = select.closest('label');
  if (!label) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'locale-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<img src="assets/world.svg" alt=""><span></span><span aria-hidden="true">⌄</span>';
  const menu = document.createElement('div');
  menu.className = 'locale-menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;
  const options = [...select.options];
  const labels = new Map(options.map(option => [option.value, option.textContent]));
  for (const option of options) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'locale-option';
    item.setAttribute('role', 'option');
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    item.addEventListener('click', () => choose(option.value));
    menu.append(item);
  }
  select.hidden = true;
  label.append(button, menu);
  function sync() {
    button.querySelector('span').textContent = labels.get(select.value) || '';
    for (const item of menu.children) item.setAttribute('aria-selected', String(item.dataset.value === select.value));
  }
  function choose(value) {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.focus();
    sync();
  }
  button.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
  });
  document.addEventListener('click', event => {
    if (!label.contains(event.target)) { menu.hidden = true; button.setAttribute('aria-expanded', 'false'); }
  });
  button.addEventListener('keydown', event => {
    if (event.key === 'Escape') { menu.hidden = true; button.setAttribute('aria-expanded', 'false'); }
    if (event.key === 'ArrowDown') { event.preventDefault(); menu.hidden = false; menu.querySelector('.locale-option')?.focus(); }
  });
  sync();
})();
