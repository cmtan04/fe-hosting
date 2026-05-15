import type { ProfileLocationFilter } from "@common/types/profile";
import search from "@assets/lotties/home/search.json";
import call from "@assets/lotties/home/call.json";
import find from "@assets/lotties/home/find.json";
import docs from "@assets/lotties/home/docs.json";



export const QUICK_FILTERS: Array<{
  label: string;
  filter: ProfileLocationFilter;
}> = [
  { label: "Hà Nội", filter: { searchValue: "Hà Nội" } },
  { label: "Quận Đống Đa", filter: { searchValue: "Quận Đống Đa" } },
  { label: "Phường Cát Linh", filter: { searchValue: "Phường Cát Linh" } },
  { label: "Đường Giải Phóng", filter: { searchValue: "Đường Giải Phóng" } },
];

export const REGION_FILTERS = [
  { label: "Miền Bắc", value: "north" },
  { label: "Miền Trung", value: "central" },
  { label: "Miền Nam", value: "south" },
];

export const HOME_STATS = [
  { value: "1.2k+", label: "phòng đang chờ thuê" },
  { value: "48h", label: "cập nhật tin mới" },
  { value: "4.8/5", label: "độ hài lòng người thuê" },
];
export const supportSteps = [
    {
      id: 1,
      title: "Tìm kiếm & chọn chỗ ở",
      description:
        "Tìm kiếm chỗ ở phù hợp theo khu vực, loại hình, mức giá hoặc xem trực tiếp trên bản đồ.",
      icon: search,
    },
    {
      id: 2,
      title: "Liên hệ & đặt lịch",
      description:
        "Nhắn tin trực tiếp với chủ nhà và đặt lịch xem phòng nhanh chóng trên hệ thống.",
      icon: call,
    },
    {
      id: 3,
      title: "Hỗ trợ trong quá trình thuê",
      description:
        "Đội ngũ hỗ trợ sẵn sàng xử lý các vấn đề phát sinh trong quá trình thuê.",
      icon: find,
    },
    {
      id: 4,
      title: "Hướng dẫn & chăm sóc sau thuê",
      description:
        "Cung cấp tài liệu hướng dẫn và hỗ trợ lâu dài sau khi hoàn tất thuê.",
      icon: docs,
    },
  ];

export const FEATURED_SECTIONS: Array<{
  key: string;
  title: string;
  description: string;
  filter: ProfileLocationFilter;
  ctaLabel: string;
}> = [
  {
    key: "featured",
    title: "Phòng nổi bật",
    description:
      "Các tin có đánh giá tốt, hình ảnh rõ và mức giá dễ chốt nhanh.",
    filter: { page: 1, limit: 4, sortBy: "locationRate", sortOrder: "DESC" },
    ctaLabel: "Xem tất cả phòng nổi bật",
  },
  {
    key: "budget",
    title: "Giá tốt hôm nay",
    description:
      "Sàng lọc các phòng dễ tiếp cận để người thuê so sánh trong một lượt.",
    filter: {
      page: 1,
      limit: 4,
      sortBy: "locationPrice",
      sortOrder: "ASC",
    },
    ctaLabel: "Xem tất cả phòng giá tốt",
  },
];

export const HOME_PAGE_QUERY_KEYS = {
  heroLocations: "home-hero-locations",
  featuredLocations: "home-featured-locations",
} as const;
