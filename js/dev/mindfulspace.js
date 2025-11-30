import "./main.min.js";
import { g as getHash, d as dataMediaQueries, s as slideDown, a as setHash, b as slideUp, F as FLS } from "./common.min.js";
function tabs() {
  const tabs2 = document.querySelectorAll("[data-fls-tabs]");
  let tabsActiveHash = [];
  if (tabs2.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith("tab-")) {
      tabsActiveHash = hash.replace("tab-", "").split("-");
    }
    tabs2.forEach((tabsBlock, index) => {
      tabsBlock.classList.add("--tab-init");
      tabsBlock.setAttribute("data-fls-tabs-index", index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });
    let mdQueriesArray = dataMediaQueries(tabs2, "flsTabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach((tabsMediaItem) => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector("[data-fls-tabs-titles]");
      let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-title]");
      let tabsContent = tabsMediaItem.querySelector("[data-fls-tabs-body]");
      let tabsContentItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-item]");
      tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add("--tab-spoller");
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove("--tab-spoller");
        }
      });
    });
  }
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-titles]>*");
    let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-body]>*");
    const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector("[data-fls-tabs-titles]>.--tab-active");
      tabsActiveTitle ? tabsActiveTitle.classList.remove("--tab-active") : null;
    }
    if (tabsContent.length) {
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute("data-fls-tabs-title", "");
        tabsContentItem.setAttribute("data-fls-tabs-item", "");
        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add("--tab-active");
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains("--tab-active");
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-title]");
    let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-item]");
    const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
    function isTabsAnamate(tabsBlock2) {
      if (tabsBlock2.hasAttribute("data-fls-tabs-animate")) {
        return tabsBlock2.dataset.flsTabsAnimate > 0 ? Number(tabsBlock2.dataset.flsTabsAnimate) : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute("data-fls-tabs-hash");
      tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains("--tab-active")) {
          if (tabsBlockAnimate) {
            slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest(".popup")) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest("[data-fls-tabs-title]")) {
      const tabTitle = el.closest("[data-fls-tabs-title]");
      const tabsBlock = tabTitle.closest("[data-fls-tabs]");
      if (!tabTitle.classList.contains("--tab-active") && !tabsBlock.querySelector(".--slide")) {
        let tabActiveTitle = tabsBlock.querySelectorAll("[data-fls-tabs-title].--tab-active");
        tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock) : null;
        tabActiveTitle.length ? tabActiveTitle[0].classList.remove("--tab-active") : null;
        tabTitle.classList.add("--tab-active");
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
window.addEventListener("load", tabs);
(function() {
  const containers = document.querySelectorAll("[data-quotes]");
  if (!containers.length) return;
  containers.forEach((container) => {
    const items = Array.from(container.querySelectorAll("[data-quote-item]"));
    const wrapper = container.parentElement;
    const nextBtn = wrapper ? wrapper.querySelector("[data-quote-next]") : null;
    if (!items.length) return;
    if (items.length === 1) {
      items[0].classList.add("is-active");
      if (nextBtn) nextBtn.style.display = "none";
      return;
    }
    let current = 0;
    function showQuote(index) {
      items.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
      });
    }
    showQuote(current);
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        current = (current + 1) % items.length;
        showQuote(current);
      });
    }
  });
})();
const DARKLITE_STORAGE_KEY = "fls-user-theme";
function getHours() {
  const now = /* @__PURE__ */ new Date();
  const hours = now.getHours();
  return hours;
}
function darkliteInit() {
  const htmlBlock = document.documentElement;
  const switcher = document.querySelector("[data-fls-darklite]");
  if (!switcher) return;
  const buttons = Array.from(
    switcher.querySelectorAll(".theme-aside__item")
  );
  function detectInitialTheme() {
    const saved = localStorage.getItem(DARKLITE_STORAGE_KEY);
    if (saved) return saved;
    const timeEl = document.querySelector("[data-fls-darklite-time]");
    if (timeEl) {
      let customRange = timeEl.dataset.flsDarkliteTime || "18,5";
      const [fromStr, toStr] = customRange.split(",");
      const timeFrom = +fromStr;
      const timeTo = +toStr;
      const currentHour = getHours();
      const isDark = timeFrom <= timeTo ? currentHour >= timeFrom && currentHour <= timeTo : currentHour >= timeFrom || currentHour <= timeTo;
      return isDark ? "dark" : "light";
    }
    if (window.matchMedia) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return isDark ? "dark" : "light";
    }
    return "light";
  }
  function applyTheme(theme, { save = false } = {}) {
    htmlBlock.setAttribute("data-theme", theme);
    buttons.forEach((btn) => {
      const btnTheme = btn.dataset.theme;
      btn.classList.toggle(
        "theme-aside__item--active",
        btnTheme === theme
      );
    });
    if (save) {
      localStorage.setItem(DARKLITE_STORAGE_KEY, theme);
    }
  }
  const initialTheme = detectInitialTheme();
  applyTheme(initialTheme);
  if (window.matchMedia && !localStorage.getItem(DARKLITE_STORAGE_KEY)) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", (event) => {
      const newTheme = event.matches ? "dark" : "light";
      applyTheme(newTheme);
    });
  }
  switcher.addEventListener("click", (event) => {
    const target = event.target.closest(".theme-aside__item");
    if (!target) return;
    const theme = target.dataset.theme;
    if (!theme) return;
    applyTheme(theme, { save: true });
  });
  const resetButton = document.querySelector("[data-fls-darklite-reset]");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      localStorage.removeItem(DARKLITE_STORAGE_KEY);
      const autoTheme = detectInitialTheme();
      applyTheme(autoTheme, { save: false });
    });
  }
  FLS && FLS.log && FLS.log(`Darklite: активна тема "${initialTheme}"`);
}
window.addEventListener("load", darkliteInit);
document.addEventListener("DOMContentLoaded", function() {
  const widgets = document.querySelectorAll("[data-fls-thoughtjournal]");
  widgets.forEach(initThoughtJournal);
});
function initThoughtJournal(root) {
  const textarea = root.querySelector(".thoughtjournal__input");
  const saveBtn = root.querySelector(".thoughtjournal__thought-save");
  const clearBtn = root.querySelector(".thoughtjournal__thought-clear");
  if (!textarea || !saveBtn || !clearBtn) return;
  const keySuffix = root.dataset.journalKey || "default";
  const STORAGE_KEY = "fls_thought_journal_" + keySuffix;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved.length > 0) {
    textarea.value = saved;
  } else {
    textarea.value = "";
  }
  updateButtons();
  textarea.addEventListener("input", function() {
    updateButtons();
  });
  saveBtn.addEventListener("click", function() {
    const value = textarea.value.trim();
    if (!value) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
    }
    updateButtons();
  });
  clearBtn.addEventListener("click", function() {
    textarea.value = "";
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
    }
    updateButtons();
  });
  function updateButtons() {
    const current = textarea.value.trim();
    const saved2 = localStorage.getItem(STORAGE_KEY) || "";
    const hasText = current.length > 0;
    const isChanged = current !== saved2;
    saveBtn.disabled = !(hasText && isChanged);
    clearBtn.disabled = !(hasText || saved2.length > 0);
  }
}
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("[data-fls-moodtoday]").forEach(initMoodTodayWidget);
});
function initMoodTodayWidget(root) {
  const track = root.querySelector(".moodtoday__scrollbars-track");
  const range = root.querySelector(".moodtoday__scrollbars-range");
  const thumb = root.querySelector(".moodtoday__scrollbars-thumb");
  const thumbBlock = root.querySelector(".moodtoday__thumb-block");
  const smileEl = root.querySelector(".moodtoday__smille");
  const centerTextEl = root.querySelector(".moodtoday__text-center");
  const trackBarEl = root.querySelector(".moodtoday__track-emotion");
  if (!track || !range || !thumb || !thumbBlock || !smileEl || !centerTextEl || !trackBarEl) return;
  let value = 10;
  let dragging = false;
  const moods = [
    { min: 0, max: 20, label: "Very Low", emoji: "😔", color: "#6B52C9" },
    { min: 20, max: 40, label: "Low", emoji: "🙁", color: "#6B52C9" },
    { min: 40, max: 60, label: "Neutral", emoji: "😐", color: "#F2B01E" },
    { min: 60, max: 80, label: "Good", emoji: "🙂", color: "#4CAF50" },
    { min: 80, max: 101, label: "Great", emoji: "😄", color: "#4CAF50" }
  ];
  function clamp01(x) {
    return Math.max(0, Math.min(1, x));
  }
  function setFromClientX(clientX) {
    const rect = track.getBoundingClientRect();
    const ratio = clamp01((clientX - rect.left) / rect.width);
    value = ratio * 100;
    updateUI();
  }
  function getMoodForValue(v) {
    return moods.find((m) => v >= m.min && v < m.max) || moods[moods.length - 1];
  }
  function updateUI() {
    const percent = value;
    const mood = getMoodForValue(percent);
    range.style.width = percent + "%";
    thumbBlock.style.left = percent + "%";
    thumb.setAttribute("aria-valuenow", String(Math.round(percent)));
    centerTextEl.textContent = mood.label;
    centerTextEl.style.color = mood.color;
    smileEl.textContent = mood.emoji;
    smileEl.style.filter = `drop-shadow(0 0 20px ${mood.color}40)`;
    trackBarEl.style.width = percent + "%";
  }
  track.addEventListener("mousedown", function(e) {
    e.preventDefault();
    dragging = true;
    setFromClientX(e.clientX);
  });
  thumb.addEventListener("mousedown", function(e) {
    e.preventDefault();
    dragging = true;
  });
  document.addEventListener("mousemove", function(e) {
    if (!dragging) return;
    setFromClientX(e.clientX);
  });
  document.addEventListener("mouseup", function() {
    dragging = false;
  });
  track.addEventListener("touchstart", function(e) {
    const t = e.touches[0];
    if (!t) return;
    dragging = true;
    setFromClientX(t.clientX);
  }, { passive: true });
  thumb.addEventListener("touchstart", function(e) {
    dragging = true;
  }, { passive: true });
  document.addEventListener("touchmove", function(e) {
    if (!dragging) return;
    const t = e.touches[0];
    if (!t) return;
    setFromClientX(t.clientX);
  }, { passive: true });
  document.addEventListener("touchend", function() {
    dragging = false;
  });
  thumb.addEventListener("keydown", function(e) {
    const step = 5;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      value = Math.max(0, value - step);
      updateUI();
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      value = Math.min(100, value + step);
      updateUI();
    }
  });
  updateUI();
}
document.addEventListener("DOMContentLoaded", function() {
  const widgets = document.querySelectorAll("[data-fls-feeltoday]");
  widgets.forEach(initFeelToday);
});
function initFeelToday(root) {
  const itemButtons = root.querySelectorAll(".feeltoday__item-button");
  const feelingBox = root.querySelector(".feeltoday__feeling");
  const feelingSpan = root.querySelector(".feeltoday__feeling-item");
  if (!itemButtons.length || !feelingBox || !feelingSpan) return;
  feelingSpan.textContent = "";
  feelingBox.classList.remove("feeltoday__feeling--visible");
  itemButtons.forEach((button) => {
    button.addEventListener("click", function() {
      button.classList.toggle("feeltoday__item-button--active");
      updateFeeling();
    });
  });
  function updateFeeling() {
    const activeTextNodes = root.querySelectorAll(
      ".feeltoday__item-button--active .feeltoday__smille-text"
    );
    const labels = Array.from(activeTextNodes).map((el) => el.textContent.trim()).filter(Boolean);
    if (labels.length > 0) {
      feelingSpan.textContent = labels.join(", ");
      feelingBox.classList.add("feeltoday__feeling--visible");
    } else {
      feelingSpan.textContent = "";
      feelingBox.classList.remove("feeltoday__feeling--visible");
    }
  }
}
document.addEventListener("DOMContentLoaded", function() {
  const widgets = document.querySelectorAll("[data-fls-breathingpractice]");
  widgets.forEach(initBreathingPractice);
});
function initBreathingPractice(root) {
  const circleEl = root.querySelector(".breathingpractice__circle");
  const numberEl = root.querySelector(".breathingpractice__circle-number");
  const phaseTextEl = root.querySelector(".breathingpractice__circle-text");
  const startBtn = root.querySelector(".breathingpractice__button");
  const resetBtn = root.querySelector(".breathingpractice__button-reset");
  if (!circleEl || !numberEl || !phaseTextEl || !startBtn || !resetBtn) {
    return;
  }
  let startLabelEl = root.querySelector(".breathingpractice__button-label");
  if (!startLabelEl) {
    const svg = startBtn.querySelector("svg");
    const text = (startBtn.textContent || "Start").trim();
    startBtn.textContent = "";
    if (svg) {
      startBtn.appendChild(svg);
    }
    startLabelEl = document.createElement("span");
    startLabelEl.className = "breathingpractice__button-label";
    startLabelEl.textContent = text || "Start";
    startBtn.appendChild(startLabelEl);
  }
  const groups = root.querySelectorAll(".breathingpractice_colomn-structure");
  if (groups.length < 2) return;
  const durationButtons = Array.from(groups[0].querySelectorAll(".breathingpractice__settings-button"));
  const speedButtons = Array.from(groups[1].querySelectorAll(".breathingpractice__settings-button"));
  let isActive = false;
  let phase = "inhale";
  let durationMin = 3;
  let breathSpeed = 4;
  let seconds = breathSpeed;
  let intervalId = null;
  function getPhaseColor(p) {
    if (p === "inhale") return "#8B71EE";
    if (p === "hold") return "#F4A4BF";
    return "#6B52C9";
  }
  function updateUI() {
    const color = getPhaseColor(phase);
    numberEl.textContent = String(seconds);
    phaseTextEl.textContent = phase;
    circleEl.style.borderColor = color;
    circleEl.style.boxShadow = `0 0 30px ${color}40`;
    circleEl.style.background = `radial-gradient(circle, ${color}20, ${color}10)`;
    numberEl.style.color = color;
    const isBig = isActive && (phase === "inhale" || phase === "hold");
    circleEl.style.width = isBig ? "180px" : "140px";
    circleEl.style.height = isBig ? "180px" : "140px";
    if (isActive) {
      startLabelEl.textContent = "Pause";
      startBtn.classList.add("breathingpractice__button--paused");
    } else {
      startLabelEl.textContent = "Start";
      startBtn.classList.remove("breathingpractice__button--paused");
    }
    durationButtons.forEach((btn) => {
      const txt = btn.textContent.trim();
      const mins = parseInt(txt, 10);
      const isCurrent = mins === durationMin;
      btn.classList.toggle("breathingpractice__settings-button--active", isCurrent);
    });
    speedButtons.forEach((btn) => {
      const txt = btn.textContent.trim();
      const speed = parseInt(txt, 10);
      const isCurrent = speed === breathSpeed;
      btn.classList.toggle("breathingpractice__settings-button--active", isCurrent);
    });
  }
  function startTimer() {
    if (intervalId) return;
    intervalId = window.setInterval(function() {
      if (seconds <= 1) {
        if (phase === "inhale") {
          phase = "hold";
        } else if (phase === "hold") {
          phase = "exhale";
        } else {
          phase = "inhale";
        }
        seconds = breathSpeed;
      } else {
        seconds -= 1;
      }
      updateUI();
    }, 1e3);
  }
  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  function handleReset() {
    stopTimer();
    isActive = false;
    phase = "inhale";
    seconds = breathSpeed;
    updateUI();
  }
  startBtn.addEventListener("click", function() {
    isActive = !isActive;
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }
    updateUI();
  });
  resetBtn.addEventListener("click", handleReset);
  durationButtons.forEach((btn) => {
    btn.addEventListener("click", function() {
      const txt = btn.textContent.trim();
      const mins = parseInt(txt, 10);
      if (!isNaN(mins)) {
        durationMin = mins;
        updateUI();
      }
    });
  });
  speedButtons.forEach((btn) => {
    btn.addEventListener("click", function() {
      const txt = btn.textContent.trim();
      const speed = parseInt(txt, 10);
      if (!isNaN(speed)) {
        breathSpeed = speed;
        if (!isActive) {
          seconds = breathSpeed;
        }
        updateUI();
      }
    });
  });
  const activeDuration = durationButtons.find(
    (btn) => btn.classList.contains("breathingpractice__settings-button--active")
  );
  if (activeDuration) {
    const mins = parseInt(activeDuration.textContent.trim(), 10);
    if (!isNaN(mins)) durationMin = mins;
  }
  const activeSpeed = speedButtons.find(
    (btn) => btn.classList.contains("breathingpractice__settings-button--active")
  );
  if (activeSpeed) {
    const speed = parseInt(activeSpeed.textContent.trim(), 10);
    if (!isNaN(speed)) {
      breathSpeed = speed;
      seconds = speed;
    }
  }
  updateUI();
}
(() => {
  const asideBody = document.querySelector(".aside__body");
  const asideBurger = document.querySelector(".aside__burger");
  if (!asideBody || !asideBurger) return;
  function toggleAside() {
    const isOpen = asideBody.classList.toggle("aside__body--active");
    asideBurger.classList.toggle("aside__burger--close", isOpen);
    if (typeof bodyLockToggle === "function") {
      bodyLockToggle();
    }
  }
  asideBurger.addEventListener("click", (e) => {
    e.preventDefault();
    toggleAside();
  });
  document.addEventListener("click", (e) => {
    if (!asideBody.classList.contains("aside__body--active")) return;
    const isClickInsideAside = e.target.closest(".aside__body");
    const isClickOnBurger = e.target.closest(".aside__burger");
    if (!isClickInsideAside && !isClickOnBurger) {
      toggleAside();
    }
  });
})();
