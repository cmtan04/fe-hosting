import { useParams } from "react-router-dom";
import { Image, Typography, Card, Row, Col, Space, Button, Tag, Divider, Avatar } from "antd";
import { EnvironmentOutlined, DollarOutlined, UserOutlined, PhoneOutlined, MailOutlined, HeartOutlined, ShareAltOutlined, CheckCircleOutlined, HomeOutlined, LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { use, useState } from "react";
import { items, users } from "../../assets/data/mockData";
import { RoomCard } from "../RoomCard/RoomCard";
import "./RoomDetail.scss";


export const RoomDetail = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [current, setCurrent] = useState(0);
    const [curR, setCurR] = useState(0);
    const roomData = items.find(item => item.id === roomId);
    const ownerData = users.find(user => user.id === roomData?.ownerId);
    const [isFavorite, setIsFavorite] = useState(false);

    // Lọc các phòng liên quan: cùng location hoặc cùng rentType, loại trừ phòng hiện tại
    const allRelatedRooms = items.filter(item =>
        item.id !== roomId &&
        (item.location === roomData?.location || item.rentType === roomData?.rentType)
    );
    const relatedRooms = allRelatedRooms.slice(curR * 4, (curR + 1) * 4); // Lấy 4 phòng liên quan mỗi lần
    const totalPages = Math.ceil(allRelatedRooms.length / 4);

    const nextRelatedRooms = () => {
        if (curR < totalPages - 1) {
            setCurR(prev => prev + 1);
        }
    };
    const prevRelatedRooms = () => {
        if (curR > 0) {
            setCurR(prev => prev - 1);
        }
    };

    const nextImage = () => {
        if (roomData?.images) {
            setCurrent((prev) => (prev + 1) % (roomData?.images ?? [1]).length);
        }
    };

    const prevImage = () => {
        if (roomData?.images) {
            setCurrent((prev) => (prev - 1 + (roomData?.images ?? [1]).length) % (roomData?.images ?? [1]).length);
        }
    };

    return (
        <>
            <div className="detail">
                <div className="detail__header">
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
                </div >
                <div className="detail__content">
                    <Row gutter={8} className="content-row" style={{ display: 'flex' }}>
                        <Col span={14} className="left-col" style={{ display: 'flex' }}>
                            <div className="gallery-container">
                                {/* Group này giúp khi click vào ảnh sẽ có preview phóng to và nút Next/Prev */}
                                <Image.PreviewGroup
                                    preview={{
                                        current,
                                        onChange: (index) => setCurrent(index),
                                    }}
                                >
                                    <div className="main-image">
                                        <CaretLeftOutlined className="nav-arrow left" onClick={prevImage} />
                                        <Image src={(roomData?.images ?? [])[current]} />
                                        <CaretRightOutlined className="nav-arrow right" onClick={nextImage} />
                                    </div>
                                </Image.PreviewGroup>

                                {/* Danh sách ảnh nhỏ bên dưới */}
                                <div className="thumbnail-list">
                                    {(roomData?.images ?? []).map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumb-item ${index === current ? 'active' : ''}`}
                                            onClick={() => setCurrent(index)}
                                        >
                                            <Image src={img} preview={false} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                        <Col span={10} className="right-col" style={{ display: 'flex' }}>
                            <div className="info-card">
                                {/* Giá phòng */}
                                <div className="price-section">
                                    <Typography.Text strong>Giá phòng:</Typography.Text>
                                    <Typography.Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>
                                        {roomData?.price?.toLocaleString()} VNĐ
                                    </Typography.Title>
                                    <Typography.Text type="secondary">/tháng</Typography.Text>
                                </div>

                                <Divider />

                                {/* Thông tin phòng */}
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    <div>
                                        <Typography.Text strong>Địa chỉ:</Typography.Text>
                                        <br />
                                        <Space>
                                            <EnvironmentOutlined />
                                            <Typography.Text>{roomData?.address}</Typography.Text>
                                        </Space>
                                    </div>


                                </Space>

                                <Divider />

                                {/* Thông tin chủ phòng */}
                                <div className="owner-section">
                                    <Typography.Title level={5}>Thông tin chủ phòng:</Typography.Title>
                                    <Space align="start" size="middle">
                                        <Avatar
                                            size={64}
                                            src={ownerData?.avatar}
                                            icon={<UserOutlined />}
                                        />
                                        <Space direction="vertical" size="small">
                                            <Typography.Text strong>{ownerData?.name}</Typography.Text>
                                            <Space>
                                                <PhoneOutlined />
                                                <Typography.Text>{ownerData?.phone}</Typography.Text>
                                            </Space>
                                            <Space>
                                                <MailOutlined />
                                                <Typography.Text>{ownerData?.email}</Typography.Text>
                                            </Space>
                                        </Space>
                                    </Space>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        style={{ marginTop: 16 }}
                                        icon={<PhoneOutlined />}
                                    >
                                        Liên hệ ngay
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 32 }}>
                        <Col span={24}>
                            {/* Mô tả chi tiết */}
                            <div style={{ marginBottom: 32 }}>
                                <Typography.Title level={4}>Mô tả chi tiết</Typography.Title>
                                <Typography.Paragraph style={{ fontSize: '15px', lineHeight: '1.8' }}>
                                    {roomData?.description}
                                </Typography.Paragraph>
                            </div>

                            {/* Thông tin phòng */}
                            <div style={{ marginBottom: 32 }}>
                                <Typography.Title level={4}>Thông tin phòng</Typography.Title>
                                <Row gutter={[24, 16]}>
                                    {roomData?.area && (
                                        <Col span={12}>
                                            <Space size="middle">
                                                <HomeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                                <div>
                                                    <Typography.Text type="secondary" style={{ display: 'block' }}>Diện tích</Typography.Text>
                                                    <Typography.Text strong style={{ fontSize: '18px' }}>{roomData.area} m²</Typography.Text>
                                                </div>
                                            </Space>
                                        </Col>
                                    )}

                                </Row>
                            </div>

                            {/* Tiện ích */}
                            {roomData?.utilities && roomData.utilities.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <Typography.Title level={4}>Tiện ích</Typography.Title>
                                    <Row gutter={[16, 16]}>
                                        {roomData.utilities.map((utility, index) => (
                                            <Col span={8} key={index}>
                                                <Space>
                                                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                                                    <Typography.Text>{utility}</Typography.Text>
                                                </Space>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                            {/* Đánh giá */}

                        </Col>
                    </Row>
                </div>
            </div >
            <div className="other">
                <Typography.Title level={3} style={{ marginBottom: 24 }}>Phòng liên quan</Typography.Title>
                <div className="other__content">
                    <CaretLeftOutlined
                        className={`arrow __left ${curR === 0 ? 'disabled' : ''}`}
                        onClick={curR === 0 ? undefined : prevRelatedRooms}
                    />
                    <Row gutter={[16, 16]} style={{ width: '95%' }}>
                        {relatedRooms.map((room) => (
                            <RoomCard key={room.id} {...room} />
                        ))}
                    </Row>
                    <CaretRightOutlined
                        className={`arrow __right ${curR >= totalPages - 1 ? 'disabled' : ''}`}
                        onClick={curR >= totalPages - 1 ? undefined : nextRelatedRooms}
                    />
                </div>

            </div>
        </>

    );

};