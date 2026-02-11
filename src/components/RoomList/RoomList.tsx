import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, Row, Col, Image, Typography, Space, Tag } from "antd";
import { EnvironmentOutlined, DollarOutlined, UserOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { ROUTER_PATH } from "../../router/Route";
import { items } from "../../assets/data/mockData";
import "./RoomList.scss";
import { use, useEffect, useRef, useState } from "react";
import { Pagination } from "../PaginationCommon/paginationCommon";


export const RoomList = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topRef = useRef<HTMLDivElement>(null);

    // Lấy query
    const rentType = searchParams.get("rent");
    const locationType = searchParams.get("location");
    const page = Number(searchParams.get("page")) || 1;
    const prevPage = useRef<number | null>(null);

    // lấy dữ liệu ( sau này sẽ gọi API )
    const totalItems = items.filter(item => {
        if (rentType && item.rentType !== rentType) return false;
        if (locationType && item.location !== locationType) return false;
        return true;
    });

    // phân trang
    const itemsPerPage = 12;
    const totalPage = Math.ceil(totalItems.length / itemsPerPage) || 1;
    const filteredItems = totalItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    //cuộn lên đầu component khi chuyển trang ( tăng UX)
    const handleScrollToTop = () => {
        if (topRef.current) {
            // 1. Lấy vị trí của Component so với đỉnh trang
            const elementPosition = topRef.current.getBoundingClientRect().top + window.pageYOffset;
            console.log("elementPosition:", elementPosition);

            // 2. set chiều cao
            const offset = 75; // height của topbar là 66,8px => tăng lên 75 cho thoáng

            // 3. Cuộn đến vị trí đã trừ khoảng trống ( nếu không từ height của topbar thì bị che mất nội dung  => UX kém)
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    // sửa url khi chuyển trang
    const updatePage = (newPage: number) => {
        // giữ lại các params cũ (rent, location) và chỉ update page
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", newPage.toString());
        navigate(`?${newParams.toString()}`);

    };
    useEffect(() => {
        if (prevPage.current !== null && prevPage.current !== page) {
            handleScrollToTop();
        }
        prevPage.current = page;
    }, [page]);

    const handleRoomClick = (item: any) => {
        navigate(`${ROUTER_PATH.ROOMDETAIL.replace(":roomId", item.id)}`);
    };

    return (
        <div className="room-list" style={{ scrollMarginTop: '80px' }}> {/* Fallback cho Sticky Header */}
            <div ref={topRef}></div>
            {filteredItems.length === 0 ? (
                <div className="room-list__empty">Không tìm thấy phòng phù hợp.</div>
            ) : (
                <>
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
                        ))}
                    </Row>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPage}
                        onPageChange={updatePage}
                    />
                </>
            )}
        </div>
    );
};