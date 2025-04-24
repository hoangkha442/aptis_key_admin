// src/pages/listening/ListeningView.tsx
import { Table, Typography, message, Modal, Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { listeningService } from "../../../config/listeningServices";

const { Title } = Typography;

interface ListeningItem {
    listening_test_items_id: number;
    question_number: string;
    tittle: string;
    description: string;
    content: string;
    correct_answer: string;
    options: string;
    script?: string;
    topic: string;
  }
  

interface ListeningTest {
  listening_test_id: number;
  key_test: string;
  tittle: string;
  description: string;
  duration: number;
  listening_test_items: Record<string, ListeningItem[]>;
}

export default function ListeningView() {
  const [data, setData] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(false);

  const [editItem, setEditItem] = useState<ListeningItem | null>(null);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [itemForm] = Form.useForm();

  const fetchListeningData = async () => {
    setLoading(true);
    try {
      const res = await listeningService.getAllListeningKeys();
      const allTests = res.data || [];
      const testDetails = await Promise.all(
        allTests.map((test: any) =>
          listeningService
            .getListeningById({ listening_test_id: test.listening_test_id })
            .then((res) => res.data)
            .catch(() => null)
        )
      );
      const validTests = testDetails.filter((t) => t !== null);
      setData(validTests);
    } catch (err) {
      console.error("Error loading listening tests:", err);
      message.error("Không thể tải danh sách bài Listening");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListeningData();
  }, []);

  const handleUpdateItem = async (values: any) => {
    if (!editItem) return;
    try {
      await listeningService.updateListeningItem(editItem.listening_test_items_id, values);
      message.success("Cập nhật câu hỏi thành công");
      setIsItemModalVisible(false);
      fetchListeningData();
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi cập nhật câu hỏi");
    }
  };

  const itemColumns = [
    {
      title: "STT",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Câu hỏi",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Đáp án",
      dataIndex: "correct_answer",
      key: "correct_answer",
    },
    {
      title: "Script",
      dataIndex: "script",
      key: "script",
      render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
    },
    {
      title: "Sửa",
      key: "edit",
      render: (_: any, record: ListeningItem) => (
        <Button
          type="link"
          onClick={() => {
            setEditItem(record);
            itemForm.setFieldsValue(record);
            setIsItemModalVisible(true);
          }}
        >
          Sửa
        </Button>
      ),
    },
    {
      title: "Xoá",
      key: "delete",
      render: (_: any, record: ListeningItem) => (
        <Button
          danger
          type="link"
          onClick={() => {
            Modal.confirm({
              title: "Xác nhận xoá câu hỏi?",
              content: record.content,
              okText: "Xoá",
              cancelText: "Huỷ",
              onOk: async () => {
                try {
                  await listeningService.deleteListeningItem(record.listening_test_items_id);
                  message.success("Đã xoá câu hỏi");
                  fetchListeningData();
                } catch (err) {
                  console.error(err);
                  message.error("Lỗi khi xoá câu hỏi");
                }
              },
            });
          }}
        >
          Xoá
        </Button>
      ),
    },
  ];
  
  

  const mainColumns = [
    {
      title: "ID",
      dataIndex: "listening_test_id",
      key: "id",
    },
    {
      title: "Key Test",
      dataIndex: "key_test",
      key: "key_test",
    },
    {
      title: "Tiêu đề",
      dataIndex: "tittle",
      key: "tittle",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (d: number) => `${d} phút`,
    },
    {
      title: "Tổng số câu hỏi",
      key: "total_items",
      render: (_: any, record: ListeningTest) =>
        Object.values(record.listening_test_items || {}).reduce(
          (total, group: any[]) => total + group.length,
          0
        ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={3}>Danh sách bài Listening & Câu hỏi</Title>
      <Table
        columns={mainColumns}
        dataSource={data}
        rowKey="listening_test_id"
        loading={loading}
        bordered
        expandable={{
          expandedRowRender: (record: ListeningTest) => (
            <>
              {Object.entries(record.listening_test_items).map(
                ([group, items]: [string, ListeningItem[]]) => (
                  <div key={group} className="mb-4">
                    <b>{group}</b>
                    <Table
                      columns={itemColumns}
                      dataSource={items}
                      rowKey="listening_test_items_id"
                      pagination={false}
                      size="small"
                      bordered
                    />
                  </div>
                )
              )}
            </>
          ),
        }}
      />

<Modal
  title="Cập nhật câu hỏi"
  open={isItemModalVisible}
  onCancel={() => setIsItemModalVisible(false)}
  onOk={() => {
    itemForm
      .validateFields()
      .then(handleUpdateItem)
      .catch((err) => console.log(err));
  }}
  okText="Cập nhật"
  cancelText="Hủy"
>
  <Form form={itemForm} layout="vertical">
    <Form.Item name="question_number" label="Mã câu hỏi" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="tittle" label="Tiêu đề câu hỏi">
      <Input />
    </Form.Item>
    <Form.Item name="description" label="Mô tả câu hỏi">
      <Input.TextArea />
    </Form.Item>
    <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
      <Input.TextArea />
    </Form.Item>
    <Form.Item name="options" label="Tùy chọn (JSON)">
      <Input.TextArea placeholder='["Option A", "Option B", "Option C"]' />
    </Form.Item>
    <Form.Item name="correct_answer" label="Đáp án đúng" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="topic" label="Chủ đề">
      <Input />
    </Form.Item>
    <Form.Item name="script" label="Script">
      <Input.TextArea rows={3} />
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
}
