import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createConversation } from "@api/configs/chat.config";
import {
  getComment,
  getLocationByCode,
  getRelatedLocation,
} from "@api/configs/location.config";
import type { LocationParamDto } from "@api/dtos/location.dto";
import { LocationEndpoint } from "@api/endpoints/location.endpoint";
import { ConverationEndpoint } from "@api/endpoints/chat.endpoint";
import type { MediaItem } from "@common/config/common-config";
import { DEFAULT_MESSAGE, NOTI_ERROR } from "@common/constants/constants";
import { useRequireLoginAction } from "@common/hooks/useRequireLoginAction";
import { useLoading } from "@providers/loadingProvider";
import { useNotification } from "@providers/notificationProvider";
import { ROUTER_PATH } from "@/router/Route";

export const useLocationDetail = () => {
  const location = useLocation();
  const { code: locationCodeFromParams } = useParams<{ code: string }>();
  const locationCode =
    (location.state as { code?: string } | null)?.code ??
    locationCodeFromParams;
  const { setLoading } = useLoading();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { requireLoginAction } = useRequireLoginAction();

  const [filter, setFilter] = useState<LocationParamDto>({
    locationCode,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (locationCode) {
      setFilter({
        locationCode,
        page: 1,
        limit: 10,
      });
    }
  }, [locationCode]);

  const { data: locationDetail, isLoading } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_BY_CODE, locationCode],
    queryFn: () => getLocationByCode(locationCode ?? ""),
    enabled: Boolean(locationCode),
  });

  const media: MediaItem[] =
    locationDetail?.media?.map((m) => ({
      url: m.url,
      type: m.type.toLowerCase() as "image" | "video",
    })) || [];

  const { data: commentData, refetch: refetchComment } = useQuery({
    queryKey: [LocationEndpoint.GET_LOCATION_COMMENT, filter],
    queryFn: () => getComment(filter),
    enabled: Boolean(locationCode),
  });

  const {
    data: relatedLocationData,
    isLoading: relatedLocationLoading,
    isError: relatedLocationError,
  } = useQuery({
    queryKey: [`${LocationEndpoint.GET_RELATED_LOCATION}/related`, locationCode],
    queryFn: () =>
      getRelatedLocation({
        locationCode: locationCode ?? "",
        page: 1,
        limit: 8,
      }),
    enabled: Boolean(locationCode),
  });

  const relatedLocations =
    relatedLocationData?.data?.filter(
      (relatedLocation) => relatedLocation.locationCode !== locationCode,
    ) ?? [];

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const contactMutation = useMutation({
    mutationFn: ({
      toUserCd,
      type,
      locationCd,
    }: {
      toUserCd: string;
      type: string;
      locationCd?: string;
    }) => createConversation(toUserCd, type, locationCd),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [ConverationEndpoint.GET_CHAT_CONVERSATION],
      });

      navigate(ROUTER_PATH.PROFILE_CHAT, {
        state: {
          conversationId: data?.conversationId ?? data?.id,
          source: "location-detail",
        },
      });
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

  const handleContactOwner = (
    toUserCd: string,
    type: string,
    locationCd?: string,
  ) => {
    requireLoginAction(
      () => {
        contactMutation.mutate({ toUserCd, type, locationCd });
      },
      {
        message: "Ban can dang nhap de lien he chu phong.",
      },
    );
  };

  const handleCardClick = (code: string) => {
    const url = ROUTER_PATH.LOCATION_DETAIL.replace(":code", code);
    navigate(url, { state: { code } });
  };

  const handleShowMoreComments = (nextPage: number) => {
    setFilter((prev) => ({ ...prev, page: nextPage }));
  };

  return {
    media,
    locationDetail,
    isLoading,
    commentData,
    refetchComment,
    relatedLocations,
    relatedLocationLoading,
    relatedLocationError,
    handleContactOwner,
    handleCardClick,
    handleShowMoreComments,
  };
};
