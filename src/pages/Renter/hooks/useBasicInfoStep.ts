import { Form } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { LocationTypeDto } from "@api/dtos/location.dto";
import { DATE_FORMAT } from "@common/constants/constants";
import { formatCurrencyVND } from "@common/contexts/format";
import type {
  BasicInfoDraftPatch,
  BasicInfoStepFormValues,
  BasicInfoStepSubmitValue,
} from "@common/types/renter";
import type { CreateLocationDraft } from "@features/locationCreation/types";

interface UseBasicInfoStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  onDraftChange: (patch: BasicInfoDraftPatch) => void;
  onNext: (value: BasicInfoStepSubmitValue) => void;
  onStepChange: (nextStep: number) => void;
}

/**
 * Hook tùy chỉnh để quản lý trạng thái và logic cho Bước Thông tin cơ bản (Bước 1).
 * Nó xử lý khởi tạo form, đồng bộ hóa bản nháp thời gian thực,
 * tính toán dữ liệu tổng quan và các sự kiện điều hướng.
 */
export const useBasicInfoStep = ({
  draft,
  typeList,
  onDraftChange,
  onNext,
  onStepChange,
}: UseBasicInfoStepProps) => {
  // Thực thể Ant Design Form để quản lý các trường nhập liệu
  const [form] = Form.useForm<BasicInfoStepFormValues>();

  // UseWatch cho phép chúng ta đăng ký theo dõi các thay đổi của trường cụ thể để cập nhật UI thời gian thực (ví dụ: bảng tổng quan)
  const selectedTypeCode = Form.useWatch("typeCode", form);
  const watchedPrice = Form.useWatch("price", form);
  const watchedPriceUnit = Form.useWatch("priceUnit", form);
  const watchedArea = Form.useWatch("area", form);
  const watchedName = Form.useWatch("locationName", form);

  // Lấy ra đối tượng loại không gian đầy đủ từ mã code đã chọn
  const selectedType = useMemo(
    () => typeList?.find((item) => item.typeCode === selectedTypeCode),
    [selectedTypeCode, typeList],
  );

  /**
   * Đồng bộ hóa các giá trị form hiện tại với trạng thái bản nháp toàn cục.
   * Điều này đảm bảo dữ liệu được duy trì ngay cả khi người dùng điều hướng đi nơi khác.
   */
  const syncDraft = (values: BasicInfoStepFormValues) => {
    onDraftChange({
      typeCode: values.typeCode,
      locationName: values.locationName,
      description: values.description ?? "",
      note: values.note ?? "",
      area: values.area ? Number(values.area) : undefined,
      price: values.price ? Number(values.price) : undefined,
      priceUnit: values.priceUnit ?? "tháng",
      hasTimeLimit: Boolean(values.hasTimeLimit),
      availableFrom: values.availableFrom
        ? dayjs(values.availableFrom).format(DATE_FORMAT)
        : undefined,
      availableTo: values.availableTo
        ? dayjs(values.availableTo).format(DATE_FORMAT)
        : undefined,
    });
  };

  /**
   * Được gọi khi form được gửi (nhấp nút Tiếp tục).
   * Kiểm tra tính hợp lệ và chuyển dữ liệu cho controller cha.
   */
  const handleFinish = (values: BasicInfoStepFormValues) => {
    onNext({
      typeCode: values.typeCode,
      locationName: values.locationName,
      description: values.description ?? "",
      note: values.note ?? "",
      area: values.area ? Number(values.area) : undefined,
      price: values.price ? Number(values.price) : undefined,
      priceUnit: values.priceUnit ?? "tháng",
      hasTimeLimit: Boolean(values.hasTimeLimit),
      availableFrom: values.availableFrom
        ? dayjs(values.availableFrom).format(DATE_FORMAT)
        : undefined,
      availableTo: values.availableTo
        ? dayjs(values.availableTo).format(DATE_FORMAT)
        : undefined,
    });
  };

  /**
   * Xử lý thay đổi đối với bất kỳ trường form nào để kích hoạt đồng bộ hóa bản nháp ngay lập tức.
   */
  const handleFormValuesChange = (allValues: BasicInfoStepFormValues) => {
    syncDraft(allValues);
  };

  /**
   * Trình xử lý chuyên biệt để chọn một thẻ loại không gian.
   * Cập nhật trường form ẩn và đồng bộ hóa bản nháp.
   */
  const handleTypeSelect = (typeCode: string) => {
    form.setFieldValue("typeCode", typeCode);
    syncDraft(form.getFieldsValue(true));
  };

  /**
   * Xử lý thay đổi bước thủ công thông qua chỉ báo tiến trình.
   */
  const handleStepChangeInternal = (nextStep: number) => {
    syncDraft(form.getFieldsValue(true));
    onStepChange(nextStep);
  };

  /**
   * Chuẩn bị các giá trị form ban đầu dựa trên dữ liệu bản nháp hiện có.
   * Chuyển đổi các chuỗi ngày tháng thành đối tượng dayjs cho DatePicker.
   */
  const initialValues = useMemo(
    () => ({
      typeCode: draft.basicInfo.typeCode || undefined,
      locationName: draft.basicInfo.locationName,
      description: draft.basicInfo.description,
      note: draft.basicInfo.note,
      area: draft.basicInfo.area,
      price: draft.basicInfo.price,
      priceUnit: draft.basicInfo.priceUnit,
      hasTimeLimit: draft.basicInfo.hasTimeLimit,
      availableFrom: draft.basicInfo.availableFrom
        ? dayjs(draft.basicInfo.availableFrom, DATE_FORMAT)
        : undefined,
      availableTo: draft.basicInfo.availableTo
        ? dayjs(draft.basicInfo.availableTo, DATE_FORMAT)
        : undefined,
    }),
    [draft.basicInfo],
  );

  /**
   * Tính toán các hàng cho bảng tổng quan ở bên phải.
   */
  const summaryRows = useMemo(
    () => [
      {
        label: "Loại",
        value: selectedType?.typeName || "Chưa chọn",
      },
      {
        label: "Tên không gian",
        value: watchedName || "-",
      },
      {
        label: "Diện tích",
        value: watchedArea ? `${watchedArea} m2` : "-",
      },
      {
        label: "Giá cho thuê",
        value: watchedPrice
          ? `${formatCurrencyVND(Number(watchedPrice))}  / ${watchedPriceUnit}`
          : `- / ${watchedPriceUnit}`,
      },
      {
        label: "Số tập đính kèm",
        value: String(draft.basicInfo.media.length),
      },
    ],
    [
      selectedType,
      watchedArea,
      watchedName,
      watchedPrice,
      watchedPriceUnit,
      draft.basicInfo.media.length,
    ],
  );

  return {
    form,
    selectedType,
    selectedTypeCode,
    summaryRows,
    initialValues,
    handleFinish,
    handleFormValuesChange,
    handleTypeSelect,
    handleStepChange: handleStepChangeInternal,
  };
};
