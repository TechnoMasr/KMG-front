import ChatHeader from "./sections/ChatHeader";
import ChatMsgs from "./sections/ChatMsgs";
import ChatInput from "./sections/ChatInput";
import { getMsgs, getNewMsgs, sendMsg } from "@/services/chatServices";
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState, useCallback, useMemo } from "react";
import ImageViewer from "./sections/ImageViewer";

const Chat = () => {
  const [viewerImage, setViewerImage] = useState(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);

  const openViewer = useCallback((imgUrl) => {
    setViewerImage(imgUrl);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerImage(null);
  }, []);

  const queryClient = useQueryClient();

  // Get messages with infinite scroll
  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["get_msgs"],
    queryFn: ({ pageParam = 1 }) => getMsgs({ page: pageParam, per_page: 20 }),
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage;
      // Check if there's a next page
      if (meta?.current_page < meta?.last_page) {
        return meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    
  });

  // Flatten all messages from all pages
  const allMessages = useMemo(() => {
    if (!infiniteData?.pages) return [];
    const combined = infiniteData.pages.flatMap((page) => page.messages);

    // فرز تنازلي (الأحدث أولاً في الـ Array) بناءً على التاريخ أو الـ ID
    return combined.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  }, [infiniteData]);

  // Get the last message ID from the newest message (first in array)
  const lastMessageId = allMessages[0]?.id ?? null;

  // Poll for new messages
  const { data: newMsgs } = useQuery({
    queryKey: ["get_new_msgs", lastMessageId],
    queryFn: () => getNewMsgs(lastMessageId),
    enabled: !!lastMessageId,
    refetchInterval: 20000,
  });

  // Handle new messages from polling
  useEffect(() => {
    if (!newMsgs || newMsgs.length === 0) return;

    console.log("new messages 👀", newMsgs);

    // Update the first page with new messages
    queryClient.setQueryData(["get_msgs"], (oldData) => {
      if (!oldData) return oldData;

      const sortedNewMsgs = [...newMsgs].reverse();

      return {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
          // Only update the first page
          if (index === 0) {
            return {
              ...page,
              messages: [...sortedNewMsgs, ...page.messages],
            };
          }
          return page;
        }),
      };
    });

    // Trigger scroll to bottom for new messages
    setShouldScrollToBottom(true);
  }, [newMsgs, queryClient]);

  // Send message mutation
  const sendMsgMutation = useMutation({
    mutationFn: sendMsg,

    onMutate: async (formData) => {
      await queryClient.cancelQueries(["get_msgs"]);

      const tempId = `temp-${Date.now()}`;

      const optimisticMsg = {
        id: tempId,
        from: "user",
        message: formData.get("message") || "",
        file_path: null,
        file_type: formData.get("file")?.type,
        created_at: new Date().toISOString(),
        pending: true,
        error: false,
        _formData: formData,
      };

      // Add optimistic message to the first page
      queryClient.setQueryData(["get_msgs"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                messages: [optimisticMsg, ...page.messages],
              };
            }
            return page;
          }),
        };
      });

      // Trigger scroll to bottom
      setShouldScrollToBottom(true);

      return { tempId };
    },

    onError: (_err, _vars, context) => {
      // Mark message as error
      queryClient.setQueryData(["get_msgs"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                messages: page.messages.map((msg) =>
                  msg.id === context.tempId
                    ? { ...msg, pending: false, error: true }
                    : msg,
                ),
              };
            }
            return page;
          }),
        };
      });
    },

    onSuccess: (response, _vars, context) => {
      queryClient.setQueryData(["get_msgs"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              // استبدال الرسالة الوهمية (temp) بالرسالة الحقيقية من السيرفر
              const filtered = page.messages.filter(
                (msg) => msg.id !== context.tempId,
              );
              return {
                ...page,
                messages: response ? [response, ...filtered] : filtered,
              };
            }
            return page;
          }),
        };
      });
    },
  });

  const retrySend = useCallback(
    (formData) => {
      // Remove the error message before retrying
      queryClient.setQueryData(["get_msgs"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                messages: page.messages.filter((msg) => !msg.error),
              };
            }
            return page;
          }),
        };
      });

      sendMsgMutation.mutate(formData);
    },
    [sendMsgMutation, queryClient],
  );

  // Load more messages (when scrolling to top)
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      setShouldScrollToTop(true);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset scroll trigger after scroll happens
  const handleScrollComplete = useCallback(() => {
    setShouldScrollToBottom(false);
    setShouldScrollToTop(false);
  }, []);

  return (
    <section className="container py-4 h-[90vh]">
      <div className="mx-auto max-w-3xl h-full rounded-xl flex flex-col overflow-hidden card">
        <ChatHeader />

        <ChatMsgs
          messages={allMessages}
          isLoading={isLoading}
          openViewer={openViewer}
          onRetry={retrySend}
          shouldScrollToBottom={shouldScrollToBottom}
          shouldScrollToTop={shouldScrollToTop}
          onScrollComplete={handleScrollComplete}
          onLoadMore={loadMore}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />

        <ChatInput
          sendMsgMutation={sendMsgMutation}
          isLoading={sendMsgMutation.isPending}
        />
      </div>

      <ImageViewer
        open={!!viewerImage}
        image={viewerImage}
        onClose={closeViewer}
      />
    </section>
  );
};

export default Chat;
