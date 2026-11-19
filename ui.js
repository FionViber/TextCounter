(() => {
  "use strict";

  const textInput = document.getElementById("source");
  const languageSelect = document.getElementById("interface-language");
  const guide = document.getElementById("guide");
  const status = document.getElementById("status");
  const metricNodes = Array.from(document.querySelectorAll("[data-metric]"));
  const busyRegions = document.querySelectorAll("[aria-busy]");
  const labels = document.querySelectorAll("[data-text]");
  const localeKey = "fionviber-counter-locale";
  const english = {
    nav: "Page navigation",
    directory: "Project directory",
    placeholder: "Type or paste your text here.",
    counting: "Counting…",
    failed: "The count could not be completed. Edit the text to try again.",
    unavailable: "Unavailable",
    segmenterMissing: "Linguistic word and sentence counts require a browser with Intl.Segmenter support.",
  };
  for (const node of labels) english[node.dataset.text] = node.textContent;

  const translations = {
    "en-US": english,
    "zh-Hans": {
      directory: "项目目录",
      skip: "跳到文本输入框",
      nav: "页面导航",
      title: "字数统计",
      guide: "统计规则",
      intro: "比较同一段多语言文本在不同规则下的字数和字符数。",
      input: "文本",
      counts: "字数与词数",
      placeholder: "在此输入或粘贴文本。",
      wordCount: "字数（Word 兼容）",
      unicodeCount: "字数（Unicode 默认词界）",
      segmentedCount: "分词词数",
      details: "文本明细",
      graphemes: "字符数（Unicode 字素簇）",
      withSpaces: "字符数（Word 兼容，含空格）",
      withoutSpaces: "字符数（Word 兼容，不含空格）",
      han: "汉字数",
      sentences: "句子数",
      paragraphs: "段落数",
      lines: "文本行数",
      language: "界面语言",
      wordMethod: "Word 兼容字数与字符数",
      wordDefinition: "根据公开对照测试，近似复现桌面版 Microsoft Word 对纯文本的统计结果。例如，“peer-to-peer”计为一个词。两项字符数均按码点计数，略过制表符和换行符，再分别给出含空格和不含空格的结果。",
      defaultMethod: "Unicode 默认词界",
      defaultDefinition: "按 Unicode 18.0 标准附录第 29 号的默认规则划分文本，每个含字母或数字的片段计为一个词。汉字通常逐字划分。",
      segmentMethod: "分词词数",
      segmentDefinition: "按语言习惯划分词语，中文里的多个汉字可以合为一个词。数字也计入词数。“peer-to-peer”分为三个词。不同浏览器使用的语言数据可能影响结果。",
      unicodeMethod: "Unicode 字符数",
      unicodeDefinition: "按 Unicode 18.0 的规则，每个扩展字素簇计为一个字符。例如，带组合重音符的字母或一个家庭表情符号，都可由多个码点组成，各计一个字符。空格与显式换行也计入字符数，回车符和换行符连用时合计一个。",
      hanMethod: "汉字数",
      hanDefinition: "统计统一汉字、已分配的兼容汉字以及“〇”。中文、日文、韩文中使用的汉字均可计入。",
      structureMethod: "句子、段落与文本行",
      structureDefinition: "按句界划分后，含字母或数字的片段计为一句。回车、换行或段落分隔符分开段落，只统计有内容的段落。文本行按显式换行划分，包含中间和结尾的空行。输入框在屏幕上自动折行时，行数保持不变。",
      references: "参考资料",
      logicSource: "LogicUtil 字数对照测试",
      acrossSource: "Across 与 Word 的字数比较",
      unicodeSource: "Unicode 文本分段规则",
      counting: "正在统计…",
      failed: "未能完成统计。编辑文本后可重新计算。",
      unavailable: "不可用",
      segmenterMissing: "分词词数和句子数需要浏览器支持 Intl.Segmenter。",
    },
    "zh-Hant": {
      directory: "專案目錄",
      skip: "跳至文字輸入框",
      nav: "頁面導覽",
      title: "字數統計",
      guide: "統計規則",
      intro: "比較同一段多語言文字在不同規則下的字數和字元數。",
      input: "文字",
      counts: "字數與詞數",
      placeholder: "請在此輸入或貼上文字。",
      wordCount: "字數（Word 相容）",
      unicodeCount: "字數（Unicode 預設詞界）",
      segmentedCount: "斷詞詞數",
      details: "文字明細",
      graphemes: "字元數（Unicode 字素叢集）",
      withSpaces: "字元數（Word 相容，含空格）",
      withoutSpaces: "字元數（Word 相容，不含空格）",
      han: "漢字數",
      sentences: "句子數",
      paragraphs: "段落數",
      lines: "文字行數",
      language: "介面語言",
      wordMethod: "Word 相容字數與字元數",
      wordDefinition: "根據公開對照測試，近似重現桌面版 Microsoft Word 對純文字的統計結果。例如，「peer-to-peer」計為一個詞。兩項字元數皆依碼位計算，略過定位字元和換行字元，再分別列出含空格和不含空格的結果。",
      defaultMethod: "Unicode 預設詞界",
      defaultDefinition: "依 Unicode 18.0 標準附錄第 29 號的預設規則劃分文字，每個含字母或數字的片段計為一個詞。漢字通常逐字劃分。",
      segmentMethod: "斷詞詞數",
      segmentDefinition: "依語言習慣劃分詞語，中文裡的多個漢字可以合為一個詞。數字也計入詞數。「peer-to-peer」分成三個詞。不同瀏覽器使用的語言資料可能影響結果。",
      unicodeMethod: "Unicode 字元數",
      unicodeDefinition: "依 Unicode 18.0 的規則，每個擴展字素叢集計為一個字元。例如，帶組合重音符號的字母或一個家庭表情符號，都可由多個碼位組成，各計一個字元。空格與明確換行也計入字元數，歸位字元與換行字元連用時計為一個。",
      hanMethod: "漢字數",
      hanDefinition: "統計統一漢字、已指派的相容漢字，以及「〇」。中文、日文、韓文中使用的漢字均可計入。",
      structureMethod: "句子、段落與文字行",
      structureDefinition: "依句界劃分後，含字母或數字的片段計為一句。歸位、換行或段落分隔符號分開段落，只統計有內容的段落。文字行依明確換行劃分，包含中間和結尾的空行。輸入框在螢幕上自動折行時，行數維持不變。",
      references: "參考資料",
      logicSource: "LogicUtil 字數對照測試",
      acrossSource: "Across 與 Word 的字數比較",
      unicodeSource: "Unicode 文字分段規則",
      counting: "正在統計…",
      failed: "未能完成統計。編輯文字後可重新計算。",
      unavailable: "無法使用",
      segmenterMissing: "斷詞詞數和句子數需要瀏覽器支援 Intl.Segmenter。",
    },
  };

  let locale = "en-US";
  let numberFormat = new Intl.NumberFormat(locale);
  let results = null;
  let phase = "empty";
  let revision = 0;
  let pendingTimer;
  let announceTimer;
  let messageKey = "";

  function showMessage(key) {
    messageKey = key;
    status.textContent = key ? translations[locale][key] : "";
  }

  function renderMetrics() {
    for (const node of metricNodes) {
      const [group, key] = node.dataset.metric.split(".");
      const value = results?.[group]?.[key];
      if (phase === "empty") node.textContent = "0";
      else if (phase === "pending") node.textContent = "…";
      else if (Number.isFinite(value)) node.textContent = numberFormat.format(value);
      else node.textContent = translations[locale].unavailable;
    }
    for (const region of busyRegions) {
      region.setAttribute("aria-busy", String(phase === "pending"));
    }
  }

  function selectLanguage(value) {
    locale = Object.hasOwn(translations, value) ? value : "en-US";
    const messages = translations[locale];
    languageSelect.value = locale;
    document.documentElement.lang = locale;
    document.title = messages.title + " · FionViber";
    numberFormat = new Intl.NumberFormat(locale);
    for (const node of labels) node.textContent = messages[node.dataset.text];
    document.querySelector("nav").setAttribute("aria-label", messages.nav);
    textInput.placeholder = messages.placeholder;
    renderMetrics();
    showMessage(messageKey);
    updateDirectoryLink();
  }

  function updateDirectoryLink() {
    const directory = location.hostname.endsWith(".pages.dev")
      ? "https://fionviber.pages.dev/"
      : "https://fionviber.github.io/";
    const link = document.querySelector("[data-directory-link]");
    const label = document.querySelector("[data-directory-link-text]");
    if (link) link.href = directory;
    if (label) label.textContent = translations[locale].directory;
  }

  function scheduleCount() {
    const id = ++revision;
    clearTimeout(pendingTimer);
    clearTimeout(announceTimer);
    const text = textInput.value;
    results = null;
    phase = text.length ? "pending" : "empty";
    renderMetrics();
    showMessage("");
    if (phase === "empty") {
      window.CountEngine?.cancel?.();
      return;
    }

    announceTimer = setTimeout(() => showMessage("counting"), 250);
    pendingTimer = setTimeout(async () => {
      try {
        const next = await window.CountEngine.count(text);
        if (id !== revision) return;
        results = next;
        phase = "done";
        showMessage(next.unicode.words === null ? "segmenterMissing" : "");
      } catch {
        if (id !== revision) return;
        phase = "failed";
        showMessage("failed");
      }
      clearTimeout(announceTimer);
      renderMetrics();
    }, 65);
  }

  function updateNavigation() {
    const inGuide = location.hash === "#guide";
    if (inGuide) guide.open = true;
    for (const link of document.querySelectorAll("nav a")) {
      if (link.hash === (inGuide ? "#guide" : "#workspace")) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  }

  languageSelect.addEventListener("change", () => {
    selectLanguage(languageSelect.value);
    try { localStorage.setItem(localeKey, locale); } catch {}
  });
  document.querySelector('nav a[href="#guide"]').addEventListener("click", () => {
    guide.open = true;
  });
  window.addEventListener("hashchange", updateNavigation);
  textInput.addEventListener("input", scheduleCount);
  window.addEventListener("pageshow", scheduleCount);
  try { locale = localStorage.getItem(localeKey); } catch {}
  selectLanguage(locale);
  updateNavigation();
  scheduleCount();
})();
