// _component/EditCourseModal.tsx
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

export default function EditCourseModal({
  open,
  onClose,
  initialValues,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  initialValues: { course_name: string; description: string };
  onUpdate: (updatedData: { course_name: string; description: string }) => void;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onUpdate(values);
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="Sửa thông tin khóa học"
      okText="Cập nhật"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="course_name" label="Tên khóa học" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
