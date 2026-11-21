/* Square locale switch. Icons from Tabler Icons, MIT (see LICENSE). */
(() => {
  const icons = {"world": "<svg class=\"nav-icon\" aria-hidden=\"true\" focusable=\"false\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" />\n  <path d=\"M3.6 9h16.8\" />\n  <path d=\"M3.6 15h16.8\" />\n  <path d=\"M11.5 3a17 17 0 0 0 0 18\" />\n  <path d=\"M12.5 3a17 17 0 0 1 0 18\" /></svg>", "chevron": "<svg class=\"nav-icon\" aria-hidden=\"true\" focusable=\"false\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6l6 -6\" /></svg>", "check": "<svg class=\"nav-icon\" aria-hidden=\"true\" focusable=\"false\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5l10 -10\" /></svg>"};
  let serial = 0;

  function attach(select, readName) {
    const group = document.createElement("span");
    group.className = "asq-picker";
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "asq-picker-trigger";
    trigger.setAttribute("aria-haspopup", "menu");
    const valueLabel = document.createElement("span");
    trigger.insertAdjacentHTML("beforeend", icons.world);
    trigger.append(valueLabel);
    trigger.insertAdjacentHTML("beforeend", icons.chevron);
    const menu = document.createElement("span");
    menu.className = "asq-picker-menu";
    menu.id = "asq-options-" + ++serial;
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    trigger.setAttribute("aria-controls", menu.id);
    trigger.setAttribute("aria-expanded", "false");
    const options = [...select.options].map(option => {
      const item = document.createElement("button");
      item.type = "button";
      item.tabIndex = -1;
      item.setAttribute("role", "menuitemradio");
      item.lang = option.lang;
      const caption = document.createElement("span");
      item.append(caption);
      item.insertAdjacentHTML("beforeend", icons.check);
      item.addEventListener("click", () => {
        close(true);
        if (select.value === option.value) return;
        select.value = option.value;
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
      });
      menu.append(item);
      return { option, item, caption };
    });

    function sync() {
      const selected = select.selectedOptions[0];
      const name = readName() || select.getAttribute("aria-label") || "Language";
      valueLabel.textContent = selected?.textContent || "";
      valueLabel.lang = selected?.lang || "";
      trigger.disabled = select.disabled;
      trigger.setAttribute("aria-label", name + " · " + valueLabel.textContent);
      menu.setAttribute("aria-label", name);
      for (const { option, item, caption } of options) {
        caption.textContent = option.textContent;
        item.setAttribute("aria-checked", String(option.selected));
        item.disabled = option.disabled;
      }
    }
    function open(target) {
      sync();
      menu.hidden = false;
      menu.dataset.side = "below";
      const rect = trigger.getBoundingClientRect();
      if (window.innerHeight - rect.bottom < menu.offsetHeight + 6 && rect.top > window.innerHeight - rect.bottom) {
        menu.dataset.side = "above";
      }
      trigger.setAttribute("aria-expanded", "true");
      const active = options.filter(row => !row.item.disabled);
      const choice = target === "first" ? active[0] : target === "last" ? active.at(-1) :
        active.find(row => row.option.selected) || active[0];
      choice?.item.focus({ preventScroll: true });
    }
    let prefix = "", typedAt = 0;
    function close(restore = false) {
      menu.hidden = true;
      prefix = "";
      trigger.setAttribute("aria-expanded", "false");
      if (restore) trigger.focus({preventScroll:true});
    }
    trigger.addEventListener("click", event => {
      event.preventDefault();
      if (menu.hidden) open(); else close(true);
    });
    trigger.addEventListener("keydown", event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        open(event.key === "ArrowDown" ? "first" : "last");
      }
    });
    menu.addEventListener("keydown", event => {
      const buttons = options.map(row=>row.item).filter(item=>!item.disabled);
      const index = buttons.indexOf(document.activeElement);
      if (event.key === "Escape") { event.preventDefault(); close(true); return; }
      if (event.key === "Tab") { close(true); return; }
      const steps = { ArrowDown:1, ArrowUp:-1 };
      if (event.key in steps || ["Home","End"].includes(event.key)) {
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length-1 :
          (index + steps[event.key] + buttons.length) % buttons.length;
        buttons[next]?.focus();
      } else if (event.key.length === 1 && event.key !== " " && !event.altKey && !event.ctrlKey && !event.metaKey) {
        const now=performance.now();
        prefix=(now-typedAt < 600 ? prefix : "") + event.key.toLocaleLowerCase();
        typedAt=now;
        buttons.find(item=>item.textContent.trim().toLocaleLowerCase().startsWith(prefix))?.focus();
      }
    });
    document.addEventListener("pointerdown", e=>{ if (!menu.hidden && !group.contains(e.target)) close(); });
    group.addEventListener("focusout", e=>{ if (!menu.hidden && !group.contains(e.relatedTarget)) close(); });
    select.addEventListener("change", sync);
    group.append(trigger, menu);
    select.after(group);
    select.hidden = true;
    select.dataset.asqNative = "";
    sync();
    return sync;
  }
  window.ASQLocale = Object.freeze({ attach });
})();

{
  const select = document.getElementById("interface-language");
  const sync = ASQLocale.attach(select, () => document.getElementById("asq-lang-name").textContent);
  new MutationObserver(sync).observe(select, {subtree:true,childList:true,characterData:true});
}
