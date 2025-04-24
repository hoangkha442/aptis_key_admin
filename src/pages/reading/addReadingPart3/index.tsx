import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Row, Col, message, Select, InputNumber } from "antd";
import { readingService } from "../../../config/readingServices";

export default function AddReadingPart3() {
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
        console.error("Error loading reading keys", err);
        message.error("Không thể tải danh sách bài đọc.");
      });
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    readingService
      .createReadingPart3(values)
      .then(() => {
        message.success("✅ Thêm câu hỏi Part 3 thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        message.error("Thêm câu hỏi Part 3 thất bại!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Thêm câu hỏi Reading - Part 3" className="m-6 shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          title: "Question 3 of 5",
          description:
            "Put the sentences below in the right order. The first sentence is done for you.",
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
                {readingTests.map((test, index) => (
                  <Select.Option key={test.reading_test_id} value={test.reading_test_id}>
                    {index + 1} - {test.tittle}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Thứ tự (sort order)"
              name="sort_order"
              rules={[{ required: true, message: "Nhập thứ tự câu" }]}
            >
              <InputNumber className="w-full" min={1} placeholder="Ví dụ: 1" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Tên bài test nhỏ"
              name="name_of_test"
              rules={[{ required: true, message: "Nhập tên bài test nhỏ" }]}
            >
              <Input placeholder="Using public transport" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tiêu đề câu hỏi"
          name="title"
          rules={[{ required: true, message: "Nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả câu hỏi"
          name="description"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Nội dung câu"
          name="content"
          rules={[{ required: true, message: "Nhập nội dung câu" }]}
        >
          <Input.TextArea rows={2} placeholder="They were out of order and the traffic moved very slowly." />
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
