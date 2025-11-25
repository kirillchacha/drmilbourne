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
