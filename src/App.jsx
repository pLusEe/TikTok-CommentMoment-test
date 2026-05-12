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
const liveIcon = new URL("../assets/ui-kit/live.png", import.meta.url).href;
const janeAvatar = new URL("../assets/ui-kit/Frame 36.svg", import.meta.url).href;
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

const DEFAULT_MOMENTS = [
  {
    id: "jane-donkey",
    videoIndex: 1,
    time: 5,
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

export default function App() {
  return (
    <main className="stage">
      <PhonePrototype />
    </main>
  );
}

function PhonePrototype() {
  const appRef = useRef(null);
  const videoRefs = useRef([]);
  const bubbleTimer = useRef(null);
  const settleTimer = useRef(null);
  const pointerStart = useRef(null);
  const previousIndex = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [panel, setPanel] = useState(null);
  const [friendView, setFriendView] = useState(true);
  const [toast, setToast] = useState("");
  const [comment, setComment] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [isResettingFeed, setIsResettingFeed] = useState(false);
  const [draftMomentTime, setDraftMomentTime] = useState(0);
  const [isMomentEnabled, setIsMomentEnabled] = useState(false);
  const [isMomentScrubbing, setIsMomentScrubbing] = useState(false);
  const [moments, setMoments] = useState(DEFAULT_MOMENTS);

  const activeItem = FEED_ITEMS[activeIndex];
  const activeVideo = videoRefs.current[activeIndex];
  const duration = Number.isFinite(activeVideo?.duration) && activeVideo.duration > 0 ? activeVideo.duration : 20;
  const currentTime = progress * duration;
  const momentItems = Array.isArray(moments) ? moments : DEFAULT_MOMENTS;
  const activeMoment = momentItems.find((item) => item.videoIndex === activeIndex);
  const markerX = activeMoment ? `${Math.max(2, Math.min(98, (activeMoment.time / duration) * 100))}%` : "35%";
  const nativeScrubPercent = duration > 0 ? Math.max(0, Math.min(100, (draftMomentTime / duration) * 100)) : 0;
  const people = useMemo(() => PEOPLE, []);
  const renderSlots = useMemo(() => {
    const total = FEED_ITEMS.length;
    const previous = (activeIndex - 1 + total) % total;
    const next = (activeIndex + 1) % total;
    return [
      { slot: "previous", index: previous, item: FEED_ITEMS[previous] },
      { slot: "current", index: activeIndex, item: FEED_ITEMS[activeIndex] },
      { slot: "next", index: next, item: FEED_ITEMS[next] },
    ];
  }, [activeIndex]);

  const showToast = (message) => {
    setToast(message.includes("Jess") ? "发送给 jiayi" : message);
    window.setTimeout(() => setToast(""), 1300);
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
  };

  const handleSelectSharePerson = () => {
    setIsMomentEnabled(false);
    setIsMomentScrubbing(false);
    setDraftMomentTime(currentTime);
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
  };

  const beginMomentScrub = () => {
    setIsMomentScrubbing(true);
    setPausedState(true);
  };

  const endMomentScrub = () => {
    setIsMomentScrubbing(false);
    setPausedState(true);
  };

  const stepDraftMomentTime = (delta) => {
    syncDraftMomentTime(draftMomentTime + delta, true);
  };

  const goToVideo = (nextIndex) => {
    const total = FEED_ITEMS.length;
    const clamped = ((nextIndex % total) + total) % total;
    setPanel(null);
    setShowBubble(false);
    setDragOffset(0);
    setIsPaused(false);
    setIsMomentEnabled(false);
    setIsMomentScrubbing(false);
    setActiveIndex(clamped);
  };

  const forceBubble = () => {
    if (!activeMoment) return;
    setShowBubble(true);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setShowBubble(false), 3000);
    setMoments((value) => value.map((item) => (item.id === activeMoment.id ? { ...item, seenOnce: true } : item)));
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
      return;
    }
    setPanel(null);
    setIsMomentScrubbing(false);
    showToast("已发送给 Jess");
    setPausedState(false);
  };

  const handlePointerDown = (event) => {
    if (isSettling) return;
    if (event.target.closest("button, textarea, .sheet, .composer, .progress-wrap")) return;

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

    setDragOffset(pointerStart.current.moved ? dy : 0);
  };

  const handlePointerUp = (event) => {
    setIsDragging(false);

    if (!pointerStart.current) {
      setDragOffset(0);
      return;
    }

    event.currentTarget.releasePointerCapture(pointerStart.current.pointerId);
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    const elapsed = Math.max(1, performance.now() - pointerStart.current.time);
    const height = appRef.current?.clientHeight || 896;
    const shouldFlip = Math.abs(dy) >= height * 0.5;
    const nextIndex = activeIndex + (dy < 0 ? 1 : -1);
    const isTap = !pointerStart.current.moved && Math.abs(dx) < 10 && Math.abs(dy) < 10 && elapsed < 520;

    pointerStart.current = null;

    if (isTap && !panel) {
      setPausedState(!isPaused);
      setDragOffset(0);
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
      setDragOffset(0);
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex && !isPaused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isPaused]);

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
        className={`app ${isDragging ? "dragging" : ""} ${isSettling ? "settling" : ""} ${isResettingFeed ? "resetting" : ""} ${isMomentScrubbing ? "moment-scrubbing" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          window.clearTimeout(settleTimer.current);
          pointerStart.current = null;
          setIsDragging(false);
          setIsSettling(false);
          setIsResettingFeed(false);
          setDragOffset(0);
        }}
      >
        <div
          className="feed-track"
          style={{ transform: `translate3d(0, calc(-100% + ${dragOffset}px), 0)` }}
        >
          {renderSlots.map(({ item, index, slot }) => (
            <article className="video-screen" data-index={index} data-slot={slot} key={`${slot}-${item.src}`}>
              <video
                ref={(node) => {
                  videoRefs.current[index] = node;
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
              />
            </article>
          ))}
        </div>

        <TopChrome />

        <div className={`moment-marker ${activeMoment ? "show" : ""} ${activeMoment?.seenOnce ? "collapsed" : ""}`} style={{ "--x": markerX }}>
          <button className="marker-avatar" type="button" onClick={forceBubble}>
            {activeMoment?.avatar ? <img src={activeMoment.avatar} alt="" /> : activeMoment?.fallback || "J"}
          </button>
          <button className="marker-line" type="button" aria-label="查看时刻评论" onClick={forceBubble} />
        </div>

        <div className={`moment-bubble ${showBubble && activeMoment ? "" : "hidden"} ${activeMoment?.text ? "" : "textless"} ${(activeMoment?.text || "").length > 18 ? "long" : ""}`}>
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

        <BottomNav />

        {panel === "share" && (
          <ShareSheet
            people={people}
            comment={comment}
            setComment={setComment}
            duration={duration}
            draftMomentTime={draftMomentTime}
            isMomentEnabled={isMomentEnabled}
            isMomentScrubbing={isMomentScrubbing}
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
      </div>
    </section>
  );
}

function VideoChrome({ item, onShare }) {
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
        <ActionButton icon={shareIcon} label="分享" value={item.shares} onClick={onShare} />
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

function ActionButton({ icon, label, value, onClick }) {
  return (
    <button type="button" aria-label={label} onClick={onClick}>
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
          className="share-svg-first-person"
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

          <button className={`rebuilt-moment-toggle ${isMomentEnabled ? "enabled" : ""}`} type="button" onClick={onToggleMoment}>
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
            />
          )}

          <button className="rebuilt-send-button" type="button" onClick={onSend}>发送</button>
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

function MomentTimeControl({ compact = false, duration, time, onStep, onScrubStart, onScrubEnd, onTimeChange }) {
  const progressPercent = `${Math.max(0, Math.min(100, (time / duration) * 100))}%`;
  const updateFromPointer = (event) => updateTimeFromPointer(event, duration, onTimeChange);

  return (
    <div className={`moment-time-control ${compact ? "compact" : ""}`}>
      <div
        className="moment-time-slider"
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
