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
} from "antd";
import { readingService } from "../../../config/readingServices";

export default function AddReadingPart4() {
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
        console.error("Error fetching reading tests", err);
        message.error("Không thể tải danh sách bài đọc");
      });
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    readingService
      .createReadingPart4(values)
      .then(() => {
        message.success("✅ Thêm câu hỏi Part 4 thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        message.error("Thêm câu hỏi Part 4 thất bại!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Thêm câu hỏi Reading - Part 4" className="m-6 shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          title: "Question 4 of 5",
          description:
            "Four people respond in the comments section of an online magazine article about volunteering to clean a local park. Read the texts and then answer the questions below.",
          options: '["A", "B", "C", "D"]',
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
              label="Đáp án đúng"
              name="correct_answer"
              rules={[{ required: true, message: "Vui lòng nhập đáp án" }]}
            >
              <Input placeholder="Ví dụ: A" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Tiêu đề câu hỏi"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Mô tả câu hỏi"
          name="description"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Đoạn văn (paragraph_text)"
          name="paragraph_text"
        >
          <Input.TextArea
            rows={4}
            placeholder="B: I\'m a very busy person and I have to spend this weekend with my family..."
          />
        </Form.Item>

        <Form.Item
          label="Câu hỏi"
          name="content"
          rules={[{ required: true, message: "Nhập câu hỏi" }]}
        >
          <Input.TextArea rows={2} placeholder="Ví dụ: 2. Who thinks volunteering will help with future employment?" />
        </Form.Item>

        <Form.Item
          label="Danh sách lựa chọn (JSON)"
          name="options"
          rules={[{ required: true, message: "Nhập danh sách lựa chọn" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-[#45368f] hover:bg-[#372a73]"
          >
            Thêm câu hỏi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
