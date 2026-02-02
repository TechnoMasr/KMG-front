import { useState } from "react";
import {
  HiOutlinePaperAirplane,
  HiOutlinePhotograph,
  HiOutlinePaperClip,
} from "react-icons/hi";

const ChatInput = ({ sendMsgMutation, isLoading }) => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    const formData = new FormData();

    if (input.trim()) {
      formData.append("message", input);
    }

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (selectedOrder) {
      formData.append("order_id", selectedOrder);
    }

    try {
      await sendMsgMutation.mutateAsync(formData);
      setInput("");
      setSelectedFile(null);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="pt-3 border-t border-white/10">
      {/* Show selected file preview */}
      {selectedFile && (
        <div className="mb-2 flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg text-sm">
          <span>📎 {selectedFile.name}</span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Image */}
        <label className="cursor-pointer text-white/70 hover:text-white">
          <HiOutlinePhotograph className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
            disabled={isLoading}
          />
        </label>

        {/* File */}
        <label className="cursor-pointer text-white/70 hover:text-white">
          <HiOutlinePaperClip className="w-5 h-5" />
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>

        <input
          type="text"
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
          disabled={isLoading}
          className="flex-1 bg-[#2a2b30] text-white text-sm px-4 py-2 rounded-full outline-none disabled:opacity-50"
        />

        <button
          onClick={sendMessage}
          disabled={isLoading || (!input.trim() && !selectedFile)}
          className="bg-primary hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <HiOutlinePaperAirplane className="w-[18px] h-[18px] rotate-45 rtl:-rotate-45" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
