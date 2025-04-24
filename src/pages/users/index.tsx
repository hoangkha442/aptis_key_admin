import { useEffect, useState } from "react";
import {
  Table,
  Spin,
  message,
  Popconfirm,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tooltip 
} from "antd";
import {
  EditOutlined,
  KeyOutlined,
  DeleteOutlined,
  UserAddOutlined,
  FilterOutlined,
  StopOutlined,
} from "@ant-design/icons";

import { userServices } from "../../config/userServices";
import AddUserModal from "./_components/addUser";
import { Tag } from "antd";
const { Option } = Select;

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredRole, setFilteredRole] = useState<string | null>(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userServices.getAllUsers();
      setUsers(res.data);
    } catch {
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await userServices.deleteUser(id);
      message.success("Xoá người dùng thành công");
      fetchUsers();
    } catch {
      message.error("Không thể xoá người dùng");
    }
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setEditingUserId(record.user_id);
    setIsEditModalOpen(true);
  };

  const handleUpdatePassword = (record: any) => {
    passwordForm.resetFields();
    setEditingUserId(record.user_id);
    setIsPasswordModalOpen(true);
  };
  const handleActivateUser = async (id: number, oldData: any) => {
    try {
      await userServices.updateUser(id, {
        ...oldData,
        status: "active",
      });
      message.success("Đã kích hoạt người dùng");
      fetchUsers();
    } catch {
      message.error("Thao tác thất bại");
    }
  };
  
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await userServices.updateUser(editingUserId!, values);
      message.success("Cập nhật thông tin người dùng thành công");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      await userServices.updateUser(editingUserId!, {
        password: values.password,
      });
      message.success("Đổi mật khẩu thành công");
      setIsPasswordModalOpen(false);
    } catch {
      message.error("Đổi mật khẩu thất bại");
    }
  };
  const handleEditSubmitInactive = async (id: number, oldData: any) => {
    try {
      await userServices.updateUser(id, {
        ...oldData,
        status: "inactive",
      });
      message.success("Đã vô hiệu hóa người dùng");
      fetchUsers();
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "user_id",
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone_number",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role: string) => {
        let color = "default";
        if (role === "admin") color = "red";
        else if (role === "lecturer") color = "blue";
        else if (role === "student") color = "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const color = status === "active" ? "green" : "volcano";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
        title: "Hành động",
        render: (_: any, record: any) => (
          <div className="flex flex-wrap gap-2">
            <Tooltip title="Sửa thông tin">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
      
            <Tooltip title="Đổi mật khẩu">
              <Button
                type="link"
                icon={<KeyOutlined />}
                onClick={() => handleUpdatePassword(record)}
              />
            </Tooltip>
      
            {record.role === "student" && (
              <Tooltip title="Xoá người dùng">
                <Popconfirm
                  title="Bạn có chắc muốn xoá người dùng này?"
                  onConfirm={() => handleDelete(record.user_id)}
                >
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            )}
      
            {record.status === "active" && (
              <Tooltip title="Vô hiệu hóa người dùng">
                <Popconfirm
                  title="Bạn có chắc muốn vô hiệu hóa người dùng này?"
                  onConfirm={() =>
                    handleEditSubmitInactive(record.user_id, record)
                  }
                >
                  <Button type="link" danger icon={<StopOutlined />} />
                </Popconfirm>
              </Tooltip>
            )}
      
            {record.status === "inactive" && (
              <Tooltip title="Kích hoạt lại người dùng">
                <Button
                  type="link"
                  icon={<StopOutlined rotate={180} />}
                  onClick={() => handleActivateUser(record.user_id, record)}
                />
              </Tooltip>
            )}
          </div>
        ),
      }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        <div className="flex gap-2">
          <Select
            placeholder="Lọc theo vai trò"
            allowClear
            style={{ width: 180 }}
            value={filteredRole || undefined}
            onChange={(value) => setFilteredRole(value || null)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value={null}>Tất cả</Option>
            <Option value="admin">Admin</Option>
            <Option value="lecturer">Lecturer</Option>
            <Option value="student">Student</Option>
          </Select>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={openAddModal}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={
            filteredRole
              ? users.filter((u: any) => u.role === filteredRole)
              : users
          }
          columns={columns}
          rowKey="user_id"
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Modal Edit */}
      <Modal
        title="Cập nhật thông tin người dùng"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên đăng nhập"
            name="user_name"
            rules={[{ required: true, message: "Nhập tên đăng nhập" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Họ tên" name="full_name">
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Email không hợp lệ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone_number">
            <Input />
          </Form.Item>

          <Form.Item label="Vai trò" name="role">
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="lecturer">Lecturer</Option>
              <Option value="student">Student</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Đổi mật khẩu"
        open={isPasswordModalOpen}
        onOk={handlePasswordSubmit}
        onCancel={() => setIsPasswordModalOpen(false)}
      >
        <Form layout="vertical" form={passwordForm}>
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <AddUserModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
