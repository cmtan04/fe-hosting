import { Button, Drawer, Form, Input, InputNumber, Select, Space } from "antd";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProfileLocationFilter } from "../../../../common/types/profile";
import { getAllLocationType } from "../../../../api/configs/location.config";
import { LocationEndpoint } from "../../../../api/endpoints/location.endpoint";

interface LocationFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  initialFilter: ProfileLocationFilter;
  onApply: (filter: ProfileLocationFilter) => void;
}

export const LocationFilterDrawer = ({
  open,
  onClose,
  initialFilter,
  onApply,
}: LocationFilterDrawerProps) => {
  const [form] = Form.useForm();

  const { data: locationTypes } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: getAllLocationType,
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        locationType: initialFilter.locationType,
        minPrice: initialFilter.minPrice,
        maxPrice: initialFilter.maxPrice,
        minArea: initialFilter.minArea,
        maxArea: initialFilter.maxArea,
        addressCity: initialFilter.addressCity,
        addressRegion: initialFilter.addressRegion,
      });
    }
  }, [open, initialFilter, form]);

  const handleApply = () => {
    const values = form.getFieldsValue();
    onApply({
      ...initialFilter,
      locationType: values.locationType,
      minPrice: values.minPrice,
      maxPrice: values.maxPrice,
      minArea: values.minArea,
      maxArea: values.maxArea,
      addressCity: values.addressCity,
      addressRegion: values.addressRegion,
      page: 1, // Reset page on new filter
    });
    onClose();
  };

  const handleReset = () => {
    form.resetFields();
    // Don't apply immediately, let user click apply
  };

  return (
    <Drawer
      title="Bộ lọc nâng cao"
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
      <Form layout="vertical" form={form}>
        <Form.Item label="Loại địa điểm" name="locationType">
          <Select
            placeholder="Chọn loại địa điểm"
            allowClear
            options={locationTypes?.map((type) => ({
              label: type.typeName,
              value: type.typeCode,
            }))}
          />
        </Form.Item>

        <Form.Item label="Tỉnh/Thành phố" name="addressCity">
          <Input placeholder="Nhập tỉnh/thành phố" allowClear />
        </Form.Item>

        <Form.Item label="Quận/Huyện" name="addressRegion">
          <Input placeholder="Nhập quận/huyện" allowClear />
        </Form.Item>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item label="Giá tối thiểu" name="minPrice" style={{ flex: 1 }}>
            <InputNumber
              style={{ width: "100%" }}
              placeholder="VD: 1000000"
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/₫\s?|(,*)/g, "") as any}
              min={0}
            />
          </Form.Item>

          <Form.Item label="Giá tối đa" name="maxPrice" style={{ flex: 1 }}>
            <InputNumber
              style={{ width: "100%" }}
              placeholder="VD: 5000000"
              formatter={(value) =>
                `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/₫\s?|(,*)/g, "") as any}
              min={0}
            />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item label="Diện tích tối thiểu (m²)" name="minArea" style={{ flex: 1 }}>
            <InputNumber
              style={{ width: "100%" }}
              placeholder="VD: 15"
              min={0}
            />
          </Form.Item>

          <Form.Item label="Diện tích tối đa (m²)" name="maxArea" style={{ flex: 1 }}>
            <InputNumber
              style={{ width: "100%" }}
              placeholder="VD: 50"
              min={0}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};
