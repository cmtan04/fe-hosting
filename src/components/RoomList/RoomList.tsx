import { useSearchParams } from "react-router-dom";
import { Card, Row, Col, Image, Typography, Space, Tag } from "antd";
import { EnvironmentOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";
import "./RoomList.scss";

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
}

const items: RoomListProps[] = [
    {
        id: "1",
        rentType: "motel",
        location: "north",
        address: "123 Main St, Hanoi",
        price: 300,
        ownerName: "Nguyen Van A",
        ownerId: "owner1",
        title: "Phòng trọ tiện nghi tại Hà Nội",
        description: "Phòng trọ đầy đủ tiện nghi, gần trung tâm thành phố.",
        mainImage: "https://picsum.photos/1200",
    },
    {
        id: "2",
        rentType: "apartment",
        location: "south",
        address: "456 Beach Rd, Ho Chi Minh City",
        price: 800,
        ownerName: "Tran Thi B",
        ownerId: "owner2",
        title: "Căn hộ cao cấp view biển",
        description: "Căn hộ 2 phòng ngủ với view biển tuyệt đẹp, đầy đủ nội thất.",
        mainImage: "https://picsum.photos/1200",
    },
    {
        id: "3",
        rentType: "office",
        location: "central",
        address: "789 Business Ave, Da Nang",
        price: 1500,
        ownerName: "Le Van C",
        ownerId: "owner3",
        title: "Văn phòng cho thuê tại Đà Nẵng",
        description: "Văn phòng hiện đại, phù hợp cho startup và doanh nghiệp nhỏ.",
        mainImage: "https://picsum.photos/1200",
    },
    {
        id: "4",
        rentType: "full-house",
        location: "west",
        address: "321 Rural Ln, Can Tho",
        price: 1200,
        ownerName: "Pham Thi D",
        ownerId: "owner4",
        title: "Nhà nguyên căn vườn tại Cần Thơ",
        description: "Nhà vườn rộng rãi, yên tĩnh, phù hợp cho gia đình.",
        mainImage: "https://picsum.photos/1200",
    },
    {
        id: "5",
        rentType: "venue",
        location: "north",
        address: "555 Event St, Hanoi",
        price: 2000,
        ownerName: "Hoang Van E",
        ownerId: "owner5",
        title: "Địa điểm tổ chức sự kiện tại Hà Nội",
        description: "Không gian rộng lớn cho tiệc cưới, hội nghị và sự kiện.",
        mainImage: "https://picsum.photos/1200",
    },
];



export const RoomList = () => {
    const handleRoomClick = (roomId: string) => {
        // Logic to navigate to room detail page
        alert(`Navigate to room detail page with ID: ${roomId}`);
    };
    const [searchParams] = useSearchParams();
    const rentType = searchParams.get("rent");
    const locationType = searchParams.get("location");

    // Filter items based on query params
    const filteredItems = items.filter(item => {
        if (rentType && item.rentType !== rentType) return false;
        if (locationType && item.location !== locationType) return false;
        return true;
    });

    return (
        <div className="room-list">
            <Typography.Title level={2} className="room-list__title">
                Danh sách phòng cho thuê
            </Typography.Title>

            {filteredItems.length === 0 ? (
                <div className="room-list__empty">
                    Không tìm thấy phòng nào phù hợp.
                </div>
            ) : (
                <Row gutter={[16, 16]} className="room-list__grid">
                    {filteredItems.map(item => (
                        <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                            <Card
                                hoverable
                                onClick={() => handleRoomClick(item.id)}
                                cover={
                                    <Image
                                        alt={item.title}
                                        src={item.mainImage || "https://via.placeholder.com/300x200"}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        preview={false}
                                    />
                                }
                                style={{ height: '100%', cursor: 'pointer' }}
                            >
                                <Card.Meta
                                    title={
                                        <Space direction="vertical" size="small">
                                            <Typography.Text strong style={{ fontSize: '16px' }}>
                                                {item.title}
                                            </Typography.Text>
                                            <Space>
                                                <Tag color="blue">{item.rentType}</Tag>
                                                <Tag color="green">{item.location}</Tag>
                                            </Space>
                                        </Space>
                                    }
                                    description={
                                        <Space direction="vertical" size="small">
                                            <Space>
                                                <EnvironmentOutlined />
                                                <Typography.Text>{item.address}</Typography.Text>
                                            </Space>
                                            <Space>
                                                <DollarOutlined />
                                                <Typography.Text strong style={{ color: '#1890ff' }}>
                                                    {item.price.toLocaleString()}k/tháng
                                                </Typography.Text>
                                            </Space>
                                            <Space>
                                                <UserOutlined />
                                                <Typography.Text>{item.ownerName}</Typography.Text>
                                            </Space>
                                            <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                                {item.description}
                                            </Typography.Paragraph>
                                        </Space>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}