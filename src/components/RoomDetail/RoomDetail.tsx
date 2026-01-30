import { useParams } from "react-router-dom";
import { Image, Typography, Card, Row, Col, Space, Button, Tag, Divider, Avatar } from "antd";
import { EnvironmentOutlined, DollarOutlined, UserOutlined, PhoneOutlined, MailOutlined, HeartOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useState } from "react";
import { items, users } from "../../assets/data/mockData";
import "./RoomDetail.scss";


export const RoomDetail = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const roomData = items.find(item => item.id === roomId);
    const ownerData = users.find(user => user.id === roomData?.ownerId);
    const [isFavorite, setIsFavorite] = useState(false);

    // Mock data - in real app, fetch from API based on roomId
    // const roomData: RoomDetailProps = {
    //     id: roomId || "1",
    //     rentType: "motel",
    //     location: "north",
    //     address: "123 Main St, Hanoi, Vietnam",
    //     price: 300,
    //     ownerName: "Nguyen Van A",
    //     ownerId: "owner1",
    //     title: "Phòng trọ tiện nghi tại Hà Nội",
    //     description: "Phòng trọ đầy đủ tiện nghi, gần trung tâm thành phố. Phòng có diện tích 25m², gồm 1 phòng ngủ, 1 phòng khách, bếp và nhà vệ sinh riêng. Có máy lạnh, tủ lạnh, máy giặt, wifi tốc độ cao. An ninh tốt, có camera giám sát 24/7. Cách trường đại học 500m, cách chợ 200m.",
    //     mainImage: "https://picsum.photos/800/600?random=1",
    //     images: [
    //         "https://picsum.photos/800/600?random=1",
    //         "https://picsum.photos/800/600?random=2",
    //         "https://picsum.photos/800/600?random=3",
    //         "https://picsum.photos/800/600?random=4",
    //         "https://picsum.photos/800/600?random=5",
    //     ],
    // };

    // const handleContact = () => {
    //     // Handle contact logic
    //     alert(`Liên hệ với ${items.ownerName}`);
    // };

    // const handleFavorite = () => {
    //     setIsFavorite(!isFavorite);
    // };

    // const handleShare = () => {
    //     // Handle share logic
    //     navigator.share?.({
    //         title: roomData.title,
    //         text: roomData.description,
    //         url: window.location.href,
    //     });
    // };

    return (
        <div className="room-detail">
            {/* Header with title and actions */}
            <div className="room-detail__header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            {roomData?.title}
                        </Typography.Title>
                        <Space>
                            <Tag color="blue">{roomData?.rentType}</Tag>
                            <Tag color="green">{roomData?.location}</Tag>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                icon={<HeartOutlined />}
                                type={isFavorite ? "primary" : "default"}
                            // onClick={handleFavorite}
                            >
                                {isFavorite ? "Đã lưu" : "Lưu"}
                            </Button>
                            <Button icon={<ShareAltOutlined />}
                            //onClick={handleShare}
                            >
                                Chia sẻ
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* Main Image Gallery */}
            <div className="room-detail__gallery">
                <Row gutter={8}>
                    <Col xs={24} md={8}>
                        <Image
                            src={roomData?.mainImage}
                            alt={roomData?.title}
                            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Row gutter={[8, 4]} className="gallery-grid">
                            {roomData?.images?.slice(1, 5).map((img, index) => (
                                <Col xs={12} key={index}>
                                    <Image
                                        src={img}
                                        alt={`${roomData?.title} ${index + 1}`}
                                        style={{ width: '100%', height: '196px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col xs={24} lg={8} md={4} className="room-detail__sidebar">
                        {/* Owner Info */}
                        <Card className="owner-card" >
                            <Space align="start" style={{ height: '100%' }}>
                                <Avatar size={64} src={ownerData?.avatar} />
                                <div className="owner-info" style={{ flex: 1 }}>
                                    <Typography.Title level={5} style={{ marginBottom: '8px' }}>
                                        {ownerData?.name}
                                    </Typography.Title>
                                    <Typography.Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                                        Chủ sở hữu
                                    </Typography.Text>
                                    <Space direction="vertical" size="small" className="contact-info">
                                        <Space>
                                            <PhoneOutlined />
                                            <Typography.Text>{ownerData?.phone}</Typography.Text>
                                        </Space>
                                        <Space>
                                            <MailOutlined />
                                            <Typography.Text>{ownerData?.email}</Typography.Text>
                                        </Space>
                                        <Space>
                                            <EnvironmentOutlined />
                                            <Typography.Text>{roomData?.address}</Typography.Text>
                                        </Space>
                                    </Space>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

            </div >

            {/* Room Details */}
            <Row gutter={32} >
                <Col xs={24} lg={16} className="room-detail__content">
                    <Card style={{ marginBottom: '20px' }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Typography.Title level={4}>Mô tả</Typography.Title>
                                <Typography.Paragraph className="description">
                                    {roomData?.description}
                                </Typography.Paragraph>
                            </div>

                            <Divider />

                            <div className="amenities">
                                <Typography.Title level={4}>Tiện ích</Typography.Title>
                                <Row gutter={[16, 16]}>
                                    {roomData?.utilities?.map((utility, index) => (
                                        <Col span={8} key={index}>
                                            <Space>
                                                <div>{utility}</div>
                                            </Space>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={8} className="room-detail__sidebar">
                    {/* Price Card */}
                    <Card className="price-card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <Typography.Title level={3} style={{ color: '#1890ff', marginBottom: '10px' }}>
                            {roomData?.price.toLocaleString()}k/tháng
                        </Typography.Title>
                        <Typography.Text type="secondary">
                            Giá đã bao gồm phí dịch vụ
                        </Typography.Text>
                        <Divider />
                        <Button type="primary" size="large" block
                        // onClick={handleContact}
                        >
                            Liên hệ ngay
                        </Button>
                    </Card>
                </Col>

            </Row>
        </div >
    );
};