import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Col, DatePicker, Form, Row, Steps } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLocation, getAllLocationType } from "../../api/configs/location.config";
import { uploadImage } from "../../api/configs/common.config";
import { getAllService } from "../../api/configs/service.config";
import {
  MapAddressMapper,
  type MapAddressDto,
} from "../../api/dtos/map.dto";
import type { LocationTypeDto, ServiceDto } from "../../api/dtos/location.dto";
import { LocationEndpoint } from "../../api/endpoints/location.endpoint";
import { ServiceEndpoint } from "../../api/endpoints/service.endpoint";
import icnClear from "../../assets/svg/icn-clear.svg";
import {
  DATE_FORMAT,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../common/constants/constants";
import { formatCurrencyVND } from "../../common/contexts/format";
import { FormInput } from "../../components/FormInput/formInput";
import { FormTextArea } from "../../components/FormTextArea/formTextArea";
import { MapViewCommon } from "../../components/MapViewCommon";
import { useLoading } from "../../providers/loadingProvider";
import { useNotification } from "../../providers/notificationProvider";
import { LocationTypeCard } from "./components/LocationTypeCard/locationTypeCard";
import { ServiceTag } from "./components/ServiceTag/intex";
import "./renterLayout.scss";
import { mapDraftToCreateLocationRequest } from "../../features/locationCreation/types";
import { useCreateLocationDraft } from "../../features/locationCreation/useCreateLocationDraft";

const STEP_ITEMS = [
  { title: "Thong tin chinh" },
  { title: "Dia chi & tien ich" },
  { title: "Xac nhan" },
];

const BasicInfoStep = ({
  draft,
  typeList,
  onNext,
  onCancel,
  onUpload,
  isUploading,
}: {
  draft: ReturnType<typeof useCreateLocationDraft>["draft"];
  typeList?: LocationTypeDto[];
  onNext: (value: Record<string, any>) => void;
  onCancel: () => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}) => {
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="renter">
      <div className="renter_location-type-header">
        <h1 className="header-title">Thong tin chinh cua khong gian</h1>
        <p className="header-subTitle">
          Chon loai khong gian, khai bao gia, hinh anh dai dien va cac thong tin
          mo ta cot loi.
        </p>
        <img src={icnClear} className="header-close" alt="X" onClick={onCancel} />
      </div>

      <Steps current={0} items={STEP_ITEMS} className="renter-steps" />

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
            ...values,
            availableFrom: values.availableFrom
              ? dayjs(values.availableFrom).format(DATE_FORMAT)
              : undefined,
            availableTo: values.availableTo
              ? dayjs(values.availableTo).format(DATE_FORMAT)
              : undefined,
          })
        }
        className="renter__fillInformation-form"
      >
        <div className="renter_location-type-body">
          {typeList?.map((item) => (
            <div
              className={`item ${form.getFieldValue("typeCode") === item.typeCode ? "active" : ""}`}
              key={item.typeCode}
              onClick={() => form.setFieldValue("typeCode", item.typeCode)}
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

        <Form.Item
          name="typeCode"
          rules={[{ required: true, message: "Vui long chon loai khong gian." }]}
          hidden
        >
          <input />
        </Form.Item>

        <Row gutter={[24, 24]} className="renter__fillInformation-body">
          <Col span={8} className="upload-wrapper">
            <figure className="renter__fillInformation-upload">
              {draft.basicInfo.logoUrl ? (
                <img crossOrigin="anonymous" src={draft.basicInfo.logoUrl} alt="" />
              ) : null}
            </figure>
            <label
              htmlFor="upload-basic-logo"
              className={`renter__fillInformation-upload-btn-upload ${isUploading ? "is-uploading" : ""}`}
            >
              <input
                id="upload-basic-logo"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                disabled={isUploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    onUpload(file);
                  }
                }}
              />
              <span>{isUploading ? "Dang tai anh..." : "Tai anh dai dien"}</span>
            </label>
          </Col>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormInput
                  label="Ten khong gian"
                  name="locationName"
                  placeholder="Nhap ten khong gian"
                  vertical={true}
                  formItemProps={{
                    rules: [{ required: true, message: "Truong nay la bat buoc." }],
                  }}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Dien tich (m2)"
                  name="area"
                  placeholder="Nhap dien tich"
                  vertical={true}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Gia niem yet"
                  name="basePrice"
                  placeholder="Nhap gia niem yet"
                  vertical={true}
                  formItemProps={{
                    rules: [{ required: true, message: "Truong nay la bat buoc." }],
                  }}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Gia cho thue"
                  name="finalPrice"
                  placeholder="Nhap gia cho thue"
                  vertical={true}
                  formItemProps={{
                    rules: [{ required: true, message: "Truong nay la bat buoc." }],
                  }}
                />
              </Col>
            </Row>
            <FormTextArea
              label="Mo ta"
              name="description"
              placeholder="Nhap mo ta"
              vertical={true}
            />
            <FormTextArea
              label="Ghi chu"
              name="note"
              placeholder="Nhap ghi chu"
              vertical={true}
            />
            <Form.Item name="hasTimeLimit" valuePropName="checked">
              <Checkbox>Gioi han thoi gian cho thue</Checkbox>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev, next) => prev.hasTimeLimit !== next.hasTimeLimit}
            >
              {({ getFieldValue }) =>
                getFieldValue("hasTimeLimit") ? (
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        name="availableFrom"
                        label="Tu ngay"
                        rules={[{ required: true, message: "Vui long chon ngay bat dau." }]}
                      >
                        <DatePicker format={DATE_FORMAT} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="availableTo"
                        label="Den ngay"
                        rules={[{ required: true, message: "Vui long chon ngay ket thuc." }]}
                      >
                        <DatePicker format={DATE_FORMAT} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null
              }
            </Form.Item>
          </Col>
        </Row>

        <div className="renter_location-type-footer">
          <Button htmlType="submit" className="button-submit">
            Tiep tuc
          </Button>
        </div>
      </Form>
    </div>
  );
};

const AddressAndServicesStep = ({
  draft,
  services,
  onBack,
  onNext,
}: {
  draft: ReturnType<typeof useCreateLocationDraft>["draft"];
  services?: ServiceDto[];
  onBack: () => void;
  onNext: (value: Record<string, any>) => void;
}) => {
  const [form] = Form.useForm();
  const [location, setLocation] = useState<MapAddressDto>(
    MapAddressMapper.createEmpty(draft.address.latitude, draft.address.longitude),
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    draft.serviceCodes,
  );

  return (
    <div className="renter">
      <div className="renter__fillAddress-header">
        <h1 className="header-title">Dia chi va tien ich</h1>
        <p className="header-subTitle">
          Khai bao dia chi chinh va chon nhung dich vu di kem ma khach co the su
          dung.
        </p>
      </div>
      <Steps current={1} items={STEP_ITEMS} className="renter-steps" />
      <Row gutter={[24, 24]} className="renter__fillAddress-body">
        <Col span={12}>
          <MapViewCommon
            data={{
              ...location,
              fullAddress: draft.address.fullAddress,
              addressWard: draft.address.ward,
              addressDistrict: draft.address.district,
              addressCity: draft.address.city,
              addressProvince: draft.address.province,
              addressCountry: draft.address.country,
              addressPostal: draft.address.postalCode,
              addressRegion: draft.address.region,
            }}
            hasInputSearch={true}
            onMapClick={(value) => {
              setLocation(value);
              form.setFieldsValue({
                fullAddress: value.fullAddress,
                ward: value.addressWard,
                district: value.addressDistrict,
                city: value.addressCity,
                province: value.addressProvince,
                country: value.addressCountry,
                postalCode: value.addressPostal,
                region: value.addressRegion,
              });
            }}
          />
        </Col>
        <Col span={12}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: draft.address.name,
              fullAddress: draft.address.fullAddress,
              ward: draft.address.ward,
              district: draft.address.district,
              city: draft.address.city,
              province: draft.address.province,
              country: draft.address.country,
              postalCode: draft.address.postalCode,
              region: draft.address.region,
              description: draft.address.description,
              note: draft.address.note,
            }}
            onFinish={(values) =>
              onNext({
                ...values,
                latitude: location.lat,
                longitude: location.long,
                serviceCodes: selectedServices,
              })
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <FormInput
                  label="Ten dia chi"
                  name="name"
                  placeholder="Nhap ten dia chi"
                  vertical={true}
                  formItemProps={{ rules: [{ required: true, message: "Bat buoc." }] }}
                />
              </Col>
              <Col span={16}>
                <FormInput
                  label="Dia chi day du"
                  name="fullAddress"
                  placeholder="Nhap dia chi"
                  vertical={true}
                  formItemProps={{ rules: [{ required: true, message: "Bat buoc." }] }}
                />
              </Col>
              <Col span={12}>
                <FormInput label="Phuong / Xa" name="ward" placeholder="" vertical={true} />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Quan / Huyen"
                  name="district"
                  placeholder=""
                  vertical={true}
                />
              </Col>
              <Col span={12}>
                <FormInput label="Thanh pho" name="city" placeholder="" vertical={true} />
              </Col>
              <Col span={12}>
                <FormInput label="Tinh" name="province" placeholder="" vertical={true} />
              </Col>
              <Col span={12}>
                <FormInput label="Quoc gia" name="country" placeholder="" vertical={true} />
              </Col>
              <Col span={12}>
                <FormInput
                  label="Ma buu chinh"
                  name="postalCode"
                  placeholder=""
                  vertical={true}
                />
              </Col>
              <Col span={24}>
                <FormInput label="Khu vuc" name="region" placeholder="" vertical={true} />
              </Col>
              <Col span={24}>
                <FormTextArea
                  label="Mo ta dia chi"
                  name="description"
                  placeholder="Nhap mo ta"
                  vertical={true}
                />
              </Col>
              <Col span={24}>
                <FormTextArea
                  label="Ghi chu dia chi"
                  name="note"
                  placeholder="Nhap ghi chu"
                  vertical={true}
                />
              </Col>
            </Row>

            <div className="body__section-2">
              <Row gutter={[16, 16]}>
                <h1 className="section-title">Dich vu cung cap</h1>
              </Row>
              <div className="wrapper">
                <h1 className="body__section-2-content-title">Dich vu mien phi</h1>
                <Row gutter={[16, 16]} className="body__section-2-content">
                  {services
                    ?.filter((item) => Number(item.servicePrice) === 0)
                    .map((item) => (
                      <div
                        key={item.serviceCode}
                        onClick={() =>
                          setSelectedServices((prev) =>
                            prev.includes(item.serviceCode)
                              ? prev.filter((code) => code !== item.serviceCode)
                              : [...prev, item.serviceCode],
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <ServiceTag
                          icon={item.serviceLogo}
                          name={item.serviceName}
                          price={item.servicePrice}
                          description={item.serviceDescription}
                          active={selectedServices.includes(item.serviceCode)}
                        />
                      </div>
                    ))}
                </Row>
              </div>
              <div className="wrapper">
                <h1 className="body__section-2-content-title">Dich vu mat phi</h1>
                <Row gutter={[16, 16]} className="body__section-2-content">
                  {services
                    ?.filter((item) => Number(item.servicePrice) > 0)
                    .map((item) => (
                      <div
                        key={item.serviceCode}
                        onClick={() =>
                          setSelectedServices((prev) =>
                            prev.includes(item.serviceCode)
                              ? prev.filter((code) => code !== item.serviceCode)
                              : [...prev, item.serviceCode],
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <ServiceTag
                          icon={item.serviceLogo}
                          name={item.serviceName}
                          price={item.servicePrice}
                          description={item.serviceDescription}
                          active={selectedServices.includes(item.serviceCode)}
                        />
                      </div>
                    ))}
                </Row>
              </div>
            </div>

            <div className="form-action">
              <Button htmlType="button" onClick={onBack} className="button-cancel">
                Quay lai
              </Button>
              <Button htmlType="submit" className="button-submit">
                Tiep tuc
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

const ConfirmStep = ({
  draft,
  typeList,
  services,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  draft: ReturnType<typeof useCreateLocationDraft>["draft"];
  typeList?: LocationTypeDto[];
  services?: ServiceDto[];
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) => {
  const selectedType = typeList?.find((item) => item.typeCode === draft.basicInfo.typeCode);
  const selectedServices = services?.filter((item) =>
    draft.serviceCodes.includes(item.serviceCode),
  );

  const totalServicePrice = useMemo(
    () =>
      selectedServices?.reduce(
        (total, item) => total + Number(item.servicePrice ?? 0),
        0,
      ) ?? 0,
    [selectedServices],
  );

  return (
    <div className="renter__confirm">
      <div className="renter__confirm-header">
        <h1 className="header-title">Xac nhan thong tin dang phong</h1>
        <p className="header-subTitle">
          Kiem tra lai draft truoc khi gui len he thong.
        </p>
      </div>
      <Steps current={2} items={STEP_ITEMS} className="renter-steps" />
      <div className="renter__confirm-section row-1">
        <h1 className="renter__confirm-section-title">Thong tin chinh</h1>
        <p>Loai: {selectedType?.typeName}</p>
        <p>Ten: {draft.basicInfo.locationName}</p>
        <p>Dien tich: {draft.basicInfo.area ?? 0} m2</p>
        <p>Gia niem yet: {formatCurrencyVND(draft.basicInfo.basePrice ?? 0)}</p>
        <p>Gia cho thue: {formatCurrencyVND(draft.basicInfo.finalPrice ?? 0)}</p>
        <p>Mo ta: {draft.basicInfo.description || "-"}</p>
        <p>Ghi chu: {draft.basicInfo.note || "-"}</p>
      </div>
      <div className="renter__confirm-section row-2">
        <h1 className="renter__confirm-section-title">Dia chi chinh</h1>
        <p>{draft.address.name}</p>
        <p>{draft.address.fullAddress}</p>
        <p>
          {draft.address.ward}, {draft.address.district}, {draft.address.city}
        </p>
      </div>
      <div className="renter__confirm-section row-3">
        <h1 className="renter__confirm-section-title">Dich vu da chon</h1>
        <div className="wrapper__content">
          {selectedServices?.map((item) => (
            <ServiceTag
              key={item.serviceCode}
              icon={item.serviceLogo}
              name={item.serviceName}
              price={item.servicePrice}
              description={item.serviceDescription}
              active={true}
            />
          ))}
        </div>
        <p>Tong chi phi dich vu: {formatCurrencyVND(totalServicePrice)}</p>
      </div>
      <div className="renter__confirm-section row-5">
        <Button htmlType="button" onClick={onBack} className="button-cancel">
          Quay lai
        </Button>
        <Button
          htmlType="button"
          className="button-submit"
          onClick={onSubmit}
          loading={isSubmitting}
        >
          Dang phong
        </Button>
      </div>
    </div>
  );
};

export const RenterLayout = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const { draft, updateBasicInfo, updateAddress, updateServiceCodes, reset } =
    useCreateLocationDraft();
  const [step, setStep] = useState(0);

  const { data: typeList, isLoading: typeLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_ALL_LOCATION_TYPE],
    queryFn: () => getAllLocationType(),
  });

  const { data: serviceList, isLoading: serviceLoading } = useQuery({
    queryKey: [ServiceEndpoint.GET_ALL_LOCATION_SERVICE],
    queryFn: () => getAllService(),
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onSuccess: (data) => {
      updateBasicInfo({ logoUrl: data.imageUrl });
      showNotification(data.message, NOTI_SUCCESS);
    },
    onError: (error) => {
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  const createMutation = useMutation({
    mutationFn: () => createLocation(mapDraftToCreateLocationRequest(draft)),
    onSuccess: (data) => {
      showNotification(data.message, NOTI_SUCCESS);
      reset();
      navigate(-1);
    },
    onError: (error) => {
      const apiMessage =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response?.data?.message
          : DEFAULT_MESSAGE;
      showNotification(apiMessage, NOTI_ERROR);
    },
  });

  useEffect(() => {
    setLoading(
      typeLoading ||
        serviceLoading ||
        uploadMutation.isPending ||
        createMutation.isPending,
    );
  }, [
    createMutation.isPending,
    serviceLoading,
    setLoading,
    typeLoading,
    uploadMutation.isPending,
  ]);

  if (step === 0) {
    return (
      <BasicInfoStep
        draft={draft}
        typeList={typeList}
        isUploading={uploadMutation.isPending}
        onCancel={() => {
          reset();
          navigate(-1);
        }}
        onUpload={(file) => {
          const formData = new FormData();
          formData.append("file", file);
          uploadMutation.mutate(formData);
        }}
        onNext={(value) => {
          updateBasicInfo({
            typeCode: value.typeCode,
            locationName: value.locationName,
            description: value.description ?? "",
            note: value.note ?? "",
            area: value.area ? Number(value.area) : undefined,
            basePrice: Number(value.basePrice),
            finalPrice: Number(value.finalPrice),
            hasTimeLimit: Boolean(value.hasTimeLimit),
            availableFrom: value.availableFrom,
            availableTo: value.availableTo,
          });
          setStep(1);
        }}
      />
    );
  }

  if (step === 1) {
    return (
      <AddressAndServicesStep
        draft={draft}
        services={serviceList}
        onBack={() => setStep(0)}
        onNext={(value) => {
          updateAddress({
            name: value.name,
            fullAddress: value.fullAddress,
            ward: value.ward,
            district: value.district,
            city: value.city,
            province: value.province,
            country: value.country,
            postalCode: value.postalCode,
            region: value.region,
            latitude: value.latitude,
            longitude: value.longitude,
            description: value.description ?? "",
            note: value.note ?? "",
          });
          updateServiceCodes(value.serviceCodes ?? []);
          setStep(2);
        }}
      />
    );
  }

  return (
    <ConfirmStep
      draft={draft}
      typeList={typeList}
      services={serviceList}
      isSubmitting={createMutation.isPending}
      onBack={() => setStep(1)}
      onSubmit={() => createMutation.mutate()}
    />
  );
};
