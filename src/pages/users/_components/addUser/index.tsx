import { Modal, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { userServices } from "../../../../config/userServices";

const { Option } = Select;

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; 
}

const AddUserModal = ({ open, onClose, onSuccess }: AddUserModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await userServices.createUser(values);
      message.success("Thêm người dùng thành công");
      form.resetFields();
      onSuccess(); 
      onClose();
    } catch {
      message.error("Thêm người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm người dùng"
      open={open}
      onOk={handleAddUser}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên đăng nhập"
          name="user_name"
          rules={[{ required: true, message: "Nhập tên đăng nhập" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Nhập mật khẩu" }]}
        >
          <Input.Password />
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

        <Form.Item label="Vai trò" name="role" initialValue="student">
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="lecturer">Lecturer</Option>
            <Option value="student">Student</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" initialValue="active">
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
