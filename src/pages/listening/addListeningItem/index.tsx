import { Form, Input, Button, Card, message, Select, Row, Col } from "antd";
import { useState, useEffect } from "react";
import { listeningService } from "../../../config/listeningServices";

const QUESTION_TEMPLATES: Record<string, Partial<any>> = {
  "Question 1 - 13": {
    description: "Choose the correct answer.",
    topic: "General Listening",
    options: '["Option A", "Option B", "Option C"]',
    content: 'What time do they meet?',
    correct_answer: '6.30pm',
    tittle: 'Listening Question 1'
  },
  "Question 14-A": {
    description: "Speaker A ...",
    topic: "Protect the environment",
    options:
      '["Give away used items", "Does not use commercial cleaning products", "Buy environmentally friendly products", "Reuse containers for storing food"]',
    content: 'What does Speaker A do?',
    correct_answer: 'Does not use commercial cleaning products',
    tittle: 'Listening Matching'
  },
  "Question 15-1": {
    description:
      "Listen to a man and a woman discussing the changes in the workplace.",
    topic: "changes in the workplace",
    options: '["Man", "Woman", "Both"]',
    content: 'Who believes job security is no longer reliable?',
    correct_answer: 'Woman',
    tittle: 'Listening Opinion'
  },
  "Question 16-1": {
    description: "Answer the 2 questions below based on the audio.",
    topic: "Study Break",
    options: '["He wasn\'t ready to start higher education", "He didn\'t have enough money", "He wanted to work first"]',
    content: 'Why hasn\'t he gone to college?',
    correct_answer: "He wasn't ready to start higher education",
    tittle: 'Listening – Study Break'
  },
  "Question 17-1": {
    description: "Answer the 2 questions below based on the audio.",
    topic: "Book Review",
    options: '["It uses simple language to describe complex ideas", "It was written by a famous author", "It was made into a movie"]',
    content: 'Why is the book so popular?',
    correct_answer: 'It uses simple language to describe complex ideas',
    tittle: 'Listening – Book Review'
  },
};

export default function AddListeningItem() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listeningTests, setListeningTests] = useState<{
    listening_test_id: number;
    tittle: string;
  }[]>([]);

  useEffect(() => {
    listeningService
      .getAllListeningKeys()
      .then((res) => {
        setListeningTests(res.data || []);
      })
      .catch((err) => {
        console.error("❌ Error fetching listening keys", err);
        message.error("Không thể tải danh sách Listening Test");
      });
  }, []);

  const onFinish = (values: any) => {
    console.log("Submitting values:", values);
    setLoading(true);
    listeningService
      .createListeningItem(values)
      .then(() => {
        message.success("✅ Thêm câu hỏi Listening thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        message.error("Thêm câu hỏi Listening thất bại!");
      })
      .finally(() => setLoading(false));
  };

  const handleQuestionNumberChange = (questionNumber: string) => {
    const template = QUESTION_TEMPLATES[questionNumber];
    if (template) {
      form.setFieldsValue({
        question_number: questionNumber,
        tittle: undefined,
        description: undefined,
        content: undefined,
        correct_answer: undefined,
        options: undefined,
        topic: undefined,
        script: '',
      });

      setTimeout(() => {
        form.setFieldsValue({
          question_number: questionNumber,
          ...template,
        });
      }, 0);

      message.info(`Đã tự động điền nội dung cho ${questionNumber}`);
    }
  };

  return (
    <Card title="Thêm câu hỏi Listening Test" className="m-6 shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ script: '', topic: '', options: '[]' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="ID Listening Test"
              name="listening_test_id"
              rules={[{ required: true, message: "Vui lòng chọn bài Listening" }]}
            >
              <Select placeholder="Chọn bài Listening">
                {listeningTests.map((test) => (
                  <Select.Option
                    key={test.listening_test_id}
                    value={test.listening_test_id}
                  >
                    {test.listening_test_id} - {test.tittle}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Question Number"
              name="question_number"
              rules={[{ required: true, message: "Vui lòng chọn dạng câu hỏi" }]}
            >
              <Select placeholder="Chọn dạng câu hỏi" onChange={handleQuestionNumberChange}>
                {Object.keys(QUESTION_TEMPLATES).map((key) => (
                  <Select.Option key={key} value={key}>
                    {key}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tiêu đề" name="tittle" rules={[{ required: true }]}>
              <Input placeholder="Ví dụ: Listening Question 1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mô tả" name="description">
              <Input placeholder="Ví dụ: Choose the correct answer." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Câu hỏi"
              name="content"
              rules={[{ required: true }]}
            >
              <Input placeholder="Ví dụ: What time do they meet?" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Đáp án đúng"
              name="correct_answer"
              rules={[{ required: true }]}
            >
              <Input placeholder="Ví dụ: 6.30pm" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Options (JSON)"
              name="options"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={2}
                placeholder='["Option A", "Option B", "Option C"]'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Topic" name="topic">
              <Input placeholder="Ví dụ: General Listening" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Script" name="script">
          <Input.TextArea rows={3} placeholder="Nội dung script nếu có..." />
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
