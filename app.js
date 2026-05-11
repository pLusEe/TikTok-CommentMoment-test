const app = document.querySelector("#app");
const feed = document.querySelector("#feed");
const videos = Array.from(document.querySelectorAll("video"));
const screens = Array.from(document.querySelectorAll(".video-screen"));
const shareButton = document.querySelector("#shareButton");
const shareSheet = document.querySelector("#shareSheet");
const closeShare = document.querySelector("#closeShare");
const openComposer = document.querySelector("#openComposer");
const composer = document.querySelector("#composer");
const backToShare = document.querySelector("#backToShare");
const sendMoment = document.querySelector("#sendMoment");
const toast = document.querySelector("#toast");
const friendToggle = document.querySelector("#friendToggle");
const playToggle = document.querySelector("#playToggle");
const playIcon = document.querySelector("#playIcon");
const progressWrap = document.querySelector("#progressWrap");
const progressFill = document.querySelector("#progressFill");
const progressThumb = document.querySelector("#progressThumb");
const marker = document.querySelector("#momentMarker");
const bubble = document.querySelector("#momentBubble");
const bubbleEmoji = document.querySelector("#bubbleEmoji");
const bubbleCopy = document.querySelector("#bubbleCopy");
const emojiRow = document.querySelector("#emojiRow");
const commentInput = document.querySelector("#commentInput");
const longpressTip = document.querySelector("#longpressTip");

const state = {
  index: 0,
  duration: 20,
  progress: 0,
  paused: false,
  isFriendView: false,
  moment: {
    exists: false,
    videoIndex: 0,
    time: 7,
    emoji: "🥰",
    text: "就是这一秒笑死我了",
    seenOnce: false,
  },
  longPressTimer: null,
  bubbleTimer: null,
  pointerStart: null,
};

function activeVideo() {
  return videos[state.index];
}

function getDuration() {
  const duration = activeVideo()?.duration;
  return Number.isFinite(duration) && duration > 0 ? duration : state.duration;
}

function formatTime(seconds) {
  return `0:${String(Math.round(seconds)).padStart(2, "0")}`;
}

function setProgress(progress, syncVideo = true) {
  state.progress = Math.max(0, Math.min(1, progress));
  const percent = `${state.progress * 100}%`;
  progressFill.style.width = percent;
  progressThumb.style.left = percent;

  if (syncVideo && activeVideo()) {
    activeVideo().currentTime = state.progress * getDuration();
  }

  if (state.moment.exists && state.moment.videoIndex === state.index) {
    marker.style.setProperty("--x", `${(state.moment.time / getDuration()) * 100}%`);
  }

  maybeShowMoment();
}

function syncProgressFromVideo() {
  if (!activeVideo()) return;
  setProgress(activeVideo().currentTime / getDuration(), false);
}

function currentTime() {
  return state.progress * getDuration();
}

function setPaused(paused) {
  state.paused = paused;
  playIcon.textContent = paused ? "▶" : "Ⅱ";
  playToggle.classList.toggle("visible", paused);

  const video = activeVideo();
  if (!video) return;
  if (paused) {
    video.pause();
  } else {
    video.play().catch(() => {});
  }
}

function playActiveOnly() {
  videos.forEach((video, index) => {
    if (index === state.index && !state.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

function setActiveIndex(index) {
  state.index = Math.max(0, Math.min(screens.length - 1, index));
  feed.scrollTo({ top: state.index * feed.clientHeight, behavior: "smooth" });
  closePanels();
  playActiveOnly();
  syncProgressFromVideo();
  updateMarkerVisibility();
}

function updateActiveFromScroll() {
  const nextIndex = Math.round(feed.scrollTop / feed.clientHeight);
  if (nextIndex !== state.index) {
    state.index = Math.max(0, Math.min(screens.length - 1, nextIndex));
    playActiveOnly();
    syncProgressFromVideo();
    updateMarkerVisibility();
  }
}

function updateMarkerVisibility() {
  marker.classList.toggle("show", state.moment.exists && state.moment.videoIndex === state.index);
}

function openShareSheet() {
  shareSheet.classList.remove("hidden");
  composer.classList.add("hidden");
  setPaused(true);
}

function closePanels() {
  shareSheet.classList.add("hidden");
  composer.classList.add("hidden");
}

function openComposerSheet() {
  shareSheet.classList.add("hidden");
  composer.classList.remove("hidden");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.setTimeout(() => toast.classList.add("hidden"), 1300);
}

function saveMoment() {
  state.moment.exists = true;
  state.moment.videoIndex = state.index;
  state.moment.time = Math.round(currentTime());
  state.moment.emoji = emojiRow.querySelector(".active")?.textContent || "🥰";
  state.moment.text = commentInput.value.trim() || "就是这一秒笑死我了";
  state.moment.seenOnce = false;
  bubbleEmoji.textContent = state.moment.emoji;
  bubbleCopy.textContent = state.moment.text;
  marker.classList.add("show");
  marker.style.setProperty("--x", `${(state.moment.time / getDuration()) * 100}%`);
  composer.classList.add("hidden");
  showToast("已发送给 Jess");
  if (activeVideo()) {
    activeVideo().currentTime = Math.max(0, state.moment.time - 1.2);
  }
  setPaused(false);
}

function showMomentBubble(force = false) {
  if (!state.moment.exists || state.moment.videoIndex !== state.index) return;
  if (state.moment.seenOnce && !force) return;
  bubble.classList.remove("hidden");
  state.moment.seenOnce = true;
  window.clearTimeout(state.bubbleTimer);
  state.bubbleTimer = window.setTimeout(() => bubble.classList.add("hidden"), 3000);
}

function maybeShowMoment() {
  if (!state.isFriendView || !state.moment.exists || state.moment.videoIndex !== state.index) return;
  const delta = Math.abs(currentTime() - state.moment.time);
  if (delta < 0.35) showMomentBubble(false);
}

shareButton.addEventListener("click", openShareSheet);
closeShare.addEventListener("click", closePanels);
openComposer.addEventListener("click", openComposerSheet);
backToShare.addEventListener("click", () => {
  composer.classList.add("hidden");
  shareSheet.classList.remove("hidden");
});
sendMoment.addEventListener("click", saveMoment);

friendToggle.addEventListener("click", () => {
  state.isFriendView = !state.isFriendView;
  friendToggle.classList.toggle("active", state.isFriendView);
  friendToggle.textContent = state.isFriendView ? "我的视角" : "好友视角";
  showToast(state.isFriendView ? "好友视角：等待 Jess 的时刻评论" : "我的视角");
  if (state.isFriendView && state.moment.exists) {
    setActiveIndex(state.moment.videoIndex);
    if (activeVideo()) {
      activeVideo().currentTime = Math.max(0, state.moment.time - 1.2);
    }
    state.moment.seenOnce = false;
    setPaused(false);
  }
});

playToggle.addEventListener("click", () => setPaused(!state.paused));

emojiRow.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  emojiRow.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
});

marker.addEventListener("click", () => showMomentBubble(true));

progressWrap.addEventListener("pointerdown", (event) => {
  progressWrap.setPointerCapture(event.pointerId);
  progressWrap.classList.add("dragging");
  updateProgressFromEvent(event);
});

progressWrap.addEventListener("pointermove", (event) => {
  if (!progressWrap.classList.contains("dragging")) return;
  updateProgressFromEvent(event);
});

progressWrap.addEventListener("pointerup", (event) => {
  progressWrap.releasePointerCapture(event.pointerId);
  progressWrap.classList.remove("dragging");
  if (state.moment.exists && Math.abs(currentTime() - state.moment.time) < 1) {
    showMomentBubble(true);
  }
});

function updateProgressFromEvent(event) {
  const rect = progressWrap.getBoundingClientRect();
  setProgress((event.clientX - rect.left) / rect.width);
}

app.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, textarea, .sheet, .composer, .progress-wrap")) return;
  state.pointerStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  app.setPointerCapture(event.pointerId);
  state.longPressTimer = window.setTimeout(() => {
    setPaused(true);
    longpressTip.classList.remove("hidden");
    window.setTimeout(() => {
      longpressTip.classList.add("hidden");
      openComposerSheet();
    }, 700);
  }, 520);
});

app.addEventListener("pointermove", (event) => {
  if (!state.pointerStart) return;
  const dy = event.clientY - state.pointerStart.y;
  if (Math.abs(dy) > 12) {
    window.clearTimeout(state.longPressTimer);
  }
});

app.addEventListener("pointerup", (event) => {
  window.clearTimeout(state.longPressTimer);
  if (!state.pointerStart) return;
  app.releasePointerCapture(state.pointerStart.pointerId);
  const dy = event.clientY - state.pointerStart.y;
  if (Math.abs(dy) > 54) {
    setActiveIndex(state.index + (dy < 0 ? 1 : -1));
  }
  state.pointerStart = null;
});

app.addEventListener("pointercancel", () => {
  window.clearTimeout(state.longPressTimer);
  state.pointerStart = null;
});

feed.addEventListener("scroll", () => {
  closePanels();
  updateActiveFromScroll();
});

videos.forEach((video) => {
  video.addEventListener("loadedmetadata", syncProgressFromVideo);
  video.addEventListener("timeupdate", syncProgressFromVideo);
});

async function clearOldPrototypeCaches() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
}

clearOldPrototypeCaches().catch(() => {});
setProgress(0, false);
playActiveOnly();
