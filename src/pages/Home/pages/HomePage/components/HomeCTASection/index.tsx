import { Button } from "antd";

interface HomeCTASectionProps {
  onOpenAll: () => void;
}

export const HomeCTASection = ({ onOpenAll }: HomeCTASectionProps) => {
  return (
    <section className="home_page__cta">
      <div className="home_page__cta-content">
        <h2>Cần xem nhiều hơn?</h2>
        <p>
          Trang danh sách đầy đủ cho phép lọc theo giá, khu vực, loại hình và
          sắp xếp theo mức độ phù hợp.
        </p>
      </div>
      <Button type="default" size="large" onClick={onOpenAll}>
        Đi tới trang danh sách
      </Button>
    </section>
  );
};
