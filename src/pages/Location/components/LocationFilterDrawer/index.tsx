import {
  Button,
  Drawer,
  Space,
  Grid,
  Checkbox,
  Slider,
  Divider,
  Typography,
  Form,
  Select,
} from "antd";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProfileLocationFilter } from "../../../../common/types/profile";
import { getAllLocationType } from "../../../../api/configs/location.config";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";

interface LocationFilterProps {
  open: boolean;
  onClose: () => void;
  initialFilter: ProfileLocationFilter;
  onApply: (filter: ProfileLocationFilter) => void;
}

const { useBreakpoint } = Grid;

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "createdAt-DESC" },
  { label: "Giá: Thấp đến Cao", value: "locationPrice-ASC" },
  { label: "Giá: Cao đến Thấp", value: "locationPrice-DESC" },
  { label: "Diện tích: Nhỏ đến Lớn", value: "locationArea-ASC" },
  { label: "Diện tích: Lớn đến Nhỏ", value: "locationArea-DESC" },
  { label: "Đánh giá cao nhất", value: "locationRate-DESC" },
];

export const LocationFilterDrawer = ({
  open,
  onClose,
  initialFilter,
  onApply,
}: LocationFilterProps) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const isDesktop = screens.md;

  const { data: locationTypes } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: getAllLocationType,
  });

  // Sync form khi filter thay đổi từ bên ngoài (URL)
  useEffect(() => {
    const sortValue = initialFilter.sortBy 
      ? `${initialFilter.sortBy}-${initialFilter.sortOrder || 'DESC'}`
      : undefined;

    form.setFieldsValue({
      locationType: initialFilter.locationType
        ? initialFilter.locationType.split(",")
        : [],
      priceRange: [
        initialFilter.minPrice ?? 0,
        initialFilter.maxPrice ?? 20000000,
      ],
      areaRange: [initialFilter.minArea ?? 0, initialFilter.maxArea ?? 200],
      sort: sortValue,
    });
  }, [initialFilter, form]);

  // Đọc giá trị form → tạo filter object sạch
  const getFilterFromForm = (): ProfileLocationFilter => {
    const values = form.getFieldsValue();
    const typeArr: string[] = values.locationType ?? [];
    
    let sortBy: string | undefined;
    let sortOrder: "ASC" | "DESC" | undefined;
    
    if (values.sort) {
      const [field, order] = values.sort.split("-");
      sortBy = field;
      sortOrder = order as "ASC" | "DESC";
    }

    return {
      locationType: typeArr.length > 0 ? typeArr.join(",") : undefined,
      minPrice: values.priceRange?.[0] > 0 ? values.priceRange[0] : undefined,
      maxPrice:
        values.priceRange?.[1] < 20000000 ? values.priceRange[1] : undefined,
      minArea: values.areaRange?.[0] > 0 ? values.areaRange[0] : undefined,
      maxArea: values.areaRange?.[1] < 200 ? values.areaRange[1] : undefined,
      sortBy,
      sortOrder,
    };
  };

  // Desktop: auto-submit khi form thay đổi
  const handleValuesChange = () => {
    if (!isDesktop) return;
    onApply(getFilterFromForm());
  };

  // Mobile: submit khi bấm nút "Áp dụng"
  const handleApply = () => {
    onApply(getFilterFromForm());
    onClose();
  };

  const handleReset = () => {
    form.resetFields();
    if (isDesktop) {
      onApply(getFilterFromForm());
    }
  };

  const priceRange = Form.useWatch("priceRange", form) ?? [0, 20000000];
  const areaRange = Form.useWatch("areaRange", form) ?? [0, 200];

  const formContent = (
    <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 12 }}>
          Sắp xếp theo
        </Typography.Title>
        <Form.Item name="sort" noStyle>
          <Select 
            placeholder="Chọn kiểu sắp xếp" 
            options={SORT_OPTIONS} 
            style={{ width: '100%' }}
            allowClear
          />
        </Form.Item>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      <Form.Item label="Loại hình chỗ ở" name="locationType">
        <Checkbox.Group
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {locationTypes?.map((type) => (
            <Checkbox key={type.typeCode} value={type.typeCode}>
              {type.typeName}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>

      <Divider style={{ margin: "16px 0" }} />

      <Form.Item
        label="Khoảng giá (VNĐ)"
        name="priceRange"
        style={{ marginBottom: 8 }}
      >
        <Slider
          range
          min={0}
          max={20000000}
          step={500000}
          marks={{
            0: "0",
            20000000: "20tr+",
          }}
          tooltip={{ formatter: (value) => value?.toLocaleString() + "đ" }}
        />
      </Form.Item>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "13px",
          fontWeight: 500,
          textAlign: "center",
          marginBottom: 16
        }}
      >
        {priceRange[0].toLocaleString()}đ - {priceRange[1] >= 20000000 ? "Trên 20.000.000đ" : priceRange[1].toLocaleString() + "đ"}
      </div>

      <Divider style={{ margin: "16px 0" }} />

      <Form.Item
        label="Diện tích sử dụng (m²)"
        name="areaRange"
        style={{ marginBottom: 8 }}
      >
        <Slider
          range
          min={0}
          max={200}
          step={5}
          marks={{
            0: "0",
            200: "200+",
          }}
          tooltip={{ formatter: (value) => value + " m²" }}
        />
      </Form.Item>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "13px",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {areaRange[0]} m² - {areaRange[1] >= 200 ? "Trên 200 m²" : areaRange[1] + " m²"}
      </div>
    </Form>
  );

  if (isDesktop) {
    return (
      <div
        className="location__filter-sidebar"
        style={{
          backgroundColor: "var(--white)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          position: "sticky",
          top: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--primary-color)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            Bộ lọc tìm kiếm
          </h3>
          <Button type="link" onClick={handleReset} style={{ padding: 0, fontSize: '13px' }}>
            Đặt lại
          </Button>
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <Drawer
      title="Bộ lọc & Sắp xếp"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      extra={
        <Space>
          <Button onClick={handleReset}>Xóa bộ lọc</Button>
          <Button type="primary" onClick={handleApply}>
            Áp dụng
          </Button>
        </Space>
      }
    >
      {formContent}
    </Drawer>
  );
};
