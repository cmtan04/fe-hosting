import { Button, Checkbox, Col, DatePicker, Form, Row, Steps } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { LocationTypeDto } from "../../../../api/dtos/location.dto";
import icnClear from "../../../../assets/svg/icn-clear.svg";
import { DATE_FORMAT } from "../../../../common/constants/constants";
import { STEP_ITEMS } from "../../../../common/constants/renter";
import { NUMBER_REGEX } from "../../../../common/constants/regexs";
import { formatCurrencyVND } from "../../../../common/contexts/format";
import type {
  BasicInfoDraftPatch,
  BasicInfoStepFormValues,
  BasicInfoStepSubmitValue,
} from "../../../../common/types/renter";
import { FormInput } from "../../../../components/FormInput/formInput";
import { FormTextArea } from "../../../../components/FormTextArea/formTextArea";
import { LocationMediaEditor } from "../../../../components/LocationMediaEditor";
import type { CreateLocationDraft } from "../../../../features/locationCreation/types";
import { LocationTypeCard } from "../../components/LocationTypeCard/locationTypeCard";
import { SummaryPanel } from "../../components/SummaryPanel";
import "./basicInfoStep.scss";

interface BasicInfoStepProps {
  draft: CreateLocationDraft;
  typeList?: LocationTypeDto[];
  isUploading: boolean;
  currentStep: number;
  onNext: (value: BasicInfoStepSubmitValue) => void;
  onStepChange: (nextStep: number) => void;
  onDraftChange: (patch: BasicInfoDraftPatch) => void;
  onCancel: () => void;
  onUpload: (files: FileList) => void;
  onRemoveMedia: (id: string) => void;
  onSetAvatar: (id: string) => void;
}

export const BasicInfoStep = ({
  draft,
  typeList,
  currentStep,
  onNext,
  onStepChange,
  onDraftChange,
  onCancel,
  onUpload,
  onRemoveMedia,
  onSetAvatar,
  isUploading,
}: BasicInfoStepProps) => {
  const [form] = Form.useForm<BasicInfoStepFormValues>();
  const selectedTypeCode = Form.useWatch("typeCode", form);
  const watchedFinalPrice = Form.useWatch("finalPrice", form);
  const watchedArea = Form.useWatch("area", form);

  const selectedType = useMemo(
    () => typeList?.find((item) => item.typeCode === selectedTypeCode),
    [selectedTypeCode, typeList],
  );

  const syncDraft = (values: BasicInfoStepFormValues) => {
    onDraftChange({
      typeCode: values.typeCode,
      locationName: values.locationName,
      description: values.description ?? "",
      note: values.note ?? "",
      area: values.area ? Number(values.area) : undefined,
      basePrice: values.basePrice ? Number(values.basePrice) : undefined,
      finalPrice: values.finalPrice ? Number(values.finalPrice) : undefined,
      hasTimeLimit: Boolean(values.hasTimeLimit),
      availableFrom: values.availableFrom
        ? dayjs(values.availableFrom).format(DATE_FORMAT)
        : undefined,
      availableTo: values.availableTo
        ? dayjs(values.availableTo).format(DATE_FORMAT)
        : undefined,
    });
  };

  return (
    <div className="renter">
      <div className="renter_location-type-header">
        <h1 className="header-title">Thông tin cơ bản</h1>

        <button
          className="header-close"
          onClick={onCancel}
          type="button"
          aria-label="Close"
        >
          <img src={icnClear} alt="X" />
        </button>
      </div>

      <Steps
        current={currentStep}
        items={STEP_ITEMS}
        className="renter-steps"
        onChange={(nextStep) => {
          syncDraft(form.getFieldsValue(true));
          onStepChange(nextStep);
        }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          typeCode: draft.basicInfo.typeCode || undefined,
          locationName: draft.basicInfo.locationName,
          description: draft.basicInfo.description,
          note: draft.basicInfo.note,
          area: draft.basicInfo.area,
          basePrice: draft.basicInfo.basePrice,
          finalPrice: draft.basicInfo.finalPrice,
          hasTimeLimit: draft.basicInfo.hasTimeLimit,
          availableFrom: draft.basicInfo.availableFrom
            ? dayjs(draft.basicInfo.availableFrom, DATE_FORMAT)
            : undefined,
          availableTo: draft.basicInfo.availableTo
            ? dayjs(draft.basicInfo.availableTo, DATE_FORMAT)
            : undefined,
        }}
        onFinish={(values) =>
          onNext({
            typeCode: values.typeCode,
            locationName: values.locationName,
            description: values.description ?? "",
            note: values.note ?? "",
            area: values.area ? Number(values.area) : undefined,
            basePrice: values.basePrice ? Number(values.basePrice) : undefined,
            finalPrice: values.finalPrice
              ? Number(values.finalPrice)
              : undefined,
            hasTimeLimit: Boolean(values.hasTimeLimit),
            availableFrom: values.availableFrom
              ? dayjs(values.availableFrom).format(DATE_FORMAT)
              : undefined,
            availableTo: values.availableTo
              ? dayjs(values.availableTo).format(DATE_FORMAT)
              : undefined,
          })
        }
        onValuesChange={(_, allValues) => {
          syncDraft(allValues);
        }}
        className="renter__fillInformation-form"
      >
        <Form.Item
          name="typeCode"
          rules={[{ required: true, message: "Vui lòng chọn loại không gian" }]}
          hidden
        >
          <input />
        </Form.Item>

        <Row gutter={[24, 24]} className="renter__fillInformation-body">
          <Col span={16}>
            <div className="renter-sectionBand">
              <div className="renter-sectionBand-header">
                <h2>Loại không gian</h2>
              </div>
              <div className="renter_location-type-body renter_location-type-body--compact">
                {typeList?.map((item: LocationTypeDto) => (
                  <div
                    className={`item ${selectedTypeCode === item.typeCode ? "active" : ""}`}
                    key={item.typeCode}
                    onClick={() =>
                      form.setFieldValue("typeCode", item.typeCode)
                    }
                  >
                    <LocationTypeCard
                      typeName={item.typeName}
                      typeDescription={item.typeDescription}
                      typeBackGround={item.typeBackGround}
                      typeLogo={item.typeLogo}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="renter-sectionBand">
              <div className="renter-sectionBand-header">
                <h2>Thông tin cơ bản</h2>
              </div>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <FormInput
                    label="Tên không gian"
                    name="locationName"
                    placeholder="Nhập tên không gian"
                    vertical={true}
                    formItemProps={{
                      rules: [
                        {
                          required: true,
                          message: "Trường này là trường bắt buộc",
                        },
                      ],
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FormInput
                    label="Diện tích (m2)"
                    name="area"
                    placeholder="Nhập diện tích"
                    vertical={true}
                    formItemProps={{
                      rules: [
                        {
                          pattern: NUMBER_REGEX,
                          message: "Vui lòng nhập đúng số",
                        },
                      ],
                    }}
                  />
                </Col>

                <Col span={12}>
                  <FormInput
                    label="Giá cho thuê (VND)"
                    name="finalPrice"
                    placeholder="Nhập giá cho thuê"
                    vertical={true}
                    formItemProps={{
                      rules: [
                        {
                          required: true,
                          message: "Trường này là trường bắt buộc",
                        },
                        {
                          pattern: NUMBER_REGEX,
                          message: "Vui lòng nhập đúng số",
                        },
                      ],
                    }}
                  />
                </Col>
              </Row>
              <FormTextArea
                label="Mô tả"
                name="description"
                placeholder="Nhập mô tả không gian (tối đa 500 ký tự)"
                vertical={true}
              />
              <FormTextArea
                label="Ghi chú"
                name="note"
                placeholder="Nhập ghi chú (tối đa 500 ký tự)"
                vertical={true}
              />
              <Form.Item name="hasTimeLimit" valuePropName="checked">
                <Checkbox>Giới hạn thời gian cho thuê</Checkbox>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, next) =>
                  prev.hasTimeLimit !== next.hasTimeLimit
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("hasTimeLimit") ? (
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          name="availableFrom"
                          label="Từ ngày"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ngày bắt đầu.",
                            },
                          ]}
                        >
                          <DatePicker
                            format={DATE_FORMAT}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="availableTo"
                          label="Đến ngày"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ngày kết thúc.",
                            },
                          ]}
                        >
                          <DatePicker
                            format={DATE_FORMAT}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : null
                }
              </Form.Item>
            </div>
          </Col>
          <Col span={8} className="upload-wrapper">
            <div className="renter-sectionBand">
              <div className="renter-sectionBand-header">
                <h2>Tập đính kèm</h2>
              </div>
              <LocationMediaEditor
                media={draft.basicInfo.media}
                isUploading={isUploading}
                inputId="upload-basic-media"
                uploadLabel="Tải ảnh/video lên"
                emptyLabel="Chưa tải lên tập đính kèm nào"
                onUpload={onUpload}
                onRemove={onRemoveMedia}
                onSetAvatar={onSetAvatar}
              />
            </div>
            <SummaryPanel
              title="Tổng quan"
              rows={[
                {
                  label: "Loại",
                  value: selectedType?.typeName || "Chưa chọn",
                },
                {
                  label: "Diện tích",
                  value: watchedArea ? `${watchedArea} m2` : "-",
                },
                {
                  label: "Giá cho thuê",
                  value: watchedFinalPrice
                    ? formatCurrencyVND(Number(watchedFinalPrice))
                    : "-",
                },
                {
                  label: "Số tập đính kèm",
                  value: String(draft.basicInfo.media.length),
                },
              ]}
            />
          </Col>
        </Row>

        <div className="renter_location-type-footer">
          <Button htmlType="submit" className="button-submit">
            Tiếp tục
          </Button>
        </div>
      </Form>
    </div>
  );
};
