import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Form, Row } from "antd";
import { UserEndpoint } from "../../../../api/endpoints/user.endpoint";
import { getUserPRofile } from "../../../../api/configs/user.config";
import phone from "../../../../assets/svg/profile/phone.svg";
import mail from "../../../../assets/svg/profile/mail.svg";
import bio from "../../../../assets/svg/profile/bio.svg";
import upload from "../../../../assets/svg/profile/upload.svg";
import { useEffect, useRef, useState } from "react";
import { uploadImage } from "../../../../api/configs/common.config";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
} from "../../../../common/constants/constants";
import { isAxiosError } from "axios";
import { useLoading } from "../../../../providers/loadingProvider";
import { useNotification } from "../../../../providers/notificationProvider";

export const ProfileInformation = () => {
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState<string>("");

  const { data: user, isLoading } = useQuery({
    queryKey: [UserEndpoint.GET_USER_INFORMATION],
    queryFn: () => getUserPRofile(),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const uploadMutation = useMutation({
    mutationFn: (payload: FormData) => uploadImage(payload),
    onSuccess: (data) => {
      setUrl(data.imageUrl);
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
      setUrl("");
    },

    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (user) {
      setUrl(user.avatarUrl);
      form.setFieldsValue({
        userName: user.username,
        userEmail: user.email,
        userPhone: user.phone,
        userAdress: user.fullAddress,
      });
    }
  }, [user, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="profile__information">
      <Col className="profile__information-header">
        <img
          className="image-background"
          crossOrigin="anonymous"
          src={user?.avatarUrl}
          alt=""
        />

        <div className="blur-blender"></div>
        <Col className="profile__information-header-content">
          <h1 className="title">Thông tin cá nhân</h1>
          <div className="content">
            <div className="content__avatar">
              <figure style={{ margin: 0 }}>
                {url && (
                  <img className="content__avatar-url" src={url} alt="" />
                )}
              </figure>
              <label htmlFor="upload" className="content__avatar-upload">
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="content__info">
              <p className="content__info-text name">{user?.fullName}</p>
              <p className="content__info-text email">
                <img className="content__info-icon" src={mail} alt="" />
                {user?.email}
              </p>
              <p className="content__info-text bio">
                <img className="content__info-icon" src={bio} alt="" />
                {user?.bio}
              </p>
              <p className="content__info-text phone">
                <img className="content__info-icon" src={phone} alt="" />
                {user?.phone}
              </p>
            </div>
          </div>
        </Col>
      </Col>

      <Col className="profile__information-body"></Col>
    </div>
  );
};
