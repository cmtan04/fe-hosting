import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import {
  type LoginRequiredModalOptions,
  useLoginRequiredModal,
} from "../../providers/loginRequiredModalProvider";
import { ROUTER_PATH } from "../../router/Route";

interface RequireLoginActionOptions extends LoginRequiredModalOptions {
  shouldNavigateToSignIn?: boolean;
}

export const useRequireLoginAction = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openLoginRequiredModal } = useLoginRequiredModal();

  const requireLoginAction = useCallback(
    (action: () => void, options?: RequireLoginActionOptions) => {
      if (isAuthenticated) {
        action();
        return true;
      }

      openLoginRequiredModal({
        ...options,
        onConfirm: () => {
          options?.onConfirm?.();
          if (options?.shouldNavigateToSignIn === false) {
            return;
          }
          navigate(ROUTER_PATH.SIGN_IN);
        },
        onCancel: () => {
          options?.onCancel?.();
        },
      });

      return false;
    },
    [isAuthenticated, navigate, openLoginRequiredModal],
  );

  return { requireLoginAction, isAuthenticated };
};
