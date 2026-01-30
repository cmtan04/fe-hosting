import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, Row, Col, Image, Typography, Space, Tag } from "antd";
import { EnvironmentOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";
import { ROUTER_PATH } from "../../router/Route";
import { items } from "../../assets/data/mockData";
import "./RoomList.scss";





export const RoomList = () => {
    const navigate = useNavigate();
    const handleRoomClick = (item: any) => {
        // Logic to navigate to room detail page
        navigate(`${ROUTER_PATH.ROOMDETAIL.replace(":roomId", item.id)}`);
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
                                onClick={() => handleRoomClick(item)}
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
            )
            }
        </div >
    );
}