import type { LocationMetadata, RoomTypeMetadata } from "../types/common";

export const AUTH_FLOWTYPE = {
  FORGOT: 1,
  SIGN_IN: 2,
  SIGN_UP: 3,
};

export const NOTI_ERROR = "error";
export const NOTI_SUCCESS = "success";
export const DEFAULT_MESSAGE = "Đã xảy ra lỗi.";
export const TYPE_LOG_OUT = 99;

export const RENTER_STEP = {
  PICK_TYPE: 1,
  FILL_INFORMATION: 2,
  FILL_ADDRESS: 3,
  FILL_OWNER: 4,
  CONFIRM: 5,
  SUCCESS: 6,
};

export const MessageTypeEnum = {
  RENT: "RENT",
  CONTACT: "CONTACT",
  NORMAL: "NORMAL",
};

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
}

export const DATE_FORMAT = "YYYY/MM/DD";

export const DOUBLE_DOT = " : ";

export const USER_ROLE = {
  ADMIN: 0,
  OWNER: 1,
  USER: 2,
};

export const RENT_TYPE = {
  MOTEL: "motel",
  APARTMENT: "apartment",
  OFFICE: "office",
  FULL_HOUSE: "full_house",
  VENUE: "venue",
} as const;

export const LOCATION_TYPE = {
  NORTH: "north",
  CENTRAL: "central",
  SOUTH: "south",
} as const;

export const ROOM_TYPE_METADATA: Record<string, RoomTypeMetadata> = {
  motel: {
    id: "motel",
    name: "Phòng trọ",
    title: "Phòng trọ tiện nghi, giá rẻ cho sinh viên và người lao động",
    description:
      "Khám phá các phòng trọ giá rẻ, lý tưởng cho sinh viên và người lao động với đầy đủ tiện nghi cơ bản như máy lạnh, wifi tốc độ cao, và an ninh 24/7. Vị trí thuận tiện gần trường học, chợ búa, và phương tiện công cộng, giúp bạn tiết kiệm thời gian di chuyển và tập trung vào công việc hoặc học tập.",
    image: "https://picsum.photos/1200/800?random=motel1",
  },
  apartment: {
    id: "apartment",
    name: "Căn hộ",
    title: "Căn hộ hiện đại với view đẹp và tiện ích cao cấp",
    description:
      "Trải nghiệm cuộc sống đẳng cấp với các căn hộ hiện đại, được trang bị nội thất cao cấp, view panorama tuyệt đẹp, và tiện ích sang trọng như hồ bơi, gym, và dịch vụ quản lý chuyên nghiệp. Phù hợp cho những ai tìm kiếm không gian sống thoải mái, riêng tư, và gần các trung tâm thương mại, văn phòng.",
    image: "https://picsum.photos/1200/800?random=apartment1",
  },
  ofice:
  {
    id: "office",
    name: "Văn phòng",
    title: "Văn phòng chuyên nghiệp cho doanh nghiệp và freelancer",
    description:
      "Thuê văn phòng hiện đại với thiết kế chuyên nghiệp, đầy đủ tiện ích như wifi siêu tốc, phòng họp, và khu vực nghỉ ngơi. Lý tưởng cho doanh nghiệp nhỏ, startup, hoặc freelancer cần không gian làm việc tập trung, sáng tạo, và kết nối mạng lưới kinh doanh rộng lớn.",
    image: "https://picsum.photos/1200/800?random=office1",
  },
  full_house: {
    id: "full_house",
    name: "Nhà nguyên căn",
    title: "Nhà nguyên căn rộng rãi cho gia đình và nhóm lớn",
    description:
      "Thuê nhà nguyên căn rộng rãi với nhiều phòng ngủ, sân vườn thoáng đãng, và tiện ích gia đình như bếp đầy đủ, máy giặt, và chỗ đậu xe an toàn. Hoàn hảo cho gia đình đông người, nhóm bạn, hoặc những ai muốn không gian sống tự do, yên bình, và gần các khu vui chơi, trường học.",
    image: "https://picsum.photos/1200/800?random=house1",
  },
  venue: {
    id: "venue",
    name: "Địa điểm tổ chức",
    title: "Địa điểm tổ chức sự kiện sang trọng cho tiệc cưới và hội nghị",
    description:
      "Đặt địa điểm tổ chức sự kiện đẳng cấp với không gian rộng lớn, trang trí sang trọng, và dịch vụ hậu cần hoàn hảo cho tiệc cưới, hội nghị, hoặc sự kiện đặc biệt. Bao gồm âm thanh, ánh sáng chuyên nghiệp, và đội ngũ hỗ trợ tận tình, đảm bảo sự kiện của bạn trở nên khó quên.",
    image: "https://picsum.photos/1200/800?random=venue1",
  },
};

ROOM_TYPE_METADATA["room"] = ROOM_TYPE_METADATA["motel"];
ROOM_TYPE_METADATA["office"] = ROOM_TYPE_METADATA["ofice"];
ROOM_TYPE_METADATA["house"] = ROOM_TYPE_METADATA["full_house"];
ROOM_TYPE_METADATA["shop"] = ROOM_TYPE_METADATA["venue"];
ROOM_TYPE_METADATA["dorm"] = ROOM_TYPE_METADATA["motel"]; // Fallback for dorm

export const LOCATION_METADATA: Record<string, LocationMetadata> = {
  north: {
    id: "north",
    name: "Miền Bắc",
    title: "Miền Bắc: Văn hóa đặc sắc với Hà Nội cổ kính và Sapa mù sương",
    description:
      "Khám phá miền Bắc với văn hóa đặc sắc, thủ đô Hà Nội cổ kính, và các điểm du lịch nổi tiếng như Sapa mù sương, vịnh Hạ Long hùng vĩ. Phù hợp cho những ai yêu thích lịch sử, ẩm thực truyền thống, và khí hậu mát mẻ, lý tưởng cho việc thuê phòng nghỉ dưỡng hoặc làm việc dài hạn.",
    image: "https://picsum.photos/1200/800?random=north1",
  },
  central: {
    id: "central",
    name: "Miền Trung",
    title: "Miền Trung: Biển xanh với Đà Nẵng hiện đại và Hội An cổ xưa",
    description:
      "Trải nghiệm miền Trung with biển xanh ngát, thành phố Đà Nẵng hiện đại, và phố cổ Hội An lãng mạn. Nơi lý tưởng cho du lịch biển, nghỉ dưỡng, hoặc thuê văn phòng gần các khu công nghiệp. Khám phá nền ẩm thực đặc trưng và văn hóa đa dạng, phù hợp cho cả gia đình và doanh nghiệp.",
    image: "https://picsum.photos/1200/800?random=central1",
  },
  south: {
    id: "south",
    name: "Miền Nam",
    title: "Miền Nam: Phát triển năng động với TP.HCM sôi động",
    description:
      "Đặt chân đến miền Nam phát triển năng động với TP.HCM sôi động, trung tâm kinh tế của Việt Nam. Phù hợp cho thuê căn hộ cao cấp, văn phòng hiện đại, hoặc địa điểm tổ chức sự kiện. Khám phá văn hóa sông nước, chợ nổi, và cuộc sống đô thị nhịp nhàng, lý tưởng cho những ai tìm kiếm cơ hội kinh doanh và giải trí.",
    image: "https://picsum.photos/1200/800?random=south1",
  },

};
