import { Form, Input, Button, InputNumber, Card, message } from "antd";
import { useState } from "react";
import { listeningService } from "../../../config/listeningServices";

export default function AddListeningTest() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    listeningService
      .createListeningTest(values)
      .then(() => {
        message.success("✅ Tạo bài Listening thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        message.error("Tạo bài Listening thất bại!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Tạo mới bài Listening Test" className="m-6 shadow-md">
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ duration: 45 }}>
        <Form.Item
          label="Key Test"
          name="key_test"
          rules={[{ required: true, message: "Vui lòng nhập Key Test" }]}
        >
          <Input placeholder="Key Test 1" />
        </Form.Item>

        <Form.Item
          label="Tiêu đề bài Test"
          name="tittle"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Listening key test 01" />
        </Form.Item>

        <Form.Item
          label="Mô tả bài Test"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={4} placeholder="Entry-level listening test" />
        </Form.Item>

        <Form.Item
          label="Thời lượng (phút)"
          name="duration"
          rules={[{ required: true, message: "Nhập thời lượng bài test" }]}
        >
          <InputNumber min={1} max={60} className="w-full" placeholder="45" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-[#45368f] hover:bg-[#372a73]" loading={loading}>
            Tạo bài nghe
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}