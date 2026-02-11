import { Row, Card, Col, Image, Space, Typography } from "antd";
import { EnvironmentOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../../router/Route";
import "./RoomCard.scss";

export const RoomCard = (item: any) => {
    const navigate = useNavigate();
    const handleRoomClick = (item: any) => {
        navigate(`${ROUTER_PATH.ROOMDETAIL.replace(":roomId", item.id)}`);
    };
    return (
        <Col xs={24} sm={12} md={8} lg={6} key={item.id} style={{ display: 'flex' }}>
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
            >
                <Card.Meta
                    title={item.title}
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
                        </Space>}
                />
            </Card>
        </Col>
    )
};