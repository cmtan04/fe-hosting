import { message } from "antd";
import { useCallback } from "react";

/**
 * Custom hook to handle sharing functionality
 * It uses the native Web Share API if available, 
 * otherwise it falls back to copying the link to the clipboard.
 */
export const useShare = () => {
  const handleShare = useCallback(async (code: string, name?: string) => {
    const shareUrl = `${globalThis.location.origin}/home/locations/${code}`;
    const shareTitle = name ? `Chia sẻ: ${name}` : "Chia sẻ phòng";
    const shareText = `Xem phòng tuyệt vời này trên Hosting: ${shareTitle}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // If the user cancelled or share failed, we don't show an error
        // but we can log it if needed
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        message.success("Đã sao chép liên kết vào bộ nhớ tạm!");
      } catch (error) {
        console.error("Failed to copy link:", error);
        message.error("Không thể sao chép liên kết. Vui lòng thử lại.");
      }
    }
  }, []);

  return { handleShare };
};
