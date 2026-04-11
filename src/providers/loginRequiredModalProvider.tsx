import { Button, Modal } from "antd";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface LoginRequiredModalOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface LoginRequiredModalContextType {
  openLoginRequiredModal: (options?: LoginRequiredModalOptions) => void;
  closeLoginRequiredModal: () => void;
}

const DEFAULT_TITLE = "Yêu cầu đăng nhập";
const DEFAULT_MESSAGE = "Bạn cần đăng nhập để tiếp tục thao tác này.";
const DEFAULT_CONFIRM_TEXT = "Đăng nhập ngay";
const DEFAULT_CANCEL_TEXT = "Để sau";

const LoginRequiredModalContext =
  createContext<LoginRequiredModalContextType | null>(null);

export const useLoginRequiredModal = () => {
  const context = useContext(LoginRequiredModalContext);
  if (!context) {
    throw new Error(
      "useLoginRequiredModal must be used within LoginRequiredModalProvider",
    );
  }
  return context;
};

export const LoginRequiredModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<LoginRequiredModalOptions>({});

  const closeLoginRequiredModal = useCallback(() => {
    setOpen(false);
  }, []);

  const openLoginRequiredModal = useCallback(
    (nextOptions?: LoginRequiredModalOptions) => {
      setOptions(nextOptions ?? {});
      setOpen(true);
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    setOpen(false);
    options.onConfirm?.();
  }, [options]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    options.onCancel?.();
  }, [options]);

  const contextValue = useMemo(
    () => ({ openLoginRequiredModal, closeLoginRequiredModal }),
    [openLoginRequiredModal, closeLoginRequiredModal],
  );

  return (
    <LoginRequiredModalContext.Provider value={contextValue}>
      {children}
      <Modal
        open={open}
        centered
        closable={false}
        maskClosable={false}
        keyboard={false}
        title={options.title ?? DEFAULT_TITLE}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {options.cancelText ?? DEFAULT_CANCEL_TEXT}
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>
            {options.confirmText ?? DEFAULT_CONFIRM_TEXT}
          </Button>,
        ]}
      >
        <p>{options.message ?? DEFAULT_MESSAGE}</p>
      </Modal>
    </LoginRequiredModalContext.Provider>
  );
};
