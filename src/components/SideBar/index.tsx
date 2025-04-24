import { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  AudioOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, theme, message } from "antd";
import logo from "../../assets/logo.png";
import smallLogo from "../../assets/smallLogo.png";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarProps {
  setLoading: (value: boolean) => void;
}

export default function Sidebar({ setLoading }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "/auth/logout") {
      localStorage.removeItem("USER_LOCAL");
      message.success("Đăng xuất thành công!");
      navigate("/auth/login");
      return;
    }

    if (key === "/schedule" || key === "/profile") {
      message.warning("Tính năng chưa phát triển!");
      return;
    }

    setLoading(true);
    navigate(key);
    setTimeout(() => setLoading(false), 500);
  };

  const studentMenu: MenuItem[] = [
    !collapsed
      ? { key: "group_student", label: "Khu vực học tập", type: "group" }
      : { type: "divider" },
    { key: "/", label: "Trang chủ", icon: <MailOutlined /> },
    { key: "/courses", label: "Khóa học của tôi", icon: <SettingOutlined /> },
    { key: "/schedule", label: "Lịch học", icon: <UserOutlined /> },
    { key: "/profile", label: "Hồ sơ cá nhân", icon: <UserOutlined /> },
    { type: "divider" },
    !collapsed
      ? { key: "group_admin", label: "Khu vực quản lý", type: "group" }
      : { type: "divider" },
      {
        key: "/users/view",
        label: "Quản lý người dùng",
        icon: <UserOutlined />,
      },
    {
      key: "sub-reading",
      label: "Reading",
      icon: <BookOutlined />,
      children: [
        { key: "/reading/view", label: "Xwem danh sách", icon: <BookOutlined /> },
        { key: "/reading/add", label: "Tạo bài Reading", icon: <FileAddOutlined /> },
        { key: "/reading/add-part-1", label: "Part 1", icon: <FileAddOutlined /> },
        { key: "/reading/add-part-2", label: "Part 2", icon: <FileAddOutlined /> },
        { key: "/reading/add-part-3", label: "Part 3", icon: <FileAddOutlined /> },
        { key: "/reading/add-part-4", label: "Part 4", icon: <FileAddOutlined /> },
        { key: "/reading/add-part-5", label: "Part 5", icon: <FileAddOutlined /> },
      ],
    },
    {
      key: "sub-listening",
      label: "Listening",
      icon: <AudioOutlined />,
      children: [
        { key: "/listening/view", label: "Xem danh sách", icon: <BookOutlined /> },
        { key: "/listening/add", label: "Tạo bài Listening", icon: <FileAddOutlined /> },
        { key: "/listening/add-item", label: "Thêm câu hỏi", icon: <FileAddOutlined /> },
      ],
    },
    {
      key: "/auth/logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const {
    token: { colorBgBase, colorTextBase },
  } = theme.useToken();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{ background: colorBgBase }}
    >
      <div className="flex items-center justify-between px-4 h-16">
        {!collapsed ? (
          <img
            src={logo}
            alt="Logo"
            className="h-[60px] object-contain w-full cursor-pointer"
            onClick={() => {
              localStorage.removeItem("reading_key_test_id");
              localStorage.removeItem("reading_answers");
              localStorage.removeItem("reading_correct");
              localStorage.removeItem("reading_timer_start");
              message.info("Bạn đã về trang chủ!");
              navigate("/");
            }}
          />
        ) : (
          <img
            src={smallLogo}
            alt="Small Logo"
            className="h-[40px] object-contain cursor-pointer"
            onClick={() => {
              localStorage.removeItem("reading_key_test_id");
              localStorage.removeItem("reading_answers");
              localStorage.removeItem("reading_correct");
              localStorage.removeItem("reading_timer_start");
              message.info("Bạn đã về trang chủ!");
              navigate("/");
            }}
          />
        )}

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            color: colorTextBase,
            background: "transparent",
          }}
        />
      </div>

      <div style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: colorBgBase, color: colorTextBase }}
          items={studentMenu}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
}