import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  message,
  Select,
  InputNumber,
} from "antd";
import { readingService } from "../../../config/readingServices";

export default function AddReadingPart5() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readingTests, setReadingTests] = useState<
    { reading_test_id: number; tittle: string }[]
  >([]);

  useEffect(() => {
    readingService
      .getAllReadingKeys()
      .then((res) => setReadingTests(res.data || []))
      .catch((err) => {
        console.error("Error fetching reading keys", err);
        message.error("Không thể tải danh sách bài Reading");
      });
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    readingService
      .createReadingPart5(values)
      .then(() => {
        message.success("✅ Thêm câu hỏi Part 5 thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        message.error("Thêm câu hỏi Part 5 thất bại!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Thêm câu hỏi Reading - Part 5" className="m-6 shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          title: "Question 5 of 5",
          name_of_test: "History of Zoos",
          description: "Choose a heading for each numbered paragraph (1–7) from the drop-down box.",
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="ID Reading Test"
              name="reading_test_id"
              rules={[{ required: true, message: "Vui lòng chọn bài đọc" }]}
            >
              <Select placeholder="Chọn bài đọc">
                {readingTests.map((test) => (
                  <Select.Option
                    key={test.reading_test_id}
                    value={test.reading_test_id}
                  >
                    {test.reading_test_id} - {test.tittle}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Thứ tự đoạn (sort_order)"
              name="sort_order"
              rules={[{ required: true, message: "Nhập thứ tự đoạn" }]}
            >
              <InputNumber min={1} max={20} className="w-full" placeholder="Ví dụ: 1" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Tiêu đề câu hỏi"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề câu hỏi" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tên bài test nhỏ (name_of_test)"
          name="name_of_test"
          rules={[{ required: true, message: "Nhập tên bài test nhỏ" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả câu hỏi"
          name="description"
          rules={[{ required: true, message: "Nhập mô tả câu hỏi" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Nội dung đoạn văn (content)"
          name="content"
          rules={[{ required: true, message: "Nhập nội dung đoạn văn" }]}
        >
          <Input.TextArea rows={3} placeholder="Ví dụ: 'Symbol of privilege and wealth'" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-[#45368f] hover:bg-[#372a73]"
          >
            Thêm đoạn Part 5
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
