import { Link } from "react-router-dom";
import background from "../../assets/images/auth/authBackGround.jpg";
import { ROUTER_PATH } from "../../router/Route";
import "./footer.scss";
import { Col, Row } from "antd";

interface FooterLink {
  label: string;
  to: string;
  state?: Record<string, unknown>;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Khám phá",
    links: [
      { label: "Trang chủ", to: ROUTER_PATH.HOME },
      { label: "Danh sách địa điểm", to: ROUTER_PATH.LOCATIONS },
      { label: "Bản đồ", to: ROUTER_PATH.MAP },
      { label: "Cho thuê địa điểm", to: ROUTER_PATH.RENTER },
    ],
  },
  {
    title: "Loại hình",
    links: [
      {
        label: "Phòng trọ",
        to: ROUTER_PATH.LOCATIONS,
        state: { rent: 1, page: 1 },
      },
      {
        label: "Căn hộ",
        to: ROUTER_PATH.LOCATIONS,
        state: { rent: 2, page: 1 },
      },
      {
        label: "Văn phòng",
        to: ROUTER_PATH.LOCATIONS,
        state: { rent: 3, page: 1 },
      },
      {
        label: "Nhà nguyên căn",
        to: ROUTER_PATH.LOCATIONS,
        state: { rent: 4, page: 1 },
      },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Nhắn tin với Hostings", to: ROUTER_PATH.SUPPORT },
      { label: "Hướng dẫn sử dụng", to: ROUTER_PATH.DOCS },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Zalo",
    href: "https://zalo.me",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.163c-.18.397-.732.727-1.17.822-.3.064-.69.114-2.006-.43-1.685-.698-2.773-2.41-2.857-2.523-.084-.113-.684-.91-.684-1.736s.432-1.23.586-1.399a.617.617 0 01.447-.21c.112 0 .224.001.322.006.103.005.242-.04.378.289.14.338.48 1.165.522 1.25.042.084.07.182.014.295-.056.113-.084.182-.168.28l-.252.295c-.084.084-.172.175-.074.343.098.168.436.72.937 1.166.644.573 1.187.75 1.355.834.168.084.266.07.364-.042.098-.113.42-.49.532-.658.112-.168.224-.14.378-.084.154.056.976.46 1.143.544.168.084.28.126.322.196.042.07.042.397-.138.794zM8.6 8.4h3.876c.105 0 .19.086.19.193a.193.193 0 01-.053.134l-2.82 3.176h2.652c.105 0 .19.087.19.194v.497a.192.192 0 01-.19.193H8.503a.192.192 0 01-.19-.193c0-.05.019-.098.053-.134l2.82-3.176H8.6a.192.192 0 01-.19-.194v-.497c0-.107.085-.193.19-.193z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:support@hostings.vn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      {/* Main Footer Content */}
      <Row gutter={[16, 16]} className="footer__main">
        {/* Brand Column */}
        <Col xs={24}  md={8} lg={6} className="footer__brand">
          <Link to={ROUTER_PATH.HOME} className="footer__logo">
            <img src={background} alt="Hostings Logo" />
            <span className="footer__logo-text">Hostings</span>
          </Link>
          <p className="footer__tagline">
            Nền tảng cho thuê bất động sản hàng đầu Việt Nam. Kết nối chủ nhà và
            người thuê một cách nhanh chóng, tiện lợi.
          </p>
          {/* Social Links */}
          <div className="footer__socials">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </Col>

        {/* Nav Columns */}
        <Col xs={24} lg={18}>
          <Row gutter={[16, 16]} className="footer__nav">
            {FOOTER_COLUMNS.map((col) => (
              <Col
                xs={12}
                md={8}
                key={col.title}
                className="footer__col"
              >
                <h3 className="footer__col-title">{col.title}</h3>
                <ul className="footer__col-list">
                  {col.links.map((link) => (
                    <li key={link.label} className="footer__col-item">
                      {link.external ? (
                        <a
                          href={link.to}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.to} state={link.state}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* ─── Bottom Bar ─── */}
      <div className="footer__bottom">
        <span>© {currentYear} Hostings. All rights reserved.</span>
        <span className="footer__bottom-sep">·</span>
        <Link to={ROUTER_PATH.DOCS}>Điều khoản sử dụng</Link>
        <span className="footer__bottom-sep">·</span>
        <Link to={ROUTER_PATH.DOCS}>Chính sách bảo mật</Link>
      </div>
    </footer>
  );
};
