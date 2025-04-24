import { Form, Input, Button, Card, Row, Col, message, Select } from "antd";
import { useState, useEffect } from "react";
import { readingService } from "../../../config/readingServices";

export default function AddReadingPart1() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [readingTests, setReadingTests] = useState<
    { reading_test_id: number; tittle: string }[]
  >([]);

  useEffect(() => {
    readingService
      .getAllReadingKeys()
      .then((res) => {
        setReadingTests(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching reading keys", err);
        message.error("Không thể tải danh sách bài Reading");
      });
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    readingService
      .createReadingPart1(values)
      .then(() => {
        message.success("✅ Thêm câu hỏi Part 1 thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        message.error("Thêm câu hỏi Part 1 thất bại!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Thêm câu hỏi Reading - Part 1" className="m-6 shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          title: "Question 1 of 5",
          description:
            "Read the email from a person to his/her friend. Choose one word from the list for each gap. The first one is done for you.",
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="ID Reading Test"
              name="reading_test_id"
              rules={[{ required: true, message: "Vui lòng chọn bài Reading Test" }]}
            >
              <Select placeholder="Chọn bài Reading">
                {readingTests.map((test) => (
                  <Select.Option key={test.reading_test_id} value={test.reading_test_id}>
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
              rules={[{ required: true, message: "Nhập đáp án đúng" }]}
            >
              <Input placeholder="Ví dụ: park" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Tiêu đề câu hỏi"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề" }]}
            >
              <Input placeholder="Question 1 of 5" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Mô tả câu hỏi"
          name="description"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <Input placeholder="Đọc email và chọn từ đúng" />
        </Form.Item>

        <Form.Item
          label="Nội dung câu hỏi"
          name="content"
          rules={[{ required: true, message: "Nhập nội dung câu hỏi" }]}
        >
          <Input.TextArea rows={2} placeholder="I go to the ___ every morning." />
        </Form.Item>

        <Form.Item
          label="Danh sách đáp án (JSON)"
          name="options"
          rules={[{ required: true, message: "Nhập danh sách đáp án" }]}
        >
          <Input.TextArea rows={2} placeholder='["park", "school", "shop"]' />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#45368f] hover:bg-[#372a73]"
            loading={loading}
          >
            Thêm câu hỏi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
