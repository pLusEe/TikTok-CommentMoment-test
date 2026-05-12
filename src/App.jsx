import { useEffect, useMemo, useRef, useState } from "react";

const videoChicks = new URL("../assets/video-chicks.mp4", import.meta.url).href;
const videoCreator = new URL("../assets/video-creator.mp4", import.meta.url).href;
const videoThird = new URL("../assets/video-third.mp4", import.meta.url).href;
const feedChicks = new URL("../assets/feed-chicks.jpg", import.meta.url).href;
const feedCreator = new URL("../assets/feed-creator.jpg", import.meta.url).href;
const posterDonkey = new URL("../assets/poster-donkey.jpg", import.meta.url).href;

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

const FEED_ITEMS = [
  {
    src: videoChicks,
    poster: feedChicks,
    preview: feedChicks,
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
    poster: posterDonkey,
    preview: posterDonkey,
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
    poster: feedCreator,
    preview: feedCreator,
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
  { avatar: "J", name: "Jess", selected: true },
  { avatar: "S", name: "Susy" },
  { avatar: "D", name: "Dean" },
  { avatar: "A", name: "aan600" },
  { avatar: "+", name: "邀请" },
];

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds || 0));
  return `0:${String(safe).padStart(2, "0")}`;
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
  const longPressTimer = useRef(null);
  const pointerStart = useRef(null);
  const previousIndex = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [panel, setPanel] = useState(null);
  const [friendView, setFriendView] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😂");
  const [comment, setComment] = useState("就是这一秒笑死我了");
  const [showBubble, setShowBubble] = useState(false);
  const [showLongPressTip, setShowLongPressTip] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [moment, setMoment] = useState({
    exists: false,
    videoIndex: 0,
    time: 7,
    emoji: "😂",
    text: "就是这一秒笑死我了",
    seenOnce: false,
  });

  const activeItem = FEED_ITEMS[activeIndex];
  const activeVideo = videoRefs.current[activeIndex];
  const duration = Number.isFinite(activeVideo?.duration) && activeVideo.duration > 0 ? activeVideo.duration : 20;
  const currentTime = progress * duration;
  const markerX = moment.exists && moment.videoIndex === activeIndex ? `${Math.max(2, Math.min(98, (moment.time / duration) * 100))}%` : "35%";
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
    setToast(message);
    window.setTimeout(() => setToast(""), 1300);
  };

  const closePanels = () => setPanel(null);

  const clearLongPress = () => {
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
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

  const goToVideo = (nextIndex) => {
    const total = FEED_ITEMS.length;
    const clamped = ((nextIndex % total) + total) % total;
    setPanel(null);
    setShowBubble(false);
    setDragOffset(0);
    setIsPaused(false);
    setActiveIndex(clamped);
  };

  const forceBubble = () => {
    if (!moment.exists || moment.videoIndex !== activeIndex) return;
    setShowBubble(true);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setShowBubble(false), 3000);
    setMoment((value) => ({ ...value, seenOnce: true }));
  };

  const maybeShowBubble = (time) => {
    if (!friendView || !moment.exists || moment.videoIndex !== activeIndex || moment.seenOnce) return;
    if (Math.abs(time - moment.time) < 0.35) {
      forceBubble();
    }
  };

  const saveMoment = () => {
    const nextMoment = {
      exists: true,
      videoIndex: activeIndex,
      time: Math.round(currentTime),
      emoji: selectedEmoji,
      text: comment.trim() || "就是这一秒笑死我了",
      seenOnce: false,
    };
    setMoment(nextMoment);
    setFriendView(true);
    setPanel(null);
    showToast("已发送给 Jess");

    const video = videoRefs.current[activeIndex];
    if (video) video.currentTime = Math.max(0, nextMoment.time - 1.2);
    setPausedState(false);
  };

  const handlePointerDown = (event) => {
    if (event.target.closest("button, textarea, .sheet, .composer, .progress-wrap")) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
      time: performance.now(),
      moved: false,
    };
    setIsDragging(false);
    clearLongPress();
    event.currentTarget.setPointerCapture(event.pointerId);

    longPressTimer.current = window.setTimeout(() => {
      setPausedState(true);
      setShowLongPressTip(true);
      window.setTimeout(() => {
        setShowLongPressTip(false);
        setPanel("composer");
      }, 700);
    }, 520);
  };

  const handlePointerMove = (event) => {
    if (!pointerStart.current) return;
    const dy = event.clientY - pointerStart.current.y;
    const dx = event.clientX - pointerStart.current.x;

    if (Math.abs(dy) > 10 || Math.abs(dx) > 10) {
      pointerStart.current.moved = true;
      setIsDragging(true);
      clearLongPress();
      closePanels();
    }

    setDragOffset(pointerStart.current.moved ? dy : 0);
  };

  const handlePointerUp = (event) => {
    clearLongPress();
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
      goToVideo(nextIndex);
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
        className={`app ${isDragging ? "dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          clearLongPress();
          pointerStart.current = null;
          setIsDragging(false);
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
                onShare={() => {
                  setPanel("share");
                  setPausedState(true);
                }}
              />
            </article>
          ))}
        </div>

        <TopChrome />

        <div className={`moment-marker ${moment.exists && moment.videoIndex === activeIndex ? "show" : ""}`} style={{ "--x": markerX }}>
          <div className="marker-line" />
          <button className="marker-avatar" type="button" onClick={forceBubble}>J</button>
        </div>

        <div className={`moment-bubble ${showBubble ? "" : "hidden"}`}>
          <div className="bubble-avatar">J</div>
          <div>
            <div className="bubble-meta">Jess 在 {formatTime(moment.time)} 留下评论</div>
            <div className="bubble-text"><span>{moment.emoji}</span> <span>{moment.text}</span></div>
          </div>
        </div>

        <div className={`play-toggle ${isPaused ? "visible" : ""}`} aria-hidden="true" />

        <div
          className={`progress-wrap ${isDragging ? "hidden-while-dragging" : ""}`}
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
            if (moment.exists && Math.abs(currentTime - moment.time) < 1) forceBubble();
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

        {showLongPressTip && (
          <div className="longpress-tip">
            <span>添加时刻评论</span>
            <small>{formatTime(currentTime)}</small>
          </div>
        )}

        {panel === "share" && (
          <ShareSheet
            people={people}
            time={formatTime(currentTime)}
            onClose={closePanels}
            onComposer={() => setPanel("composer")}
          />
        )}

        {panel === "composer" && (
          <ComposerSheet
            activeItem={activeItem}
            time={formatTime(currentTime)}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            comment={comment}
            setComment={setComment}
            onBack={() => setPanel("share")}
            onSend={saveMoment}
          />
        )}

        {toast && <div className="toast">{toast}</div>}
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

function ShareSheet({ people, time, onClose, onComposer }) {
  return (
    <section className="sheet" aria-label="发送给">
      <div className="sheet-handle" />
      <div className="sheet-head">
        <button className="sheet-search" aria-label="搜索">⌕</button>
        <strong>发送给</strong>
        <button className="sheet-close" aria-label="关闭" onClick={onClose}>×</button>
      </div>

      <button className="moment-card" type="button" onClick={onComposer}>
        <span className="moment-card-icon">💬</span>
        <span>
          <strong>添加时刻评论</strong>
          <small>把评论留在这一秒 <b>{time}</b></small>
        </span>
      </button>

      <div className="people-row">
        {people.map((person) => (
          <button key={person.name} className={`person ${person.selected ? "selected" : ""} ${person.avatar === "+" ? "add" : ""}`} type="button">
            <span>{person.avatar}</span>
            <small>{person.name}</small>
          </button>
        ))}
      </div>

      <div className="share-actions">
        {[
          ["↗", "转发"],
          ["✓", "短信"],
          ["🔗", "复制链接"],
          ["✈", "Telegram"],
        ].map(([icon, label]) => (
          <button key={label} type="button">
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function ComposerSheet({ activeItem, time, selectedEmoji, setSelectedEmoji, comment, setComment, onBack, onSend }) {
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
          <button key={emoji} className={selectedEmoji === emoji ? "active" : ""} type="button" onClick={() => setSelectedEmoji(emoji)}>
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
