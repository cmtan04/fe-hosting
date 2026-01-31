interface RoomListProps {
    id: string;
    rentType: string;
    location: string;
    address: string;
    price: number;
    ownerName: string;
    ownerId: string;
    title: string;
    description: string;
    mainImage?: string;
    images?: string[];
    utilities?: string[];
    area?: number; // m²
    bedrooms?: number;
    bathrooms?: number;
    rating?: number;
    reviews?: number;
}

interface UserProps {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    role: 'owner' | 'renter';
    verified: boolean;
    address?: string;
}

interface RoomTypeProps {
    id: string;
    name: string;
    title: string;
    description: string;
    image?: string;
}

interface LocationProps {
    id: string;
    name: string;
    title: string;
    description: string;
    image?: string;
}

export const items: RoomListProps[] = [
    {
        id: "1",
        rentType: "motel",
        location: "north",
        address: "123 Đường Láng, Đống Đa, Hà Nội",
        price: 300,
        ownerName: "Nguyễn Văn A",
        ownerId: "owner1",
        title: "Phòng trọ tiện nghi gần Đại học Quốc gia Hà Nội",
        description: "Phòng trọ đầy đủ tiện nghi, gần trung tâm thành phố, an ninh tốt, có chỗ đậu xe.",
        mainImage: "https://picsum.photos/800/600?random=1",
        images: [
            "https://picsum.photos/800/600?random=1",
            "https://picsum.photos/800/600?random=2",
            "https://picsum.photos/800/600?random=3",
            "https://picsum.photos/800/600?random=4",
        ],
        utilities: ["Máy lạnh", "Wifi tốc độ cao", "Tủ lạnh", "Máy giặt", "An ninh 24/7", "Chỗ đậu xe"],
        area: 25,
        bedrooms: 1,
        bathrooms: 1,
        rating: 4.5,
        reviews: 12,
    },
    {
        id: "2",
        rentType: "apartment",
        location: "south",
        address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
        price: 800,
        ownerName: "Trần Thị B",
        ownerId: "owner2",
        title: "Căn hộ cao cấp view sông Sài Gòn",
        description: "Căn hộ 2 phòng ngủ với view sông tuyệt đẹp, đầy đủ nội thất cao cấp, gần trung tâm thương mại.",
        mainImage: "https://picsum.photos/800/600?random=5",
        images: [
            "https://picsum.photos/800/600?random=5",
            "https://picsum.photos/800/600?random=6",
            "https://picsum.photos/800/600?random=7",
            "https://picsum.photos/800/600?random=8",
        ],
        utilities: ["Máy lạnh", "Wifi", "Tủ lạnh", "Máy giặt", "Bể bơi", "Gym", "An ninh 24/7", "Chỗ đậu xe"],
        area: 75,
        bedrooms: 2,
        bathrooms: 2,
        rating: 4.8,
        reviews: 25,
    },
    {
        id: "3",
        rentType: "office",
        location: "central",
        address: "789 Đường Trần Phú, Hải Châu, Đà Nẵng",
        price: 1500,
        ownerName: "Lê Văn C",
        ownerId: "owner3",
        title: "Văn phòng coworking tại trung tâm Đà Nẵng",
        description: "Văn phòng hiện đại với view biển, phù hợp cho startup và doanh nghiệp nhỏ, đầy đủ tiện ích.",
        mainImage: "https://picsum.photos/800/600?random=9",
        images: [
            "https://picsum.photos/800/600?random=9",
            "https://picsum.photos/800/600?random=10",
            "https://picsum.photos/800/600?random=11",
        ],
        utilities: ["Wifi tốc độ cao", "Máy lạnh", "Phòng họp", "Khu vực nghỉ ngơi", "An ninh 24/7", "Chỗ đậu xe"],
        area: 120,
        bedrooms: 0,
        bathrooms: 2,
        rating: 4.6,
        reviews: 18,
    },
    {
        id: "4",
        rentType: "full-house",
        location: "west",
        address: "321 Đường Nguyễn Trung Trực, Ninh Kiều, Cần Thơ",
        price: 1200,
        ownerName: "Phạm Thị D",
        ownerId: "owner4",
        title: "Nhà nguyên căn vườn tại Cần Thơ",
        description: "Nhà vườn rộng rãi, yên tĩnh, phù hợp cho gia đình, có vườn và hồ bơi nhỏ.",
        mainImage: "https://picsum.photos/800/600?random=12",
        images: [
            "https://picsum.photos/800/600?random=12",
            "https://picsum.photos/800/600?random=13",
            "https://picsum.photos/800/600?random=14",
            "https://picsum.photos/800/600?random=15",
        ],
        utilities: ["Máy lạnh", "Wifi", "Tủ lạnh", "Máy giặt", "Vườn", "Hồ bơi", "An ninh", "Chỗ đậu xe"],
        area: 150,
        bedrooms: 3,
        bathrooms: 2,
        rating: 4.7,
        reviews: 8,
    },
    {
        id: "5",
        rentType: "venue",
        location: "north",
        address: "555 Đường Cầu Giấy, Hà Nội",
        price: 2000,
        ownerName: "Hoàng Văn E",
        ownerId: "owner5",
        title: "Sảnh tiệc cưới sang trọng tại Hà Nội",
        description: "Không gian rộng lớn cho tiệc cưới, hội nghị và sự kiện, trang bị hiện đại.",
        mainImage: "https://picsum.photos/800/600?random=16",
        images: [
            "https://picsum.photos/800/600?random=16",
            "https://picsum.photos/800/600?random=17",
            "https://picsum.photos/800/600?random=18",
        ],
        utilities: ["Âm thanh", "Ánh sáng", "Nhà bếp", "Chỗ đậu xe", "An ninh", "Trang trí"],
        area: 300,
        bedrooms: 0,
        bathrooms: 4,
        rating: 4.9,
        reviews: 35,
    },
    {
        id: "6",
        rentType: "motel",
        location: "central",
        address: "147 Đường Bạch Đằng, Hải Châu, Đà Nẵng",
        price: 250,
        ownerName: "Vũ Thị F",
        ownerId: "owner6",
        title: "Phòng trọ sinh viên gần biển Đà Nẵng",
        description: "Phòng trọ sạch sẽ, gần trường đại học và biển, giá rẻ phù hợp sinh viên.",
        mainImage: "https://picsum.photos/800/600?random=19",
        images: [
            "https://picsum.photos/800/600?random=19",
            "https://picsum.photos/800/600?random=20",
        ],
        utilities: ["Máy lạnh", "Wifi", "Tủ lạnh", "Gần biển", "Gần trường"],
        area: 20,
        bedrooms: 1,
        bathrooms: 1,
        rating: 4.2,
        reviews: 15,
    },
    {
        id: "7",
        rentType: "apartment",
        location: "north",
        address: "369 Đường Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        price: 650,
        ownerName: "Đỗ Văn G",
        ownerId: "owner7",
        title: "Căn hộ studio hiện đại tại Times City",
        description: "Căn hộ studio đầy đủ tiện nghi, nội thất cao cấp, gần trung tâm mua sắm.",
        mainImage: "https://picsum.photos/800/600?random=21",
        images: [
            "https://picsum.photos/800/600?random=21",
            "https://picsum.photos/800/600?random=22",
            "https://picsum.photos/800/600?random=23",
        ],
        utilities: ["Máy lạnh", "Wifi", "Tủ lạnh", "Máy giặt", "Bếp điện", "An ninh 24/7"],
        area: 35,
        bedrooms: 1,
        bathrooms: 1,
        rating: 4.4,
        reviews: 22,
    },
    {
        id: "8",
        rentType: "office",
        location: "south",
        address: "852 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM",
        price: 1800,
        ownerName: "Ngô Thị H",
        ownerId: "owner8",
        title: "Văn phòng hạng A tại trung tâm Sài Gòn",
        description: "Văn phòng cao cấp với view thành phố, đầy đủ tiện ích cho doanh nghiệp.",
        mainImage: "https://picsum.photos/800/600?random=24",
        images: [
            "https://picsum.photos/800/600?random=24",
            "https://picsum.photos/800/600?random=25",
            "https://picsum.photos/800/600?random=26",
        ],
        utilities: ["Wifi tốc độ cao", "Máy lạnh", "Phòng họp", "Pano", "An ninh 24/7", "Nhà hàng"],
        area: 200,
        bedrooms: 0,
        bathrooms: 3,
        rating: 4.7,
        reviews: 28,
    },
    {
        id: "9",
        rentType: "full-house",
        location: "south",
        address: "963 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
        price: 950,
        ownerName: "Trịnh Văn I",
        ownerId: "owner9",
        title: "Nhà phố 3 tầng tại Phú Mỹ Hưng",
        description: "Nhà phố sang trọng với 3 tầng, sân vườn, hồ bơi, khu an ninh cao cấp.",
        mainImage: "https://picsum.photos/800/600?random=27",
        images: [
            "https://picsum.photos/800/600?random=27",
            "https://picsum.photos/800/600?random=28",
            "https://picsum.photos/800/600?random=29",
            "https://picsum.photos/800/600?random=30",
        ],
        utilities: ["Máy lạnh", "Wifi", "Tủ lạnh", "Máy giặt", "Hồ bơi", "Sân vườn", "An ninh 24/7", "Chỗ đậu xe"],
        area: 180,
        bedrooms: 4,
        bathrooms: 3,
        rating: 4.8,
        reviews: 16,
    },
    {
        id: "10",
        rentType: "venue",
        location: "central",
        address: "741 Đường Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
        price: 2500,
        ownerName: "Lý Thị K",
        ownerId: "owner10",
        title: "Resort tổ chức sự kiện view biển",
        description: "Resort sang trọng với bãi biển riêng, phù hợp cho hội nghị, tiệc cưới quy mô lớn.",
        mainImage: "https://picsum.photos/800/600?random=31",
        images: [
            "https://picsum.photos/800/600?random=31",
            "https://picsum.photos/800/600?random=32",
            "https://picsum.photos/800/600?random=33",
            "https://picsum.photos/800/600?random=34",
        ],
        utilities: ["Bãi biển", "Hồ bơi", "Âm thanh", "Ánh sáng", "Nhà bếp", "Chỗ đậu xe", "An ninh"],
        area: 500,
        bedrooms: 0,
        bathrooms: 6,
        rating: 4.9,
        reviews: 42,
    },
    {
        id: "11",
        rentType: "motel",
        location: "west",
        address: "258 Đường Nguyễn Văn Cừ, An Giang",
        price: 200,
        ownerName: "Tô Văn L",
        ownerId: "owner11",
        title: "Phòng trọ giá rẻ tại Long Xuyên",
        description: "Phòng trọ đơn giản, sạch sẽ, giá rẻ phù hợp công nhân và người lao động.",
        mainImage: "https://picsum.photos/800/600?random=35",
        images: [
            "https://picsum.photos/800/600?random=35",
        ],
        utilities: ["Máy lạnh", "Wifi", "Gần chợ"],
        area: 18,
        bedrooms: 1,
        bathrooms: 1,
        rating: 3.8,
        reviews: 7,
    },
    {
        id: "12",
        rentType: "apartment",
        location: "north",
        address: "159 Đường Xuân Thủy, Cầu Giấy, Hà Nội",
        price: 750,
        ownerName: "Mai Thị M",
        ownerId: "owner12",
        title: "Căn hộ dịch vụ tại Ciputra",
        description: "Căn hộ đầy đủ tiện nghi, nội thất cao cấp, dịch vụ quản lý chuyên nghiệp.",
        mainImage: "https://picsum.photos/800/600?random=36",
        images: [
            "https://picsum.photos/800/600?random=36",
            "https://picsum.photos/800/600?random=37",
            "https://picsum.photos/800/600?random=38",
        ],
        utilities: ["Máy lạnh", "Wifi", "Tủ lạnh", "Máy giặt", "Dọn phòng", "An ninh 24/7", "Gym"],
        area: 65,
        bedrooms: 2,
        bathrooms: 1,
        rating: 4.5,
        reviews: 31,
    },
];

export const users: UserProps[] = [
    {
        id: "owner1",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0123 456 789",
        avatar: "https://picsum.photos/100/100?random=user1",
        role: "owner",
        verified: true,
        address: "Hà Nội",
    },
    {
        id: "owner2",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0987 654 321",
        avatar: "https://picsum.photos/100/100?random=user2",
        role: "owner",
        verified: true,
        address: "TP.HCM",
    },
    {
        id: "owner3",
        name: "Lê Văn C",
        email: "levanc@example.com",
        phone: "0912 345 678",
        avatar: "https://picsum.photos/100/100?random=user3",
        role: "owner",
        verified: true,
        address: "Đà Nẵng",
    },
    {
        id: "owner4",
        name: "Phạm Thị D",
        email: "phamthid@example.com",
        phone: "0888 999 000",
        avatar: "https://picsum.photos/100/100?random=user4",
        role: "owner",
        verified: false,
        address: "Cần Thơ",
    },
    {
        id: "owner5",
        name: "Hoàng Văn E",
        email: "hoangvane@example.com",
        phone: "0777 666 555",
        avatar: "https://picsum.photos/100/100?random=user5",
        role: "owner",
        verified: true,
        address: "Hà Nội",
    },
    {
        id: "owner6",
        name: "Vũ Thị F",
        email: "vuthif@example.com",
        phone: "0666 555 444",
        avatar: "https://picsum.photos/100/100?random=user6",
        role: "owner",
        verified: true,
        address: "Đà Nẵng",
    },
    {
        id: "owner7",
        name: "Đỗ Văn G",
        email: "dovang@example.com",
        phone: "0555 444 333",
        avatar: "https://picsum.photos/100/100?random=user7",
        role: "owner",
        verified: true,
        address: "Hà Nội",
    },
    {
        id: "owner8",
        name: "Ngô Thị H",
        email: "ngothih@example.com",
        phone: "0444 333 222",
        avatar: "https://picsum.photos/100/100?random=user8",
        role: "owner",
        verified: true,
        address: "TP.HCM",
    },
    {
        id: "owner9",
        name: "Trịnh Văn I",
        email: "trinhvani@example.com",
        phone: "0333 222 111",
        avatar: "https://picsum.photos/100/100?random=user9",
        role: "owner",
        verified: true,
        address: "TP.HCM",
    },
    {
        id: "owner10",
        name: "Lý Thị K",
        email: "lythik@example.com",
        phone: "0222 111 000",
        avatar: "https://picsum.photos/100/100?random=user10",
        role: "owner",
        verified: true,
        address: "Đà Nẵng",
    },
    {
        id: "owner11",
        name: "Tô Văn L",
        email: "tovanl@example.com",
        phone: "0111 000 999",
        avatar: "https://picsum.photos/100/100?random=user11",
        role: "owner",
        verified: false,
        address: "An Giang",
    },
    {
        id: "owner12",
        name: "Mai Thị M",
        email: "maithim@example.com",
        phone: "0999 888 777",
        avatar: "https://picsum.photos/100/100?random=user12",
        role: "owner",
        verified: true,
        address: "Hà Nội",
    },
];

export const rentTypes = [
    { id: "motel", name: "Phòng trọ", icon: "🏠", description: "Phòng trọ giá rẻ, phù hợp sinh viên và người lao động" },
    { id: "apartment", name: "Căn hộ", icon: "🏢", description: "Căn hộ hiện đại với đầy đủ tiện nghi" },
    { id: "office", name: "Văn phòng", icon: "🏢", description: "Không gian làm việc chuyên nghiệp" },
    { id: "full-house", name: "Nhà nguyên căn", icon: "🏘️", description: "Nhà ở hoàn chỉnh cho gia đình" },
    { id: "venue", name: "Địa điểm tổ chức", icon: "🎉", description: "Không gian cho sự kiện và tiệc tùng" },
];

export const amenities = [
    { id: "wifi", name: "Wifi tốc độ cao", icon: "📶", category: "basic" },
    { id: "ac", name: "Máy lạnh", icon: "❄️", category: "basic" },
    { id: "parking", name: "Chỗ đậu xe", icon: "🚗", category: "basic" },
    { id: "security", name: "An ninh 24/7", icon: "🔒", category: "basic" },
    { id: "pool", name: "Hồ bơi", icon: "🏊", category: "luxury" },
    { id: "gym", name: "Phòng gym", icon: "💪", category: "luxury" },
    { id: "garden", name: "Sân vườn", icon: "🌳", category: "luxury" },
    { id: "kitchen", name: "Bếp", icon: "👨‍🍳", category: "basic" },
    { id: "laundry", name: "Máy giặt", icon: "👕", category: "basic" },
    { id: "pet-friendly", name: "Cho phép nuôi pet", icon: "🐕", category: "other" },
];

export const priceRanges = [
    { id: "under-300", label: "Dưới 300k", min: 0, max: 300 },
    { id: "300-500", label: "300k - 500k", min: 300, max: 500 },
    { id: "500-800", label: "500k - 800k", min: 500, max: 800 },
    { id: "800-1200", label: "800k - 1200k", min: 800, max: 1200 },
    { id: "1200-2000", label: "1200k - 2000k", min: 1200, max: 2000 },
    { id: "over-2000", label: "Trên 2000k", min: 2000, max: Infinity },
];

export const areaRanges = [
    { id: "under-20", label: "Dưới 20m²", min: 0, max: 20 },
    { id: "20-50", label: "20m² - 50m²", min: 20, max: 50 },
    { id: "50-100", label: "50m² - 100m²", min: 50, max: 100 },
    { id: "100-200", label: "100m² - 200m²", min: 100, max: 200 },
    { id: "over-200", label: "Trên 200m²", min: 200, max: Infinity },
];

export const sortOptions = [
    { id: "price-asc", label: "Giá tăng dần", field: "price", order: "asc" },
    { id: "price-desc", label: "Giá giảm dần", field: "price", order: "desc" },
    { id: "rating-desc", label: "Đánh giá cao", field: "rating", order: "desc" },
    { id: "area-desc", label: "Diện tích lớn", field: "area", order: "desc" },
    { id: "newest", label: "Mới nhất", field: "id", order: "desc" },
];

export const roomTypeProps: RoomTypeProps[] = [
    {
        id: "motel",
        name: "Phòng trọ",
        title: "Phòng trọ tiện nghi, giá rẻ cho sinh viên và người lao động",
        description: "Khám phá các phòng trọ giá rẻ, lý tưởng cho sinh viên và người lao động với đầy đủ tiện nghi cơ bản như máy lạnh, wifi tốc độ cao, và an ninh 24/7. Vị trí thuận tiện gần trường học, chợ búa, và phương tiện công cộng, giúp bạn tiết kiệm thời gian di chuyển và tập trung vào công việc hoặc học tập.",
        image: "https://picsum.photos/1200/800?random=motel1",
    },
    {
        id: "apartment",
        name: "Căn hộ",
        title: "Căn hộ hiện đại với view đẹp và tiện ích cao cấp",
        description: "Trải nghiệm cuộc sống đẳng cấp với các căn hộ hiện đại, được trang bị nội thất cao cấp, view panorama tuyệt đẹp, và tiện ích sang trọng như hồ bơi, gym, và dịch vụ quản lý chuyên nghiệp. Phù hợp cho những ai tìm kiếm không gian sống thoải mái, riêng tư, và gần các trung tâm thương mại, văn phòng.",
        image: "https://picsum.photos/1200/800?random=apartment1",
    },
    {
        id: "office",
        name: "Văn phòng",
        title: "Văn phòng chuyên nghiệp cho doanh nghiệp và freelancer",
        description: "Thuê văn phòng hiện đại với thiết kế chuyên nghiệp, đầy đủ tiện ích như wifi siêu tốc, phòng họp, và khu vực nghỉ ngơi. Lý tưởng cho doanh nghiệp nhỏ, startup, hoặc freelancer cần không gian làm việc tập trung, sáng tạo, và kết nối mạng lưới kinh doanh rộng lớn.",
        image: "https://picsum.photos/1200/800?random=office1",
    },
    {
        id: "full-house",
        name: "Nhà nguyên căn",
        title: "Nhà nguyên căn rộng rãi cho gia đình và nhóm lớn",
        description: "Thuê nhà nguyên căn rộng rãi với nhiều phòng ngủ, sân vườn thoáng đãng, và tiện ích gia đình như bếp đầy đủ, máy giặt, và chỗ đậu xe an toàn. Hoàn hảo cho gia đình đông người, nhóm bạn, hoặc những ai muốn không gian sống tự do, yên bình, và gần các khu vui chơi, trường học.",
        image: "https://picsum.photos/1200/800?random=house1",
    },
    {
        id: "venue",
        name: "Địa điểm tổ chức",
        title: "Địa điểm tổ chức sự kiện sang trọng cho tiệc cưới và hội nghị",
        description: "Đặt địa điểm tổ chức sự kiện đẳng cấp với không gian rộng lớn, trang trí sang trọng, và dịch vụ hậu cần hoàn hảo cho tiệc cưới, hội nghị, hoặc sự kiện đặc biệt. Bao gồm âm thanh, ánh sáng chuyên nghiệp, và đội ngũ hỗ trợ tận tình, đảm bảo sự kiện của bạn trở nên khó quên.",
        image: "https://picsum.photos/1200/800?random=venue1",
    },
];

export const locationProps: LocationProps[] = [
    {
        id: "north",
        name: "Miền Bắc",
        title: "Miền Bắc: Văn hóa đặc sắc với Hà Nội cổ kính và Sapa mù sương",
        description: "Khám phá miền Bắc với văn hóa đặc sắc, thủ đô Hà Nội cổ kính, và các điểm du lịch nổi tiếng như Sapa mù sương, vịnh Hạ Long hùng vĩ. Phù hợp cho những ai yêu thích lịch sử, ẩm thực truyền thống, và khí hậu mát mẻ, lý tưởng cho việc thuê phòng nghỉ dưỡng hoặc làm việc dài hạn.",
        image: "https://picsum.photos/1200/800?random=north1",
    },
    {
        id: "central",
        name: "Miền Trung",
        title: "Miền Trung: Biển xanh với Đà Nẵng hiện đại và Hội An cổ xưa",
        description: "Trải nghiệm miền Trung với biển xanh ngát, thành phố Đà Nẵng hiện đại, và phố cổ Hội An lãng mạn. Nơi lý tưởng cho du lịch biển, nghỉ dưỡng, hoặc thuê văn phòng gần các khu công nghiệp. Khám phá nền ẩm thực đặc trưng và văn hóa đa dạng, phù hợp cho cả gia đình và doanh nghiệp.",
        image: "https://picsum.photos/1200/800?random=central1",
    },
    {
        id: "south",
        name: "Miền Nam",
        title: "Miền Nam: Phát triển năng động với TP.HCM sôi động",
        description: "Đặt chân đến miền Nam phát triển năng động với TP.HCM sôi động, trung tâm kinh tế của Việt Nam. Phù hợp cho thuê căn hộ cao cấp, văn phòng hiện đại, hoặc địa điểm tổ chức sự kiện. Khám phá văn hóa sông nước, chợ nổi, và cuộc sống đô thị nhịp nhàng, lý tưởng cho những ai tìm kiếm cơ hội kinh doanh và giải trí.",
        image: "https://picsum.photos/1200/800?random=south1",
    },
    {
        id: "west",
        name: "Miền Tây",
        title: "Miền Tây: Đồng bằng sông nước với trái cây đặc sản",
        description: "Thưởng thức miền Tây với đồng bằng sông Cửu Long xanh mát, văn hóa sông nước độc đáo, và trái cây đặc sản tươi ngon. Nơi yên bình cho thuê nhà vườn, resort, hoặc không gian tổ chức sự kiện ngoài trời. Phù hợp cho gia đình muốn nghỉ dưỡng, hoặc doanh nghiệp tìm kiếm không gian sáng tạo và gần gũi với thiên nhiên.",
        image: "https://picsum.photos/1200/800?random=west1",
    },
];

// export const locations: LocationProps[] = [
//     {
//         id: "north",
//         name: "Miền Bắc",
//         region: "north",
//         description: "Khu vực miền Bắc với văn hóa đặc sắc và nhiều điểm du lịch nổi tiếng như Hà Nội, Sapa, Hạ Long.",
//         image: "https://picsum.photos/400/300?random=north",
//         popular: true,
//         roomCount: 4,
//     },
//     {
//         id: "central",
//         name: "Miền Trung",
//         region: "central",
//         description: "Miền Trung với biển xanh và các thành phố du lịch như Đà Nẵng, Hội An, Huế.",
//         image: "https://picsum.photos/400/300?random=central",
//         popular: true,
//         roomCount: 3,
//     },
//     {
//         id: "south",
//         name: "Miền Nam",
//         region: "south",
//         description: "Miền Nam phát triển với TP.HCM năng động và các tỉnh Đông Nam Bộ.",
//         image: "https://picsum.photos/400/300?random=south",
//         popular: true,
//         roomCount: 3,
//     },
//     {
//         id: "west",
//         name: "Miền Tây",
//         region: "west",
//         description: "Miền Tây với đồng bằng sông Cửu Long, văn hóa sông nước và trái cây đặc sản.",
//         image: "https://picsum.photos/400/300?random=west",
//         popular: false,
//         roomCount: 2,
//     },
// ];