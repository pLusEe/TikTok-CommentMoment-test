import { useEffect, useMemo, useRef, useState } from "react";

const videoChicks = new URL("../assets/video-chicks.mp4", import.meta.url).href;
const videoCreator = new URL("../assets/video-creator.mp4", import.meta.url).href;
const videoThird = new URL("../assets/video-third.mp4", import.meta.url).href;
const feedChicks = new URL("../assets/feed-chicks.jpg", import.meta.url).href;
const feedCreator = new URL("../assets/feed-creator.jpg", import.meta.url).href;
const posterDonkey = new URL("../assets/poster-donkey.jpg", import.meta.url).href;
const posterChicksFrame = new URL("../assets/poster-chicks-frame.jpg", import.meta.url).href;
const posterCreatorFrame = new URL("../assets/poster-creator-frame.jpg", import.meta.url).href;
const posterThirdFrame = new URL("../assets/poster-third-frame.jpg", import.meta.url).href;

const statusBar = new URL("../assets/ui-kit/Status Bar.svg", import.meta.url).href;
const likeIcon = new URL("../assets/ui-kit/Like.svg", import.meta.url).href;
const commentIcon = new URL("../assets/ui-kit/Comment.svg", import.meta.url).href;
const favoriteIcon = new URL("../assets/ui-kit/Favorite.svg", import.meta.url).href;
const shareIcon = new URL("../assets/ui-kit/Share.svg", import.meta.url).href;
const plusNav = new URL("../assets/ui-kit/navbar_item.svg", import.meta.url).href;
const friendsNav = new URL("../assets/ui-kit/Frame 38.svg", import.meta.url).href;
const homeNav = new URL("../assets/ui-kit/Frame 39.svg", import.meta.url).href;
const inboxNav = new URL("../assets/ui-kit/Frame 40.svg", import.meta.url).href;
const profileNav = new URL("../assets/ui-kit/Frame 41.svg", import.meta.url).href;
const searchIcon = new URL("../assets/ui-kit/search.png", import.meta.url).href;
const searchBlackIcon = new URL("../assets/ui-kit/search-black.svg", import.meta.url).href;
const liveIcon = new URL("../assets/ui-kit/live.png", import.meta.url).href;
const janeAvatar = new URL("../assets/ui-kit/jane.png", import.meta.url).href;
const shareSheetSvg = new URL("../assets/ui-kit/发送给.svg", import.meta.url).href;
const selectedShareSheetSvg = new URL("../assets/ui-kit/发送给-选中头像.svg", import.meta.url).href;

const FEED_ITEMS = [
  {
    src: videoChicks,
    poster: posterChicksFrame,
    preview: posterChicksFrame,
    author: "Aaron Videos",
    handle: "@aarons.videoss",
    caption: "在纽约偶遇小鸡 🐥 #nyc #newyorkcity #babychicks ⋯ 查看原内容",
    avatar: feedChicks,
    avatarFallback: "A",
    avatarColor: "#1f7a42",
    likes: "225.1万",
    comments: "1.7万",
    favorites: "10.3万",
    shares: "86.7万",
  },
  {
    src: videoCreator,
    poster: posterCreatorFrame,
    preview: posterCreatorFrame,
    author: "Sophia",
    handle: "@sophia.daily",
    caption: "可爱的小毛驴 #donkey ⋯ 查看原内容",
    avatar: posterDonkey,
    avatarFallback: "S",
    avatarColor: "#6450d8",
    likes: "7.2万",
    comments: "613",
    favorites: "3791",
    shares: "3.1万",
  },
  {
    src: videoThird,
    poster: posterThirdFrame,
    preview: posterThirdFrame,
    author: "Mika Lens",
    handle: "@mika.lens",
    caption: "今天这一幕太像电影了 #citywalk #dailyvlog ⋯ 查看原内容",
    avatar: feedCreator,
    avatarFallback: "M",
    avatarColor: "#c45f35",
    likes: "18.6万",
    comments: "2482",
    favorites: "1.2万",
    shares: "4.8万",
  },
];

const EMOJIS = ["😂", "👍", "😍", "😮", "🥹", "🙏"];
const PEOPLE = [
  { avatar: "J", name: "jiayiwang57", suffix: "8", online: true },
  { avatar: "S", name: "Susy" },
  { avatar: "D", name: "Dean Baas", photo: posterDonkey },
  { avatar: "A", name: "aan600" },
  { avatar: "S", name: "Samigurl27", photo: feedCreator },
  { avatar: "+", name: "邀请好友聊", add: true },
];

const HOME_FEED_INDICES = [2, 0];

const DEFAULT_MOMENTS = [
  {
    id: "jane-donkey",
    videoIndex: 1,
    time: 4,
    author: "jane",
    avatar: janeAvatar,
    fallback: "J",
    text: "这只驴有一点像你啊😀😀",
    seenOnce: false,
  },
  {
    id: "jane-third",
    videoIndex: 2,
    time: 6,
    author: "jane",
    avatar: janeAvatar,
    fallback: "J",
    text: "bro还有一把枪",
    seenOnce: false,
  },
];

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds || 0));
  return `0:${String(safe).padStart(2, "0")}`;
}

function formatScrubTime(seconds) {
  const safe = Math.max(0, Math.round(seconds || 0));
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getHomeFeedNeighbor(index, direction) {
  const currentPosition = HOME_FEED_INDICES.indexOf(index);
  if (currentPosition >= 0) {
    return HOME_FEED_INDICES[
      (currentPosition + direction + HOME_FEED_INDICES.length) % HOME_FEED_INDICES.length
    ];
  }

  if (direction > 0) {
    return HOME_FEED_INDICES.find((item) => item > index) ?? HOME_FEED_INDICES[0];
  }

  return [...HOME_FEED_INDICES].reverse().find((item) => item < index) ?? HOME_FEED_INDICES[HOME_FEED_INDICES.length - 1];
}

const TUTORIAL_STEPS = [
  {
    id: "wait-bubble",
    group: "Task 1",
    title: "先查看好友的时刻评论",
    body: "播放到 Jane 标记的时刻时，评论会自动出现；首次出现后约 3 秒收起。",
    hint: "目标：等待自动触发",
    target: "moment-marker",
  },
  {
    id: "replay-marker",
    group: "Task 1",
    title: "点击时刻点复看",
    body: "评论收起后，点击进度条上的头像点，会跳回该时间并再次显示评论。",
    hint: "目标：进度条头像点",
    target: "moment-marker",
  },
  {
    id: "swipe-next",
    group: "Task 2",
    title: "切到下一条视频",
    body: "现在向上滑到下一条视频，试着自己发送一条时刻评论。",
    hint: "目标：向上滑动视频",
    target: "phone-swipe",
  },
  {
    id: "share",
    group: "Task 2",
    title: "试着发送一条时刻评论",
    body: "现在你来创建一条时刻评论。点击右侧分享按钮，准备把这一秒分享给 Jane。",
    hint: "目标：右侧分享按钮",
    target: "share-button",
  },
  {
    id: "select-person",
    group: "Task 2",
    title: "选择 Jane",
    body: "在发送给面板里点击第一个头像，进入发送状态。",
    hint: "目标：头像",
    target: "share-avatar",
  },
  {
    id: "moment-toggle",
    group: "Task 2",
    title: "开启时刻分享",
    body: "勾选时刻分享，让这次发送绑定到视频里的某一秒。",
    hint: "目标：时刻分享开关",
    target: "moment-toggle",
  },
  {
    id: "comment",
    group: "Task 2",
    title: "可选输入留言",
    body: "把时间点拖到 0:12 左右，再输入一句轻松的留言，比如“这件衣服是不是你也有啊”。",
    hint: "目标：留言输入框",
    target: "comment-input",
  },
  {
    id: "time",
    group: "Task 2",
    title: "选择任意时刻",
    body: "拖动时间轴选择想标记的时间点，不需要精确到某一秒。",
    hint: "目标：时刻时间轴",
    target: "time-slider",
  },
  {
    id: "send",
    group: "Task 2",
    title: "发送给 Jane",
    body: "点击发送后，视频进度条会出现一个时刻评论标记。",
    hint: "目标：发送按钮",
    target: "send-button",
  },
  {
    id: "open-inbox",
    group: "Task 3",
    title: "打开收件箱",
    body: "点击底部收件箱，进入你和 Jane 的消息入口。",
    hint: "目标：收件箱",
    target: "inbox-tab",
  },
  {
    id: "open-chat",
    group: "Task 3",
    title: "进入 Jane 对话",
    body: "点击 Jane 的消息，查看她分享给你的时刻评论。",
    hint: "目标：Jane 消息",
    target: "jane-row",
  },
  {
    id: "open-shared-video",
    group: "Task 3",
    title: "打开 Jane 分享的视频",
    body: "点击对话里的视频卡片，会直接跳到 Jane 标记的时刻位置。",
    hint: "目标：视频卡片",
    target: "chat-video",
  },
  {
    id: "done",
    group: "完成",
    title: "完整流程已完成",
    body: "你已经演示了发送、查看和从私信打开时刻评论的完整链路。",
    hint: "可以继续自由体验原型",
    target: null,
  },
];

const TUTORIAL_STEP_INDEX = Object.fromEntries(TUTORIAL_STEPS.map((step, index) => [step.id, index]));

export default function App() {
  const [tutorialStepId, setTutorialStepId] = useState("wait-bubble");
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const tutorialStep = TUTORIAL_STEPS[TUTORIAL_STEP_INDEX[tutorialStepId]] || TUTORIAL_STEPS[0];

  const goToTutorialStep = (nextId) => {
    if (!nextId || tutorialStepId === nextId) return;
    setTutorialStepId(nextId);
  };

  const guideAction = (action, payload = {}) => {
    if (tutorialDismissed) return;
    const current = tutorialStepId;

    if (current === "share" && action === "openShare") goToTutorialStep("select-person");
    if (current === "select-person" && action === "selectPerson") goToTutorialStep("moment-toggle");
    if (current === "moment-toggle" && action === "toggleMoment" && payload.enabled) goToTutorialStep("comment");
    if (current === "comment" && action === "commentInput") goToTutorialStep("time");
    if ((current === "comment" || current === "time") && action === "momentScrub") goToTutorialStep("send");
    if (current === "swipe-next" && action === "homeVideoChanged" && payload.index === HOME_FEED_INDICES[1]) goToTutorialStep("share");
    if ((current === "comment" || current === "time" || current === "send") && action === "sendMoment") goToTutorialStep("open-inbox");
    if (current === "wait-bubble" && action === "momentBubbleShown") {
      window.setTimeout(() => {
        setTutorialStepId((value) => (value === "wait-bubble" ? "replay-marker" : value));
      }, 3200);
    }
    if (current === "replay-marker" && action === "markerReplay") goToTutorialStep("swipe-next");
    if (current === "open-inbox" && action === "openInbox") goToTutorialStep("open-chat");
    if (current === "open-chat" && action === "openChat") goToTutorialStep("open-shared-video");
    if (current === "open-shared-video" && action === "openSharedVideo") goToTutorialStep("done");
  };

  const resetTutorial = () => {
    setTutorialDismissed(false);
    setTutorialStepId("wait-bubble");
  };

  return (
    <main className={`stage with-left-panel ${tutorialDismissed ? "" : "with-tutorial"}`}>
      <ProjectInfoPanel />
      <PhonePrototype
        guideAction={guideAction}
        guideTarget={tutorialDismissed ? null : tutorialStep.target}
      />
      {!tutorialDismissed && (
        <TutorialPanel
          step={tutorialStep}
          index={TUTORIAL_STEP_INDEX[tutorialStep.id] + 1}
          total={TUTORIAL_STEPS.length}
          onSkip={() => setTutorialDismissed(true)}
          onReset={resetTutorial}
        />
      )}
    </main>
  );
}

function ProjectInfoPanel() {
  return (
    <aside className="project-panel" aria-label="项目介绍">
      <h1>TikTok时刻分享</h1>
      <dl>
        <div>
          <dt>设计师</dt>
          <dd>jiayi wang 王佳奕</dd>
        </div>
        <div>
          <dt>时间</dt>
          <dd>2026/05</dd>
        </div>
      </dl>
      <p>
        面向 TikTok 好友间分享场景的轻量交互原型。用户可以把评论绑定到视频的某一秒，
        让接收者在播放到关键时刻时看到朋友的即时反应。
      </p>
      <a
        href="https://www.figma.com/design/pKFx07nadHqtYLC5vq0Y88/%E6%8A%96%E9%9F%B3-%E6%97%B6%E5%88%BB%E8%AF%84%E8%AE%BA260512?node-id=74-2445&t=j37N0B2rmnpIqDkq-1"
        target="_blank"
        rel="noreferrer"
      >
        查看设计说明
      </a>
    </aside>
  );
}

function TutorialPanel({ step, index, total, onSkip, onReset }) {
  return (
    <aside className="tutorial-panel" aria-label="原型演示指引">
      <div className="tutorial-card">
        <span className="tutorial-kicker">{step.group}</span>
        <strong>{step.title}</strong>
        <p>{step.body}</p>
        <div className="tutorial-hint">{step.hint}</div>
        <div className="tutorial-progress">
          <span>{index} / {total}</span>
          <i style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <div className="tutorial-actions">
          <button type="button" onClick={onReset}>重新开始</button>
          <button type="button" onClick={onSkip}>跳过指引</button>
        </div>
      </div>
    </aside>
  );
}

function PhonePrototype({ guideAction = () => {}, guideTarget = null }) {
  const appRef = useRef(null);
  const videoRefs = useRef([]);
  const bubbleTimer = useRef(null);
  const settleTimer = useRef(null);
  const pointerStart = useRef(null);
  const previousIndex = useRef(HOME_FEED_INDICES[0]);

  const [activeIndex, setActiveIndex] = useState(HOME_FEED_INDICES[0]);
  const [appView, setAppView] = useState("feed");
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [panel, setPanel] = useState(null);
  const [friendView, setFriendView] = useState(true);
  const [toast, setToast] = useState("");
  const [comment, setComment] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [isResettingFeed, setIsResettingFeed] = useState(false);
  const [draftMomentTime, setDraftMomentTime] = useState(0);
  const [isMomentEnabled, setIsMomentEnabled] = useState(false);
  const [isMomentScrubbing, setIsMomentScrubbing] = useState(false);
  const [isSharedEntry, setIsSharedEntry] = useState(false);
  const [moments, setMoments] = useState(DEFAULT_MOMENTS);
  const [sentChatMoments, setSentChatMoments] = useState([]);

  const activeItem = FEED_ITEMS[activeIndex];
  const activeVideo = videoRefs.current[activeIndex];
  const duration = Number.isFinite(activeVideo?.duration) && activeVideo.duration > 0 ? activeVideo.duration : 20;
  const currentTime = progress * duration;
  const momentItems = Array.isArray(moments) ? moments : DEFAULT_MOMENTS;
  const activeMoment = momentItems.find((item) => item.videoIndex === activeIndex);
  const guideClass = (target) => (guideTarget === target ? "guide-pulse" : "");
  const markerX = activeMoment ? `${Math.max(2, Math.min(98, (activeMoment.time / duration) * 100))}%` : "35%";
  const nativeScrubPercent = duration > 0 ? Math.max(0, Math.min(100, (draftMomentTime / duration) * 100)) : 0;
  const appWidth = appRef.current?.clientWidth || 414;
  const appHeight = appRef.current?.clientHeight || 896;
  const sharedDragScale = isSharedEntry
    ? Math.max(0.78, 1 - Math.min(Math.max(Math.abs(dragOffsetX) / appWidth, Math.abs(dragOffset) / appHeight), 1) * 0.18)
    : 1;
  const people = useMemo(() => PEOPLE, []);
  const renderSlots = useMemo(() => {
    if (isSharedEntry) {
      return [
        { slot: "current", index: activeIndex, item: FEED_ITEMS[activeIndex] },
      ];
    }
    const previous = getHomeFeedNeighbor(activeIndex, -1);
    const next = getHomeFeedNeighbor(activeIndex, 1);
    return [
      { slot: "previous", index: previous, item: FEED_ITEMS[previous] },
      { slot: "current", index: activeIndex, item: FEED_ITEMS[activeIndex] },
      { slot: "next", index: next, item: FEED_ITEMS[next] },
    ];
  }, [activeIndex, isSharedEntry]);

  const showToast = (message) => {
    setToast(message.includes("Jess") ? "发送给 jane" : message);
    window.setTimeout(() => setToast(""), 1300);
  };

  const navigateApp = (nextView) => {
    setIsSharedEntry(false);
    if (nextView === "feed" && !HOME_FEED_INDICES.includes(activeIndex)) {
      setActiveIndex(HOME_FEED_INDICES[0]);
    }
    if (nextView === "inbox") guideAction("openInbox");
    if (nextView === "chat") guideAction("openChat");
    setAppView(nextView);
    setPanel(null);
    setShowBubble(false);
    setIsMomentScrubbing(false);
    setDragOffsetX(0);
    setDragOffset(0);
  };

  const openSharedMomentFromChat = (momentOverride) => {
    const sharedMoment = momentOverride || DEFAULT_MOMENTS.find((item) => item.id === "jane-donkey");
    if (!sharedMoment) return;
    guideAction("openSharedVideo");

    setAppView("feed");
    setPanel(null);
    setFriendView(true);
    setShowBubble(false);
    setIsMomentScrubbing(false);
    setIsDragging(false);
    setIsSettling(false);
    setIsResettingFeed(false);
    setDragOffsetX(0);
    setDragOffset(0);
    setIsSharedEntry(true);
    setActiveIndex(sharedMoment.videoIndex);
    setIsPaused(false);

    window.clearTimeout(bubbleTimer.current);
    window.setTimeout(() => {
      const video = videoRefs.current[sharedMoment.videoIndex];
      const videoDuration = Number.isFinite(video?.duration) && video.duration > 0 ? video.duration : 20;
      if (video) {
        video.currentTime = sharedMoment.time;
        video.play().catch(() => {});
      }
      setProgress(sharedMoment.time / videoDuration);
      setShowBubble(true);
      setMoments((value) => value.map((item) => (item.id === sharedMoment.id ? { ...item, seenOnce: true } : item)));
      bubbleTimer.current = window.setTimeout(() => setShowBubble(false), 3200);
    }, 90);
  };

  const closePanels = () => {
    setPanel(null);
    setIsMomentScrubbing(false);
    setPausedState(false);
  };

  const setPausedState = (paused) => {
    setIsPaused(paused);
    const video = videoRefs.current[activeIndex];
    if (!video) return;
    if (paused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  const setVideoProgress = (nextProgress, syncVideo = true) => {
    const clamped = Math.max(0, Math.min(1, nextProgress));
    setProgress(clamped);
    if (syncVideo && activeVideo) {
      activeVideo.currentTime = clamped * duration;
    }
  };

  const syncDraftMomentTime = (nextTime, pauseVideo = false) => {
    const clampedTime = Math.max(0, Math.min(duration, nextTime));
    setDraftMomentTime(clampedTime);
    setProgress(duration > 0 ? clampedTime / duration : 0);
    if (activeVideo) activeVideo.currentTime = clampedTime;
    if (pauseVideo) setPausedState(true);
  };

  const openShare = () => {
    setIsMomentEnabled(false);
    setIsMomentScrubbing(false);
    setDraftMomentTime(currentTime);
    setComment("");
    setPanel("share");
    guideAction("openShare");
  };

  const handleSelectSharePerson = () => {
    setIsMomentEnabled(false);
    setIsMomentScrubbing(false);
    setDraftMomentTime(currentTime);
    guideAction("selectPerson");
  };

  const toggleMomentShare = () => {
    if (isMomentEnabled) {
      setIsMomentEnabled(false);
      setIsMomentScrubbing(false);
      setPausedState(false);
      return;
    }
    setDraftMomentTime(currentTime);
    setIsMomentEnabled(true);
    guideAction("toggleMoment", { enabled: true });
  };

  const beginMomentScrub = () => {
    setIsMomentScrubbing(true);
    setPausedState(true);
    guideAction("momentScrub");
  };

  const endMomentScrub = () => {
    setIsMomentScrubbing(false);
    setPausedState(true);
  };

  const stepDraftMomentTime = (delta) => {
    syncDraftMomentTime(draftMomentTime + delta, true);
  };

  const goToVideo = (nextIndex) => {
    const clamped = nextIndex;
    setPanel(null);
    setShowBubble(false);
    setDragOffsetX(0);
    setDragOffset(0);
    setIsPaused(false);
    setIsMomentEnabled(false);
    setIsMomentScrubbing(false);
    setActiveIndex(clamped);
    if (HOME_FEED_INDICES.includes(clamped)) {
      guideAction("homeVideoChanged", { index: clamped });
    }
  };

  const forceBubble = ({ jumpToMoment = false } = {}) => {
    if (!activeMoment) return;
    if (jumpToMoment && activeVideo) {
      activeVideo.currentTime = activeMoment.time;
      setProgress(duration > 0 ? activeMoment.time / duration : 0);
    }
    setShowBubble(true);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setShowBubble(false), 3000);
    setMoments((value) => value.map((item) => (item.id === activeMoment.id ? { ...item, seenOnce: true } : item)));
    guideAction("momentBubbleShown", { id: activeMoment.id });
  };

  const handleMomentMarkerClick = () => {
    forceBubble({ jumpToMoment: true });
    guideAction("markerReplay");
  };

  const maybeShowBubble = (time) => {
    if (!friendView || !activeMoment || activeMoment.seenOnce) return;
    if (Math.abs(time - activeMoment.time) < 0.35) {
      forceBubble();
    }
  };

  const saveMoment = (timeOverride = currentTime) => {
    const nextMoment = {
      id: `sent-${activeIndex}`,
      videoIndex: activeIndex,
      time: Math.round(timeOverride),
      author: "jiayi",
      fallback: "J",
      text: comment.trim(),
      seenOnce: false,
    };
    setMoments((value) => [...value.filter((item) => item.videoIndex !== activeIndex), nextMoment]);
    setSentChatMoments((value) => [
      ...value.filter((item) => item.id !== nextMoment.id),
      {
        ...nextMoment,
        item: FEED_ITEMS[activeIndex],
      },
    ]);
    setFriendView(true);
    setPanel(null);
    showToast("已发送给 Jess");

    const video = videoRefs.current[activeIndex];
    if (video) video.currentTime = Math.max(0, nextMoment.time - 1.2);
    setPausedState(false);
  };

  const sendShare = () => {
    if (isMomentEnabled) {
      saveMoment(draftMomentTime);
      guideAction("sendMoment");
      return;
    }
    setPanel(null);
    setIsMomentScrubbing(false);
    showToast("已发送给 Jess");
    setPausedState(false);
  };

  const handlePointerDown = (event) => {
    if (isSettling) return;
    if (event.target.closest("button, textarea, .sheet, .composer, .progress-wrap, .shared-reply-dock")) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      time: performance.now(),
      moved: false,
    };
    setIsDragging(false);
    event.currentTarget.setPointerCapture(event.pointerId);

  };

  const handlePointerMove = (event) => {
    if (!pointerStart.current) return;
    const dy = event.clientY - pointerStart.current.y;
    const dx = event.clientX - pointerStart.current.x;

    if (Math.abs(dy) > 10 || Math.abs(dx) > 10) {
      pointerStart.current.moved = true;
      setIsDragging(true);
      closePanels();
    }

    if (pointerStart.current.moved) {
      setDragOffset(dy);
      setDragOffsetX(isSharedEntry ? dx : 0);
    } else {
      setDragOffset(0);
      setDragOffsetX(0);
    }
  };

  const handlePointerUp = (event) => {
    setIsDragging(false);

    if (!pointerStart.current) {
      setDragOffsetX(0);
      setDragOffset(0);
      return;
    }

    event.currentTarget.releasePointerCapture(pointerStart.current.pointerId);
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    const elapsed = Math.max(1, performance.now() - pointerStart.current.time);
    const height = appRef.current?.clientHeight || 896;
    const width = appRef.current?.clientWidth || 414;
    const shouldFlip = Math.abs(dy) >= height * 0.5;
    const shouldDismissShared = Math.abs(dy) >= height * 0.28 || Math.abs(dx) >= width * 0.28;
    const nextIndex = getHomeFeedNeighbor(activeIndex, dy < 0 ? 1 : -1);
    const isTap = !pointerStart.current.moved && Math.abs(dx) < 10 && Math.abs(dy) < 10 && elapsed < 520;

    pointerStart.current = null;

    if (isTap && !panel) {
      setPausedState(!isPaused);
      setDragOffsetX(0);
      setDragOffset(0);
    } else if (isSharedEntry) {
      if (shouldDismissShared) {
        setIsSettling(true);
        const horizontalExit = Math.abs(dx) > Math.abs(dy);
        setDragOffsetX(horizontalExit ? (dx < 0 ? -width : width) : dx);
        setDragOffset(horizontalExit ? dy : (dy < 0 ? -height : height));
        window.clearTimeout(settleTimer.current);
        settleTimer.current = window.setTimeout(() => {
          setIsSettling(false);
          setDragOffsetX(0);
          setDragOffset(0);
          navigateApp("chat");
        }, 260);
      } else {
        setDragOffsetX(0);
        setDragOffset(0);
      }
    } else if (shouldFlip) {
      setIsSettling(true);
      setDragOffset(dy < 0 ? -height : height);
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        setIsResettingFeed(true);
        goToVideo(nextIndex);
        window.requestAnimationFrame(() => {
          setIsResettingFeed(false);
          setIsSettling(false);
        });
      }, 260);
    } else {
      setDragOffsetX(0);
      setDragOffset(0);
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (appView === "feed" && index === activeIndex && !isPaused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, appView, isPaused]);

  useEffect(() => {
    if (previousIndex.current !== activeIndex) {
      const nextVideo = videoRefs.current[activeIndex];
      if (nextVideo) nextVideo.currentTime = 0;
      setIsPaused(false);
      setProgress(0);
      setShowBubble(false);
      previousIndex.current = activeIndex;
    }
  }, [activeIndex]);

  useEffect(() => {
    const clearOldCaches = async () => {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    };
    clearOldCaches().catch(() => {});
  }, []);

  return (
    <section className="phone" aria-label="移动端抖音原型">
      <div
        ref={appRef}
        className={`app ${appView === "inbox" || appView === "chat" ? "inbox-app" : ""} ${isSharedEntry ? "shared-entry" : ""} ${isDragging ? "dragging" : ""} ${isSettling ? "settling" : ""} ${isResettingFeed ? "resetting" : ""} ${isMomentScrubbing ? "moment-scrubbing" : ""} ${guideTarget === "phone-swipe" ? "guide-phone-swipe" : ""}`}
        style={isSharedEntry ? {
          "--shared-drag-x": `${dragOffsetX}px`,
          "--shared-drag-y": `${dragOffset}px`,
          "--shared-scale": sharedDragScale,
        } : undefined}
        onPointerDown={appView === "feed" ? handlePointerDown : undefined}
        onPointerMove={appView === "feed" ? handlePointerMove : undefined}
        onPointerUp={appView === "feed" ? handlePointerUp : undefined}
        onPointerCancel={appView === "feed" ? () => {
          window.clearTimeout(settleTimer.current);
          pointerStart.current = null;
          setIsDragging(false);
          setIsSettling(false);
          setIsResettingFeed(false);
          setDragOffsetX(0);
          setDragOffset(0);
        } : undefined}
      >
        {appView === "chat" ? (
          <ChatPage onBack={() => navigateApp("inbox")} onOpenMoment={openSharedMomentFromChat} sentMoments={sentChatMoments} guideTarget={guideTarget} />
        ) : appView === "inbox" ? (
          <InboxPage onNavigate={navigateApp} onOpenChat={() => navigateApp("chat")} guideTarget={guideTarget} />
        ) : (
        <>
        {isSharedEntry && (
          <div className="shared-chat-underlay" aria-hidden="true">
            <ChatPage onBack={() => navigateApp("inbox")} onOpenMoment={openSharedMomentFromChat} sentMoments={sentChatMoments} guideTarget={guideTarget} />
          </div>
        )}
        <div
          className="feed-track"
          style={{
            transform: isSharedEntry
              ? `translate3d(${dragOffsetX}px, ${dragOffset}px, 0) scale(${sharedDragScale})`
              : `translate3d(0, calc(-100% + ${dragOffset}px), 0)`,
            transformOrigin: isSharedEntry ? "center center" : undefined,
          }}
        >
          {renderSlots.map(({ item, index, slot }) => (
            <article className="video-screen" data-index={index} data-slot={slot} key={`${slot}-${item.src}`}>
              <video
                ref={(node) => {
                  if (slot === "current") videoRefs.current[index] = node;
                }}
                className="video-bg"
                src={item.src}
                poster={item.poster}
                muted
                loop
                playsInline
                preload="metadata"
                onTimeUpdate={(event) => {
                  if (index !== activeIndex) return;
                  const nextDuration = event.currentTarget.duration || 20;
                  const nextTime = event.currentTarget.currentTime || 0;
                  setProgress(nextTime / nextDuration);
                  maybeShowBubble(nextTime);
                }}
              />
              <VideoChrome
                item={item}
                isActive={index === activeIndex}
                onShare={openShare}
                guideTarget={guideTarget}
              />
            </article>
          ))}
        </div>

        {isSharedEntry ? (
          <SharedEntryTopChrome onBack={() => navigateApp("chat")} />
        ) : (
          <TopChrome />
        )}

        <div className={`moment-marker ${activeMoment ? "show" : ""} ${activeMoment?.seenOnce ? "collapsed" : ""} ${guideClass("moment-marker")}`} style={{ "--x": markerX }}>
          <button className="marker-avatar" type="button" onClick={handleMomentMarkerClick}>
            {activeMoment?.avatar ? <img src={activeMoment.avatar} alt="" /> : activeMoment?.fallback || "J"}
          </button>
          <button className="marker-line" type="button" aria-label="查看时刻评论" onClick={handleMomentMarkerClick} />
        </div>

        <div
          className={`moment-bubble ${showBubble && activeMoment ? "" : "hidden"} ${activeMoment?.text ? "" : "textless"} ${(activeMoment?.text || "").length > 18 ? "long" : ""}`}
          style={{ "--bubble-drag-y": `${isDragging || isSettling ? dragOffset : 0}px` }}
        >
          <div className="bubble-avatar">
            {activeMoment?.avatar ? <img src={activeMoment.avatar} alt="" /> : activeMoment?.fallback || "J"}
          </div>
          <div>
            <div className="bubble-meta">{activeMoment?.author || "jiayi"} 在 {formatTime(activeMoment?.time || 0)} 标记时刻</div>
            {activeMoment?.text && <div className="bubble-text">{activeMoment.text}</div>}
          </div>
        </div>

        <div className={`play-toggle ${isPaused ? "visible" : ""}`} aria-hidden="true" />

        {isMomentScrubbing && (
          <div className="native-scrub-overlay" aria-hidden="true">
            <div className="native-scrub-time">
              <span>{formatScrubTime(draftMomentTime)}</span>
              <b>/</b>
              <span>{formatScrubTime(duration)}</span>
            </div>
            <div className="native-scrub-track">
              <div className="native-scrub-fill" style={{ width: `${nativeScrubPercent}%` }} />
              <span className="native-scrub-thumb" style={{ left: `${nativeScrubPercent}%` }} />
            </div>
          </div>
        )}

        <div
          className={`progress-wrap ${isDragging || isSettling || isMomentScrubbing ? "hidden-while-dragging" : ""}`}
          onPointerDown={(event) => {
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.classList.add("dragging");
            const rect = event.currentTarget.getBoundingClientRect();
            setVideoProgress((event.clientX - rect.left) / rect.width);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.classList.contains("dragging")) return;
            const rect = event.currentTarget.getBoundingClientRect();
            setVideoProgress((event.clientX - rect.left) / rect.width);
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            event.currentTarget.classList.remove("dragging");
            if (activeMoment && Math.abs(currentTime - activeMoment.time) < 1) forceBubble();
          }}
          onPointerCancel={(event) => {
            event.currentTarget.classList.remove("dragging");
          }}
        >
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <button className="progress-thumb" style={{ left: `${progress * 100}%` }} aria-label="视频进度" />
        </div>

        {isSharedEntry ? (
          <SharedReplyBar />
        ) : (
          <AppBottomNav active="home" onNavigate={navigateApp} guideTarget={guideTarget} />
        )}

        {panel === "share" && (
          <ShareSheet
            people={people}
            comment={comment}
            setComment={(value) => {
              setComment(value);
              guideAction("commentInput");
            }}
            duration={duration}
            draftMomentTime={draftMomentTime}
            isMomentEnabled={isMomentEnabled}
            isMomentScrubbing={isMomentScrubbing}
            guideTarget={guideTarget}
            onSelectPerson={handleSelectSharePerson}
            onToggleMoment={toggleMomentShare}
            onMomentScrubStart={beginMomentScrub}
            onMomentScrubEnd={endMomentScrub}
            onMomentTimeChange={(nextTime) => syncDraftMomentTime(nextTime, true)}
            onMomentStep={stepDraftMomentTime}
            onClose={closePanels}
            onSend={sendShare}
          />
        )}

        {panel === "composer" && (
          <ComposerSheet
            activeItem={activeItem}
            time={formatTime(currentTime)}
            comment={comment}
            setComment={setComment}
            onBack={() => setPanel("share")}
            onSend={saveMoment}
          />
        )}

        {toast && (
          <div className="toast" role="status">
            <span className="toast-check" aria-hidden="true" />
            <span>{toast}</span>
            <span className="toast-arrow" aria-hidden="true" />
          </div>
        )}
        </>
        )}
      </div>
    </section>
  );
}

function VideoChrome({ item, onShare, guideTarget }) {
  return (
    <div className="video-chrome">
      <aside className="right-rail" aria-label="视频操作">
        <button className="creator-avatar" type="button" aria-label={`关注 ${item.author}`}>
          <span className="avatar-photo" style={{ backgroundImage: `url(${item.avatar})`, backgroundColor: item.avatarColor }}>
            <b>{item.avatarFallback}</b>
          </span>
          <i aria-hidden="true" />
        </button>
        <ActionButton icon={likeIcon} label="点赞" value={item.likes} />
        <ActionButton icon={commentIcon} label="评论" value={item.comments} />
        <ActionButton icon={favoriteIcon} label="收藏" value={item.favorites} />
        <ActionButton icon={shareIcon} label="分享" value={item.shares} onClick={onShare} guided={guideTarget === "share-button"} />
        <div className="music-disc" style={{ "--avatar": `url(${item.avatar})`, backgroundColor: item.avatarColor }}>
          <span>{item.avatarFallback}</span>
        </div>
      </aside>

      <section className="caption">
        <strong>{item.author}</strong>
        <p>{item.caption}</p>
      </section>
    </div>
  );
}

function TopChrome() {
  return (
    <div className="top-chrome" aria-hidden="true">
      <img className="status-bar" src={statusBar} alt="" />
      <header className="top-tabs">
        <img className="live-icon" src={liveIcon} alt="" />
        <span>STEM</span>
        <span>探索</span>
        <span>本地</span>
        <span>关注</span>
        <span>商城</span>
        <strong>推荐</strong>
        <img className="search-icon" src={searchIcon} alt="" />
      </header>
    </div>
  );
}

function SharedEntryTopChrome({ onBack }) {
  return (
    <div className="shared-top-chrome">
      <img className="status-bar" src={statusBar} alt="" />
      <button className="shared-back" type="button" aria-label="返回对话" onClick={onBack} />
      <button className="shared-search" type="button" aria-label="搜索">
        <img src={searchIcon} alt="" />
      </button>
    </div>
  );
}

function SharedReplyBar() {
  return (
    <div className="shared-reply-dock" aria-label="私信回复">
      <div className="shared-search-strip">
        <img src={searchIcon} alt="" />
        <span>搜索 · cute donkey video</span>
        <b />
      </div>
      <div className="shared-reply-bar">
        <span className="shared-reply-input">发消息给 jane...</span>
        <span className="shared-reply-emoji">😍</span>
        <span className="shared-reply-emoji">😂</span>
        <span className="shared-reply-emoji">😳</span>
      </div>
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="底部导航">
      <button className="nav-tab active" type="button" aria-label="首页">
        <span className="nav-icon-frame"><img src={homeNav} alt="" /></span>
        <span className="nav-label">首页</span>
      </button>
      <button className="nav-tab" type="button" aria-label="好友">
        <span className="nav-icon-frame"><img src={friendsNav} alt="" /></span>
        <span className="nav-label">好友</span>
      </button>
      <button className="nav-tab publish-tab" type="button" aria-label="发布">
        <img src={plusNav} alt="" />
      </button>
      <button className="nav-tab" type="button" aria-label="收件箱">
        <span className="nav-icon-frame"><img src={inboxNav} alt="" /></span>
        <span className="nav-label">收件箱</span>
      </button>
      <button className="nav-tab" type="button" aria-label="主页">
        <span className="nav-icon-frame"><img src={profileNav} alt="" /></span>
        <span className="nav-label">主页</span>
      </button>
    </nav>
  );
}

function AppBottomNav({ active = "home", variant = "dark", onNavigate = () => {}, guideTarget = null }) {
  return (
    <nav className={`bottom-nav ${variant === "light" ? "light" : ""}`} aria-label="底部导航">
      <button className={`nav-tab ${active === "home" ? "active" : ""}`} type="button" aria-label="首页" onClick={() => onNavigate("feed")}>
        <span className="nav-icon-frame"><img src={homeNav} alt="" /></span>
        <span className="nav-label">首页</span>
      </button>
      <button className={`nav-tab ${active === "friends" ? "active" : ""}`} type="button" aria-label="好友">
        <span className="nav-icon-frame"><img src={friendsNav} alt="" /></span>
        <span className="nav-label">好友</span>
      </button>
      <button className="nav-tab publish-tab" type="button" aria-label="发布">
        <img src={plusNav} alt="" />
      </button>
      <button className={`nav-tab ${active === "inbox" ? "active" : ""} ${guideTarget === "inbox-tab" ? "guide-pulse" : ""}`} type="button" aria-label="收件箱" onClick={() => onNavigate("inbox")}>
        <span className="nav-icon-frame"><img src={inboxNav} alt="" /></span>
        <span className="nav-label">收件箱</span>
      </button>
      <button className={`nav-tab ${active === "profile" ? "active" : ""}`} type="button" aria-label="主页">
        <span className="nav-icon-frame"><img src={profileNav} alt="" /></span>
        <span className="nav-label">主页</span>
      </button>
    </nav>
  );
}

function InboxPage({ onNavigate, onOpenChat, guideTarget = null }) {
  return (
    <section className="inbox-page" aria-label="收件箱">
      <img className="inbox-status-bar" src={statusBar} alt="" />

      <header className="inbox-header">
        <div className="inbox-title-group">
          <h1>收件箱</h1>
          <span className="inbox-presence"><i /><b /></span>
        </div>
        <button className="inbox-search" type="button" aria-label="搜索">
          <img src={searchBlackIcon} alt="" />
        </button>
      </header>

      <section className="inbox-stories" aria-label="快捷入口">
        <div className="story-card create">
          <span className="story-tip">想来点什么?</span>
          <span className="story-avatar letter">J<i /></span>
          <strong>创建</strong>
        </div>
        <div className="story-card">
          <span className="story-avatar photo"><img src={janeAvatar} alt="" /><i /></span>
          <strong>jane</strong>
        </div>
      </section>

      <section className="inbox-list" aria-label="消息列表">
        <InboxRow avatar={janeAvatar} title="jane" subtitle="[分享时刻评论]" unread onClick={onOpenChat} guided={guideTarget === "jane-row"} />
      </section>
      <AppBottomNav active="inbox" variant="light" onNavigate={onNavigate} guideTarget={guideTarget} />
    </section>
  );
}

function ChatPage({ onBack, onOpenMoment, sentMoments = [], guideTarget = null }) {
  const sharedMoment = DEFAULT_MOMENTS.find((item) => item.id === "jane-donkey") || DEFAULT_MOMENTS[0];
  const sharedItem = FEED_ITEMS[sharedMoment.videoIndex];
  const chatBodyRef = useRef(null);
  const chatDragRef = useRef(null);

  const handleChatPointerDown = (event) => {
    if (event.target.closest("button")) return;
    chatDragRef.current = {
      pointerId: event.pointerId,
      y: event.clientY,
      scrollTop: chatBodyRef.current?.scrollTop || 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleChatPointerMove = (event) => {
    if (!chatDragRef.current || !chatBodyRef.current) return;
    const dy = event.clientY - chatDragRef.current.y;
    chatBodyRef.current.scrollTop = chatDragRef.current.scrollTop - dy;
  };

  const endChatDrag = (event) => {
    if (!chatDragRef.current) return;
    event.currentTarget.releasePointerCapture(chatDragRef.current.pointerId);
    chatDragRef.current = null;
  };

  return (
    <section className="chat-page" aria-label="与 jane 的对话">
      <img className="chat-status-bar" src={statusBar} alt="" />

      <header className="chat-header">
        <button className="chat-back" type="button" aria-label="返回收件箱" onClick={onBack} />
        <span className="chat-title-avatar"><img src={janeAvatar} alt="" /></span>
        <strong>jane</strong>
        <button className="chat-more" type="button" aria-label="更多"><i /><i /><i /></button>
      </header>

      <main
        className="chat-body"
        ref={chatBodyRef}
        onPointerDown={handleChatPointerDown}
        onPointerMove={handleChatPointerMove}
        onPointerUp={endChatDrag}
        onPointerCancel={endChatDrag}
      >
        <div className="chat-date">星期一 下午9:54</div>
        <div className="chat-message-row">
          <span className="chat-avatar"><img src={janeAvatar} alt="" /></span>
          <div className="chat-message-stack">
            <button className={`chat-video-card ${guideTarget === "chat-video" ? "guide-pulse" : ""}`} type="button" onClick={() => onOpenMoment(sharedMoment)}>
              <span className="chat-video-thumb">
                <img src={sharedItem.preview} alt="" />
                <i className="chat-play" aria-hidden="true" />
                <b className="chat-time-badge">时刻 {formatTime(sharedMoment.time)}</b>
                <strong>{sharedItem.author}</strong>
              </span>
            </button>
            <span className="chat-moment-comment">{sharedMoment.text}</span>
          </div>
        </div>
        {sentMoments.map((moment) => (
          <ChatMomentMessage
            key={moment.id}
            item={moment.item || FEED_ITEMS[moment.videoIndex]}
            moment={moment}
            outgoing
            onOpenMoment={() => onOpenMoment(moment)}
          />
        ))}
      </main>

      <footer className="chat-composer" aria-hidden="true">
        <div className="chat-reactions">
          <span>❤️</span>
          <span>😂</span>
          <span>👍</span>
          <span>分享发布内容</span>
        </div>
        <div className="chat-input-row">
          <span className="chat-camera" />
          <span className="chat-input-pill">消息...</span>
          <span className="chat-small-icon image" />
          <span className="chat-small-icon emoji" />
          <span className="chat-small-icon mic" />
        </div>
      </footer>
    </section>
  );
}

function ChatMomentMessage({ item, moment, avatar, outgoing = false, onOpenMoment, guided = false }) {
  return (
    <div className={`chat-message-row ${outgoing ? "outgoing" : ""}`}>
      {!outgoing && (
        <span className="chat-avatar"><img src={avatar} alt="" /></span>
      )}
      <div className="chat-message-stack">
        <button className={`chat-video-card ${guided ? "guide-pulse" : ""}`} type="button" onClick={onOpenMoment}>
          <span className="chat-video-thumb">
            <img src={item.preview} alt="" />
            <i className="chat-play" aria-hidden="true" />
            <b className="chat-time-badge">时刻 {formatTime(moment.time)}</b>
            <strong>{item.author}</strong>
          </span>
        </button>
        {moment.text && <span className="chat-moment-comment">{moment.text}</span>}
      </div>
    </div>
  );
}

function InboxRow({ avatar, iconClass, title, subtitle, unread = false, redDot = false, right, onClick, guided = false }) {
  const RowTag = onClick ? "button" : "article";
  return (
    <RowTag className={`inbox-row ${guided ? "guide-pulse" : ""}`} type={onClick ? "button" : undefined} onClick={onClick}>
      <span className={`inbox-row-avatar ${iconClass || ""}`}>
        {avatar ? <img src={avatar} alt="" /> : null}
      </span>
      <div className="inbox-row-text">
        <strong>{title}</strong>
        <p>{subtitle}</p>
      </div>
      {unread && <span className="inbox-unread" />}
      {redDot && <span className="inbox-red-dot" />}
      {right && <span className="inbox-row-right">{right}</span>}
    </RowTag>
  );
}

function ActionButton({ icon, label, value, onClick, guided = false }) {
  return (
    <button className={guided ? "guide-pulse" : ""} type="button" aria-label={label} onClick={onClick}>
      <span className="action-icon-crop"><img src={icon} alt="" /></span>
      <small>{value}</small>
    </button>
  );
}

function ShareSheet({
  people,
  comment,
  setComment,
  duration,
  draftMomentTime,
  isMomentEnabled,
  isMomentScrubbing,
  guideTarget = null,
  onSelectPerson,
  onToggleMoment,
  onMomentScrubStart,
  onMomentScrubEnd,
  onMomentTimeChange,
  onMomentStep,
  onClose,
  onSend,
}) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const quickEmojis = ["🥰", "👍", "😂", "😎", "🥺", "🙏"];

  if (!selectedPerson) {
    return (
      <section className="sheet svg-share-sheet" aria-label="发送给">
        <img className="share-sheet-svg" src={shareSheetSvg} alt="发送给" />
        <button className="share-svg-close" type="button" aria-label="关闭" onClick={onClose} />
        <button
          className={`share-svg-first-person ${guideTarget === "share-avatar" ? "guide-pulse" : ""}`}
          type="button"
          aria-label="选择 jiayiwang578"
          onClick={() => {
            setSelectedPerson(people[0]);
            onSelectPerson();
          }}
        />
      </section>
    );
  }

  return (
    <section className={`sheet rebuilt-share-sheet ${isMomentEnabled ? "moment-enabled" : ""} ${isMomentScrubbing ? "scrubbing" : ""}`} aria-label="发送给">
      <div className="rebuilt-share-main">
        <div className="rebuilt-share-top">
          <img className="share-sheet-svg" src={selectedShareSheetSvg} alt="" />
          <button className="share-svg-close rebuilt-close-hit" type="button" aria-label="关闭" onClick={onClose} />
        </div>

        <div className="rebuilt-share-body">
          <textarea
            className="rebuilt-message-input"
            value={comment}
            placeholder="有什么想和朋友说的..."
            onChange={(event) => setComment(event.target.value)}
          />

          <div className="rebuilt-emoji-row" aria-label="快捷表情">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                aria-label={`输入 ${emoji}`}
                onClick={() => {
                  setComment((value) => `${value}${emoji}`);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button className={`rebuilt-moment-toggle ${isMomentEnabled ? "enabled" : ""} ${guideTarget === "moment-toggle" ? "guide-pulse" : ""}`} type="button" onClick={onToggleMoment}>
            <strong>时刻分享</strong>
            <span className="rebuilt-moment-right">
              <small>评论在 {formatTime(draftMomentTime)}</small>
              <span className="rebuilt-switch" aria-hidden="true" />
            </span>
          </button>

          {isMomentEnabled && (
            <MomentTimeControl
              duration={duration}
              time={draftMomentTime}
              onStep={onMomentStep}
              onScrubStart={onMomentScrubStart}
              onScrubEnd={onMomentScrubEnd}
              onTimeChange={onMomentTimeChange}
              guided={guideTarget === "time-slider"}
            />
          )}

          <button className={`rebuilt-send-button ${guideTarget === "send-button" ? "guide-pulse" : ""}`} type="button" onClick={onSend}>发送</button>
        </div>
      </div>
    </section>
  );
}

function updateTimeFromPointer(event, duration, onTimeChange) {
  const rect = event.currentTarget.getBoundingClientRect();
  const nextProgress = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  onTimeChange(nextProgress * duration);
}

function MomentTimeControl({ compact = false, duration, time, onStep, onScrubStart, onScrubEnd, onTimeChange, guided = false }) {
  const progressPercent = `${Math.max(0, Math.min(100, (time / duration) * 100))}%`;
  const updateFromPointer = (event) => updateTimeFromPointer(event, duration, onTimeChange);

  return (
    <div className={`moment-time-control ${compact ? "compact" : ""}`}>
      <div
        className={`moment-time-slider ${guided ? "guide-pulse" : ""}`}
        role="slider"
        aria-label="时刻分享时间点"
        aria-valuemin="0"
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(time)}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.classList.add("dragging");
          onScrubStart();
          updateFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.classList.contains("dragging")) return;
          updateFromPointer(event);
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          event.currentTarget.classList.remove("dragging");
          onScrubEnd();
        }}
        onPointerCancel={(event) => {
          event.currentTarget.classList.remove("dragging");
          onScrubEnd();
        }}
      >
        <div className="moment-time-track">
          <div className="moment-time-fill" style={{ width: progressPercent }} />
        </div>
        <span className="moment-time-thumb" style={{ left: progressPercent }} />
      </div>
    </div>
  );
}

function ComposerSheet({ activeItem, time, comment, setComment, onBack, onSend }) {
  return (
    <section className="composer" aria-label="时刻评论编辑器">
      <div className="composer-head">
        <button type="button" onClick={onBack}>‹</button>
        <strong>添加时刻评论</strong>
        <span>{time}</span>
      </div>
      <div className="mini-preview">
        <img src={activeItem.preview} alt="" />
        <div className="mini-play">▶</div>
        <div className="mini-pin">标记在 <b>{time}</b></div>
      </div>
      <label className="comment-box">
        <span>留言</span>
        <textarea value={comment} maxLength={52} onChange={(event) => setComment(event.target.value)} />
      </label>
      <div className="emoji-row">
        {EMOJIS.map((emoji) => (
          <button key={emoji} type="button" onClick={() => setComment((value) => `${value}${emoji}`)}>
            {emoji}
          </button>
        ))}
      </div>
      <div className="send-to">
        <span>发送给</span>
        <strong><span className="mini-avatar">J</span> Jess</strong>
      </div>
      <button className="send-button" type="button" onClick={onSend}>发送时刻评论</button>
    </section>
  );
}
