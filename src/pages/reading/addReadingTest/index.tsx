import { Form, Input, InputNumber, Button, message, Card, Row, Col } from "antd";
import { readingService } from "../../../config/readingServices";

export default function AddReadingTest() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    readingService.createReadingTest(values)
      .then((res) => {
        console.log('res: ', res);
        message.success("✅ Tạo bài Reading thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        message.error("Tạo bài Reading thất bại!");
      });
  };

  return (
    <Card title="Tạo mới bài Reading Test" className="m-6 shadow-md">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ duration: 35 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Key Test"
              name="key_test"
              rules={[{ required: true, message: "Vui lòng nhập Key Test" }]}
            >
              <Input placeholder='Key Test 1' />
            </Form.Item>
          </Col>

          
          <Col span={8}>
          <Form.Item
          label="Tiêu đề bài Test"
          name="tittle"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder='Reading key test 01' />
        </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Thời lượng (phút)"
              name="duration"
              rules={[{ required: true, message: "Nhập thời lượng bài test" }]}
            >
              <InputNumber min={1} max={60} className="w-full" placeholder="Ví dụ: 35" />
            </Form.Item>
          </Col>
        </Row>

        

        <Form.Item
          label="Mô tả bài Test"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder='Bài kiểm tra đọc hiểu trình độ A2 dành cho người mới bắt đầu.'
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-[#45368f] hover:bg-[#372a73]">
            Tạo bài đọc
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
