import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Col, DatePicker, Form, Modal, Row } from "antd";
import "./style.scss";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLocationByCode, updateLocation } from "@api/configs/location.config";
import { getAllService } from "@api/configs/service.config";
import { createDraftAddressFromMapResult } from "@features/mapAddress/address";
import type { LocationAddressDto } from "@api/dtos/location.dto";
import { LocationEndpoint } from "@api/endpoints/location.endpoint";
import { ServiceEndpoint } from "@api/endpoints/service.endpoint";
import add from "@assets/svg/profile/add.svg";
import back from "@assets/svg/profile/back.svg";
import deleteIcn from "@assets/svg/profile/delete.svg";
import pen from "@assets/svg/profile/pen.svg";
import {
  DATE_FORMAT,
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "@common/constants/constants";
import { formatCurrencyVND } from "@common/contexts/format";
import { validString } from "@common/contexts/helper";
import { CommonTable } from "@components/CommonTable";
import { FormInput } from "@components/FormInput/formInput";
import { FormTextArea } from "@components/FormTextArea/formTextArea";
import { LocationMediaEditor } from "@components/LocationMediaEditor";
import { MapViewCommon } from "@components/MapViewCommon";
import { useLoading } from "@providers/loadingProvider";
import { ServiceTag } from "@pages/Renter/components/ServiceTag";
import { uploadImage } from "@api/configs/common.config";
import { isAxiosError } from "axios";
import { useNotification } from "@providers/notificationProvider";
import type { ProfileLocationFilter } from "@common/types/profile";
import {
  appendEditableMedia,
  mapEditableMediaToRequest,
  mapLocationMediaToEditable,
  markEditableMediaAsLogo,
  removeEditableMediaById,
  type EditableLocationMediaItem,
} from "@features/locationCreation/media";
import {
  createEmptyPrimaryAddress,
  normalizeLocationAddress,
} from "@features/locationCreation/address";
import { calculateSelectedServicesTotal } from "@features/locationCreation/services";
import { uploadLocationMediaFiles } from "@features/locationCreation/upload";
import { useMapAddressPicker } from "@features/mapAddress/useMapAddressPicker";

dayjs.extend(customParseFormat);

const parseLocationDate = (value?: string | null): Dayjs | null => {
  if (!value) {
    return null;
  }

  const supportedFormats = [DATE_FORMAT, "YYYY-MM-DD", "DD/MM/YYYY"];

  for (const format of supportedFormats) {
    const parsedDate = dayjs(value, format, true);
    if (parsedDate.isValid()) {
      return parsedDate;
    }
  }

  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate : null;
};

export const ProfileLocationDetail = () => {
  const [form] = Form.useForm();
  const [address] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoading();
  const locationCode = location?.state?.locationCode;
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filter, setFilter] = useState<ProfileLocationFilter>({
    page: 1,
    limit: 2,
  });
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [mediaList, setMediaList] = useState<EditableLocationMediaItem[]>([]);
  const { showNotification } = useNotification();
  const [primaryAddress, setPrimaryAddress] = useState<LocationAddressDto>(
    createEmptyPrimaryAddress(),
  );
  const { mapData, resolveCoordinates, searchState } = useMapAddressPicker({
    initialAddress: {
      addressDetail: primaryAddress.addressDetail ?? "",
      fullAddress: primaryAddress.fullAddress,
      ward: primaryAddress.ward,
      city: primaryAddress.city,
      country: primaryAddress.country,
      region: primaryAddress.region,
      latitude: primaryAddress.latitude,
      longitude: primaryAddress.longitude,
      description: primaryAddress.description ?? "",
      note: primaryAddress.note ?? "",
    },
    hasSearch: true,
    onAddressResolved: (value) => {
      const nextDraft = createDraftAddressFromMapResult(value, {
        addressDetail: primaryAddress.addressDetail ?? "",
        fullAddress: primaryAddress.fullAddress,
        ward: primaryAddress.ward,
        city: primaryAddress.city,
        country: primaryAddress.country,
        region: primaryAddress.region,
        latitude: primaryAddress.latitude,
        longitude: primaryAddress.longitude,
        description: primaryAddress.description ?? "",
        note: primaryAddress.note ?? "",
      });

      address.setFieldsValue({
        fullAddress: nextDraft.fullAddress,
        addressWard: nextDraft.ward,
        addressDistrict: primaryAddress.district ?? nextDraft.ward,
        addressCity: nextDraft.city,
        addressProvince: primaryAddress.province ?? nextDraft.city,
        addressCountry: nextDraft.country,
        addressPostal: primaryAddress.postalCode ?? "",
        addressRegion: nextDraft.region,
      });
    },
  });

  const { data: locationData, isLoading: locationLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_CODE, locationCode],
    queryFn: () => getLocationByCode(locationCode),
    enabled: !!locationCode,
  });

  const { data: service } = useQuery({
    queryKey: [ServiceEndpoint.GET_ALL_LOCATION_SERVICE],
    queryFn: () => getAllService(),
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onSuccess: (data) => {
      showNotification(data.message, NOTI_SUCCESS);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateLocation>[1]) => {
      if (!locationCode) {
        throw new Error("Location code is required");
      }

      return updateLocation(locationCode, payload);
    },
    onSuccess: (data) => {
      showNotification(data.message, NOTI_SUCCESS);
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") {
          message = apiMessage;
        } else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      } else if (error instanceof Error && error.message) {
        message = error.message;
      }
      showNotification(message, NOTI_ERROR);
    },
  });

  useEffect(() => {
    setLoading(
      locationLoading || uploadMutation.isPending || updateMutation.isPending,
    );
  }, [
    locationLoading,
    setLoading,
    updateMutation.isPending,
    uploadMutation.isPending,
  ]);

  useEffect(() => {
    if (locationData) {
      const nextPrimaryAddress = normalizeLocationAddress(
        locationData.address?.[0] ?? null,
      );

      form.setFieldsValue({
        locationCode: locationData.locationCode,
        locationName: locationData.locationName,
        hasLimit: Boolean(locationData.minTime || locationData.maxTime),
        minTimeLimit: parseLocationDate(locationData.minTime),
        maxTimeLimit: parseLocationDate(locationData.maxTime),
        locationDescription: locationData.locationDescription,
        locationNote: locationData.locationNote,
        locationPrice: locationData.locationPrice,
        locationPriceUnit: locationData.locationPriceUnit || "tháng",
        locationPriceAfterDeal: locationData.locationPriceAfterDeal,
      });

      setPrimaryAddress(nextPrimaryAddress);
      setMediaList(
        mapLocationMediaToEditable(
          locationData.media,
          locationData.locationLogo || undefined,
        ),
      );
    }
  }, [locationData, form]);

  useEffect(() => {
    if (locationData?.services && locationData.services.length > 0) {
      const activeServiceCodes = locationData.services
        .filter((item) => item.isActive === 1)
        .map((item) => item.serviceCode);

      setSelectedServices(activeServiceCodes);
      return;
    }
    setSelectedServices([]);
  }, [locationData]);

  const isServiceSelected = (serviceCode: string) => {
    return selectedServices.includes(serviceCode);
  };

  const selectedPaidServices = useMemo(
    () =>
      service?.filter(
        (item) =>
          Number(item.servicePrice) > 0 && isServiceSelected(item.serviceCode),
      ) ?? [],
    [service, selectedServices],
  );

  const handleServiceClick = (serviceCode: string) => {
    setSelectedServices((prev) => {
      const isSelected = prev.includes(serviceCode);
      let newSelected: string[];

      if (isSelected) {
        newSelected = prev.filter((code) => code !== serviceCode);
      } else {
        newSelected = [...prev, serviceCode];
      }

      return newSelected;
    });
  };

  const handleUpdateClick = (addressCode?: string) => {
    if (validString(addressCode ?? "")) {
      const addressData = locationData?.address?.find(
        (item) => item.addressCode === addressCode,
      );
      const resolvedAddress = normalizeLocationAddress(addressData);

      address.setFieldsValue({
        addressName: resolvedAddress.name,
        fullAddress: resolvedAddress.fullAddress,
        addressWard: resolvedAddress.ward,
        addressDistrict: resolvedAddress.district,
        addressCity: resolvedAddress.city,
        addressProvince: resolvedAddress.province,
        addressCountry: resolvedAddress.country,
        addressPostal: resolvedAddress.postalCode,
        addressRegion: resolvedAddress.region,
        addressDescription: resolvedAddress.description,
        addressNote: resolvedAddress.note,
      });
      setShowUpdate(!showUpdate);
    } else {
      address.setFieldsValue({
        addressName: primaryAddress.name,
        fullAddress: primaryAddress.fullAddress,
        addressWard: primaryAddress.ward,
        addressDistrict: primaryAddress.district,
        addressCity: primaryAddress.city,
        addressProvince: primaryAddress.province,
        addressCountry: primaryAddress.country,
        addressPostal: primaryAddress.postalCode,
        addressRegion: primaryAddress.region,
        addressDescription: primaryAddress.description,
        addressNote: primaryAddress.note,
      });
      setShowUpdate(!showUpdate);
    }
  };

  const handleUploadFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    uploadLocationMediaFiles(files, uploadMutation.mutateAsync)
      .then((uploaded) => {
        setMediaList((prev) => appendEditableMedia(prev, uploaded));
      })
      .catch(() => {
        // Error notification handled by mutation.
      });
  };

  const onSubmit = async (values: Record<string, any>) => {
    if (!locationCode || !locationData) {
      return;
    }

    await updateMutation.mutateAsync({
      name: values.locationName,
      description: values.locationDescription || undefined,
      note: values.locationNote || undefined,
      pricing: {
        price: Number(values.locationPrice ?? 0),
        priceUnit: values.locationPriceUnit || "tháng",
        priceAfterDeal: Number(values.locationPriceAfterDeal ?? 0),
      },
      availability: {
        hasTimeLimit: Boolean(values.hasLimit),
        availableFrom: values.hasLimit
          ? dayjs(values.minTimeLimit).format(DATE_FORMAT)
          : undefined,
        availableTo: values.hasLimit
          ? dayjs(values.maxTimeLimit).format(DATE_FORMAT)
          : undefined,
        isRented: locationData.hasRent === 1,
      },
      primaryAddress,
      services: selectedServices.map((serviceCode) => ({
        serviceCode,
        customPrice: 0,
        pricingType: "FULL" as const,
      })),
      media: mapEditableMediaToRequest(mediaList),
    });
  };

  const onAddressSubmit = (values: Record<string, any>) => {
    const nextAddress = {
      ...primaryAddress,
      name: values.addressName,
      fullAddress: values.fullAddress,
      ward: values.addressWard,
      district: values.addressDistrict,
      city: values.addressCity,
      province: values.addressProvince,
      country: values.addressCountry,
      postalCode: values.addressPostal,
      region: values.addressRegion,
      latitude: Number(mapData.lat || 0),
      longitude: Number(mapData.long || 0),
      description: values.addressDescription || undefined,
      note: values.addressNote || undefined,
    };

    setPrimaryAddress(nextAddress);
    setShowUpdate(false);
  };

  const tableHeader = [
    {
      key: 1,
      label: "Mã địa chỉ",
      value: "addressCode",
    },
    {
      key: 2,
      label: "Tên địa điểm",
      value: "addressName",
    },
    {
      key: 3,
      label: "Địa chỉ",
      value: "fullAddress",
    },
    {
      key: 4,
      label: "Thành phố",
      value: "addressCity",
    },
    {
      key: 5,
      label: "Nước",
      value: "addressCountry",
    },
    {
      key: 6,
      label: "Mô tả",
      value: "addressDescription",
    },
    {
      key: 7,
      label: "Chú thích",
      value: "addressNote",
    },
    {
      key: 8,
      label: "",
      value: "action",
      render: (index: any, record: any) => {
        return (
          <div className="action-column">
            <Button
              htmlType="button"
              icon={<img src={pen} alt="" />}
              onClick={() => handleUpdateClick(record.addressCode)}
              className="button-update"
            />

            <Button
              htmlType="button"
              icon={<img src={deleteIcn} alt="" />}
              onClick={() => {
                setShowDelete(!showDelete);
              }}
              className="button-delete"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="profile__location-detail">
      <div className="profile__location-detail-header">
        <div className="text">
          <h1 className="header-title">Thông tin địa điểm của bạn</h1>
          <p className="header-subTitle">
            Đây là thông tin địa điểm mà bạn đã cung cấp trước đó. Người dùng sẽ
            biết đến địa điểm của bạn qua các thông tin này.
          </p>
        </div>
        <div className="action">
          <Button
            htmlType="button"
            icon={<img src={back} alt="" />}
            onClick={() => navigate(-1)}
            className="button-back"
          />
        </div>
      </div>

      <div className="profile__location-detail-body">
        <Form
          form={form}
          onFinish={onSubmit}
          className="profile__location-form"
        >
          <div className="body-row">
            <Row gutter={[16, 16]} className="body-row-type">
              <Col span={4}>
                <img src={locationData?.typeLogo} alt="Logo" className="logo" />
              </Col>
              <Col span={20}>
                <h1>Loại địa điểm: {locationData?.typeName} </h1>
                <p>Chú thích: {locationData?.typeDescription}</p>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="body-row-location">
              <Col span={14}>
                <FormInput
                  label="Mã địa điểm"
                  name="locationCode"
                  disabled
                  placeholder=""
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <FormInput
                  label="Tên địa điểm"
                  name="locationName"
                  placeholder="Nhập tên địa điểm"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <FormInput
                      label="Giá cho thuê (VNĐ)"
                      name="locationPrice"
                      placeholder="Nhập mức giá"
                      vertical={true}
                      formItemProps={{
                        rules: [
                          {
                            required: true,
                            message: "Trường này là trường bắt buộc.",
                          },
                        ],
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <FormInput
                      label="Đơn vị tính"
                      name="locationPriceUnit"
                      placeholder="VD: tháng, ngày"
                      vertical={true}
                      formItemProps={{
                        rules: [
                          {
                            required: true,
                            message: "Trường này là trường bắt buộc.",
                          },
                        ],
                      }}
                    />
                  </Col>
                </Row>

                <FormInput
                  label="Giá sau thương lượng (VNĐ)"
                  name="locationPriceAfterDeal"
                  placeholder="Nhập mức giá sau thương lượng (nếu có)"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>

              <Col span={10} className="upload-wrapper">
                <LocationMediaEditor
                  media={mediaList}
                  isUploading={uploadMutation.isPending}
                  inputId="upload-location-media"
                  uploadLabel="Tai anh/video len"
                  emptyLabel="Chua co media cho location nay"
                  onUpload={handleUploadFiles}
                  onRemove={(id) =>
                    setMediaList((prev) => removeEditableMediaById(prev, id))
                  }
                  onSetAvatar={(id) =>
                    setMediaList((prev) => markEditableMediaAsLogo(prev, id))
                  }
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="body-row-description">
              <Col span={24}>
                <FormTextArea
                  label="Mô tả"
                  name="locationDescription"
                  placeholder="Nhập mô tả"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
              <Col span={24}>
                <FormTextArea
                  label="Ghi chú"
                  name="locationNote"
                  placeholder="Nhập ghi chú"
                  vertical={true}
                  formItemProps={{
                    rules: [
                      {
                        required: false,
                        message: "Trường này là trường bắt buộc.",
                      },
                    ],
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="body-row-checked">
              <Col span={24}>
                <Form.Item
                  name="hasLimit"
                  valuePropName="checked"
                  className="form-checkbox"
                >
                  <Checkbox>Giới hạn thời gian thuê</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="body-row-time">
              <Col span={24}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.hasLimit !== currentValues.hasLimit
                  }
                >
                  {() =>
                    form.getFieldValue("hasLimit") === true && (
                      <Row gutter={[16, 16]} className="limit-time">
                        <Col span={12}>
                          <Form.Item
                            name="minTimeLimit"
                            label="Từ ngày"
                            vertical={true}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn ngày bắt đầu",
                              },
                            ]}
                          >
                            <DatePicker
                              format={DATE_FORMAT}
                              placeholder="Chọn ngày bắt đầu"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="maxTimeLimit"
                            vertical={true}
                            label="Đến ngày"
                            dependencies={["minTimeLimit"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn ngày kết thúc",
                              },
                              () => ({
                                validator(_rule: unknown, value?: Dayjs) {
                                  const minDate = form.getFieldValue(
                                    "minTimeLimit",
                                  ) as Dayjs | undefined;
                                  if (
                                    !value ||
                                    !minDate ||
                                    value.isAfter(minDate)
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "Ngày kết thúc phải sau ngày bắt đầu",
                                    ),
                                  );
                                },
                              }),
                            ]}
                          >
                            <DatePicker
                              format={DATE_FORMAT}
                              placeholder="Chọn ngày kết thúc"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="body-row">
            <Row gutter={[16, 16]} className="body-row-service">
              <h1 className="header-title">Các dịch vụ được cung cấp</h1>
              <p className="header-subTitle">
                Các dịch vụ mà bạn cung cấp sẽ giúp trải nghiệm của khách hàng
                tốt hơn. Nó giúp cho địa điểm của bạn trở nên nổi tiếng hơn.
              </p>
            </Row>

            <div className="wrapper">
              <h1 className="wrapper-content-title">Dịch vụ miễn phí</h1>
              <Row gutter={[16, 16]} className="wrapper-content">
                {service
                  ?.filter((item) => Number(item.servicePrice) === 0)
                  .map((item) => (
                    <button
                      type="button"
                      key={item.serviceCode}
                      onClick={() => handleServiceClick(item.serviceCode)}
                      style={{
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        padding: 0,
                        textAlign: "left",
                      }}
                    >
                      <ServiceTag
                        icon={item.serviceLogo}
                        name={item.serviceName}
                        price={item.servicePrice}
                        description={item.serviceDescription}
                        active={isServiceSelected(item.serviceCode)}
                      />
                    </button>
                  ))}
              </Row>
            </div>

            <div className="wrapper">
              <h1 className="wrapper-content-title">Dịch vụ mất phí</h1>
              <Row gutter={[16, 16]} className="wrapper-content">
                {service
                  ?.filter((item) => Number(item.servicePrice) > 0)
                  .map((item) => (
                    <button
                      type="button"
                      key={item.serviceCode}
                      onClick={() => handleServiceClick(item.serviceCode)}
                      style={{
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        padding: 0,
                        textAlign: "left",
                      }}
                    >
                      <ServiceTag
                        icon={item.serviceLogo}
                        name={item.serviceName}
                        price={item.servicePrice}
                        description={item.serviceDescription}
                        active={isServiceSelected(item.serviceCode)}
                      />
                    </button>
                  ))}
              </Row>
            </div>

            <div className="wrapper money">
              <Row gutter={[16, 16]} className="wrapper-money">
                <Col span={16}>
                  <p>Tổng tiền dịch vụ:</p>
                </Col>
                <Col span={8}>
                  <p>
                    {formatCurrencyVND(
                      calculateSelectedServicesTotal(selectedPaidServices) || 0,
                    )}
                  </p>
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="wrapper-money">
                <Col span={16}>
                  <p>Tổng tiền được giảm:</p>
                </Col>
                <Col span={8}>
                  <p>
                    {formatCurrencyVND(
                      selectedPaidServices.reduce((sum, item) => {
                        const price = Number(item.servicePrice || 0);
                        const discount = Number(item.serviceDiscount || 0);
                        return sum + (price * discount) / 100;
                      }, 0) || 0,
                    )}
                  </p>
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="wrapper-money">
                <Col span={16}>
                  <p>Tổng tiền dịch vụ (đã giảm giá):</p>
                </Col>
                <Col span={8}>
                  <p>
                    {formatCurrencyVND(
                      selectedPaidServices.reduce((sum, item) => {
                        const price = Number(item.servicePrice || 0);
                        const discount = Number(item.serviceDiscount || 0);
                        return sum + price * (1 - discount / 100);
                      }, 0) || 0,
                    )}
                  </p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="body-row">
            <Row gutter={[16, 16]} className="body-row-address">
              <h1 className="header-title">Danh sách cơ sở</h1>
              <p className="header-subTitle">
                Các địa chỉ mà bạn đã cung cấp dưới đây sẽ giúp người dùng tìm
                đến dễ dàng hơn.
              </p>
            </Row>
            <Row gutter={[16, 16]} className="body-row-address-table">
              <CommonTable
                header={tableHeader}
                body={locationData?.address as any[]}
                className="location__table"
                loading={locationLoading}
                hasPagination={true}
                currentPage={filter.page ?? 1}
                totalPages={10}
                onPageChange={(page) =>
                  setFilter((prev: any) => ({ ...prev, page }))
                }
              />
            </Row>
            <Row gutter={[16, 16]} className="body-row-address-button">
              <Button
                htmlType="button"
                icon={<img src={add} alt="" />}
                onClick={() => handleUpdateClick()}
                className="button-add"
              >
                Thêm mới
              </Button>
            </Row>
          </div>

          <Modal
            open={showDelete}
            onCancel={() => {
              setShowDelete(!showDelete);
            }}
            onOk={() => {}}
            className="profile__location-modal-delete"
          >
            Bạn có chắc chắn muốn gỡ địa chỉ này!
          </Modal>

          <Modal
            open={showUpdate}
            onCancel={() => {
              setShowUpdate(!showUpdate);
            }}
            onOk={() => address.submit()}
            confirmLoading={false}
            afterOpenChange={(visible) => {
              if (visible) {
                setTimeout(() => {
                  globalThis.dispatchEvent(new Event("resize"));
                }, 0);
              }
            }}
            className="profile__location-modal-update"
          >
            <div className="modal__header">
              <h1>Cập nhật thông tin địa chỉ</h1>
              <p>Cập nhật thông tin địa chỉ mới của điểm nếu có thay đổi.</p>
            </div>
            <Row gutter={[16, 16]} className="modal__body">
              <Col span={12}>
                <MapViewCommon
                  center={{
                    lat: mapData.lat,
                    lng: mapData.long,
                  }}
                  searchState={searchState}
                  onCoordinateSelect={resolveCoordinates}
                />
              </Col>
              <Col span={12}>
                <Form
                  form={address}
                  onFinish={onAddressSubmit}
                  className="profile__location-form"
                >
                  <Row gutter={[16, 16]} className="form-row">
                    <Col span={6}>
                      <FormInput
                        label="Tên địa chỉ"
                        name="addressName"
                        placeholder="Nhập tên địa chỉ"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                    <Col span={18}>
                      <FormInput
                        label="Địa chỉ chi tiết"
                        name="fullAddress"
                        placeholder="Nhập địa chỉ chi tiết"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} className="form-row">
                    <Col span={12}>
                      <FormInput
                        label="Mã bưu chính"
                        name="addressPostal"
                        placeholder="Nhập mã bưu chính."
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <FormInput
                        label="Phường / Xã"
                        name="addressWard"
                        placeholder="Nhập phường / xã."
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} className="form-row">
                    <Col span={12}>
                      <FormInput
                        label="Quận / Huyện"
                        name="addressDistrict"
                        placeholder="Nhập quận / huyện"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <FormInput
                        label="Thành phố"
                        name="addressCity"
                        placeholder="Nhập thành phố."
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} className="form-row">
                    <Col span={12}>
                      <FormInput
                        label="Tỉnh"
                        name="addressProvince"
                        placeholder="Nhập tỉnh"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <FormInput
                        label="Quốc gia"
                        name="addressCountry"
                        placeholder="Nhập quốc giá"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} className="form-row">
                    <Col span={24}>
                      <FormInput
                        label="Vùng"
                        name="addressRegion"
                        placeholder="Nhập vùng"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} className="form-row">
                    <Col span={24}>
                      <FormTextArea
                        label="Mô tả"
                        name="addressDescription"
                        placeholder="Nhập mô tả"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: false,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} className="form-row">
                    <Col span={24}>
                      <FormTextArea
                        label="Ghi chú"
                        name="addressNote"
                        placeholder="Nhập ghi chú"
                        vertical={true}
                        formItemProps={{
                          rules: [
                            {
                              required: false,
                              message: "Trường này là trường bắt buộc.",
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Modal>

          <div className="body-row">
            <Row gutter={[16, 16]} className="body-row-action">
              <Button htmlType="submit" className="button-submit">
                Lưu
              </Button>
            </Row>
          </div>
        </Form>
      </div>
    </div>
  );
};
