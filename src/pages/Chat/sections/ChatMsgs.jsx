import { useEffect, useRef, useMemo, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { AiOutlineClockCircle, AiOutlineReload } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ChatMsgs = ({
  messages,
  isLoading,
  openViewer,
  onRetry,
  shouldScrollToBottom,
  shouldScrollToTop,
  onScrollComplete,
  onLoadMore,
  hasMore,
  isLoadingMore,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);
  const previousScrollHeight = useRef(0);

  // عكس الرسائل للعرض (الأحدث في الأسفل)
  const displayMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages]);

  // دالة التمرير للأسفل
  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  }, []);

  // الحفاظ على موضع التمرير عند تحميل رسائل قديمة (Pagination)
  const maintainScrollPosition = useCallback(() => {
    if (containerRef.current && previousScrollHeight.current > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeight.current;
      containerRef.current.scrollTop += scrollDiff;
    }
  }, []);

  // معالجة التمرير اللانهائي
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingMore) return;

    const { scrollTop } = containerRef.current;

    if (scrollTop < 100) {
      previousScrollHeight.current = containerRef.current.scrollHeight;
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  // 1. التمرير للأسفل فوراً عند فتح الشات لأول مرة
  useEffect(() => {
    if (!isLoading && messages.length > 0 && isInitialMount.current) {
      const timer = setTimeout(() => {
        scrollToBottom("instant");
        isInitialMount.current = false;
      }, 150); // تأخير بسيط لضمان رندر العناصر
      return () => clearTimeout(timer);
    }
  }, [isLoading, messages.length, scrollToBottom]);

  // 2. التمرير للأسفل عند إرسال رسالة جديدة أو وصول رسائل Polling
  useEffect(() => {
    if (shouldScrollToBottom && !isLoading) {
      scrollToBottom("smooth");

      if (onScrollComplete) {
        const timer = setTimeout(() => {
          onScrollComplete();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [shouldScrollToBottom, isLoading, onScrollComplete, scrollToBottom]);

  // 3. الحفاظ على الموضع عند الـ Pagination للأعلى
  useEffect(() => {
    if (shouldScrollToTop && !isLoadingMore && !shouldScrollToBottom) {
      maintainScrollPosition();

      if (onScrollComplete) {
        const timer = setTimeout(() => {
          onScrollComplete();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [
    shouldScrollToTop,
    isLoadingMore,
    shouldScrollToBottom,
    onScrollComplete,
    maintainScrollPosition,
  ]);

  const formatChatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.replace(" ", "T"));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline wrap-break-word"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const renderOrderCard = (order) => {
    if (!order) return null;
    const product = order.product;

    return (
      <div className="bg-black/20 rounded-lg p-3 space-y-2 mt-2">
        <div className="flex flex-col md:flex-row items-center gap-2">
          {product?.game_icon && (
            <div className="w-full h-24 md:w-10 md:h-10 rounded overflow-hidden">
              <img
                loading="lazy"
                src={product.game_icon}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold max-w-xs">{product?.title}</p>
            <div className="text-xs text-white/70 flex flex-wrap items-center gap-1">
              <p>{t("chatMsgs.orderCode")}:</p>
              <span className="font-semibold break-all">
                {order.order_code}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="text-white/70 flex flex-wrap items-center gap-1">
            <p>{t("chatMsgs.price")}:</p>
            <span className="font-semibold">
              {order.total_price} {order.currency}
            </span>
          </div>
          <span className={`px-2 py-1 font-semibold rounded-lg bg-accent/20`}>
            {order.status}
          </span>
        </div>
      </div>
    );
  };

  const isImageFile = (fileType) => {
    return fileType?.startsWith("image/");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-end gap-3 px-2 py-4">
        <Skeleton className="h-20 w-1/4 rounded-xl" />
        <Skeleton className="h-32 w-1/2 rounded-xl" />
        <Skeleton className="h-40 w-2/3 rounded-xl" />
        <Skeleton className="h-24 w-1/3 rounded-xl" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-4">
        <p className="text-center text-white/50">{t("chatMsgs.noMessages")}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-2 py-4 space-y-3 custom_scrollbar"
      onScroll={handleScroll}
    >
      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && messages.length > 15 && (
        <div className="flex justify-center py-2">
          <p className="text-xs text-white/30">
            {t("chatMsgs.noMoreMessages")}
          </p>
        </div>
      )}

      {displayMessages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.from === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 space-y-2 ${
              msg.from === "user"
                ? "bg-primary text-white rounded-ee-none"
                : "bg-muted text-white rounded-es-none"
            }`}
          >
            {msg.message && (
              <p className="whitespace-pre-wrap wrap-break-word text-sm">
                {linkifyText(msg.message)}
              </p>
            )}

            {msg.file_path && (
              <div className="mt-2">
                {isImageFile(msg.file_type) ? (
                  <img
                    loading="lazy"
                    src={msg.file_path}
                    alt={msg.file_name}
                    className="rounded-lg max-h-72 w-full object-cover cursor-pointer hover:opacity-90"
                    onLoad={() => {
                      // إذا كنا في أول تحميل أو نرسل رسالة، نضمن بقاء السكرول تحت بعد ظهور الصورة
                      if (isInitialMount.current || shouldScrollToBottom) {
                        scrollToBottom("instant");
                      }
                    }}
                    onClick={() => openViewer(msg.file_path)}
                  />
                ) : (
                  <a
                    href={msg.file_path}
                    download={msg.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg text-sm hover:bg-black/30 transition-colors"
                  >
                    <span>📎</span>
                    <span className="truncate max-w-[150px]">
                      {msg.file_name}
                    </span>
                    {msg.file_size && (
                      <span className="text-[10px] text-white/50">
                        ({(msg.file_size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </a>
                )}
              </div>
            )}

            {renderOrderCard(msg.order)}

            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="text-[9px] text-white/60 bg-black/20 px-2 py-1 rounded-lg">
                {formatChatTime(msg.created_at)}
              </span>

              {msg.pending && (
                <AiOutlineClockCircle
                  className="text-white/70 animate-pulse"
                  size={12}
                />
              )}

              {msg.error && (
                <div className="flex items-center gap-1">
                  <MdErrorOutline className="text-red-400" size={14} />
                  <button
                    onClick={() => onRetry(msg._formData)}
                    className="text-[10px] text-red-300 hover:text-red-200 flex items-center gap-1 underline"
                  >
                    <AiOutlineReload size={10} />
                    {t("chatMsgs.retry")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMsgs;
