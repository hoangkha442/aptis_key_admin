import { Table, Typography, message, Modal, Form, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { readingService } from "../../../config/readingServices";
import { Popconfirm } from "antd";
const { Title } = Typography;

interface ReadingItemBase {
  [key: string]: any;
  reading_part_1_id?: number;
  reading_part_2_id?: number;
  reading_part_3_id?: number;
  reading_part_4_id?: number;
  reading_part_5_id?: number;
}

interface ReadingTest {
  reading_test_id: number;
  key_test: string;
  tittle: string;
  description: string;
  duration: number;
  parts: Record<string, ReadingItemBase[]>;
}

export default function ReadingView() {
  const [data, setData] = useState<ReadingTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<ReadingItemBase | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchReadingData = async () => {
    setLoading(true);
    try {
      const res = await readingService.getAllReadingKeys();
      const allTests = res.data || [];
      const testDetails = await Promise.all(
        allTests.map((test: any) =>
          readingService
            .getReadingById(test.reading_test_id)
            .then((res) => res.data)
            .catch(() => null)
        )
      );
      const validTests = testDetails
        .filter((t) => t !== null)
        .map((test) => ({
          ...test,
          parts: {
            part1: test.reading_part_1 || [],
            part2: test.reading_part_2 || [],
            part3: test.reading_part_3 || [],
            part4: test.reading_part_4 || [],
            part5: test.reading_part_5 || [],
          },
        }));
      setData(validTests);
    } catch {
      message.error("Không thể tải danh sách bài Reading");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadingData();
  }, []);

  useEffect(() => {
    if (editItem) {
      const optionsValue = (() => {
        try {
          return Array.isArray(editItem.options)
            ? editItem.options.join("\n")
            : JSON.parse(editItem.options || "[]").join("\n");
        } catch {
          return editItem.options || "";
        }
      })();

      const values: Record<string, any> = { ...editItem };

      if (editItem.options !== undefined) values.options = optionsValue;

      form.setFieldsValue(values);
    }
  }, [editItem]);

  const handleUpdateItem = async (values: any) => {
    if (!editItem) return;
    try {
      const part = editItem.part;
      const id = editItem.id;
      const updateFn = (readingService as any)[`updateReadingPart${part.replace("part", "")}`];

      const payload = {
        ...values,
        options: values.options
          ? JSON.stringify(values.options.split("\n").map((s: string) => s.trim()))
          : undefined,
      };

      await updateFn(id, payload);
      message.success("Cập nhật câu hỏi thành công");
      setIsModalVisible(false);
      setEditItem(null);
      fetchReadingData();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi cập nhật câu hỏi");
    }
  };

  const renderModalForm = (part: string) => {
    const baseFields = [
      <Form.Item key="title" name="title" label="Tiêu đề" rules={[{ required: true }]}>
        <Input />
      </Form.Item>,
      <Form.Item key="description" name="description" label="Mô tả">
        <Input.TextArea />
      </Form.Item>,
    ];

    const optionField = (
      <Form.Item
        key="options"
        name="options"
        label="Danh sách lựa chọn"
        tooltip="Mỗi dòng là 1 lựa chọn"
      >
        <Input.TextArea placeholder="Option A\nOption B\nOption C" />
      </Form.Item>
    );

    switch (part) {
      case "part1":
        return (
          <>
            {baseFields}
            <Form.Item name="content" label="Câu hỏi" rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="correct_answer" label="Đáp án đúng">
              <Input />
            </Form.Item>
            {optionField}
          </>
        );
      case "part2":
      case "part3":
        return (
          <>
            {baseFields}
            <Form.Item name="name_of_test" label="Tên bài test nhỏ">
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Đoạn văn">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="sort_order" label="Thứ tự đúng">
              <Input type="number" />
            </Form.Item>
          </>
        );
      case "part4":
        return (
          <>
            {baseFields}
            <Form.Item name="paragraph_text" label="Đoạn hội thoại">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="content" label="Câu hỏi nhỏ">
              <Input />
            </Form.Item>
            <Form.Item name="correct_answer" label="Đáp án">
              <Input />
            </Form.Item>
            {optionField}
          </>
        );
      case "part5":
        return (
          <>
            {baseFields}
            <Form.Item name="name_of_test" label="Tên bài test nhỏ">
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Đoạn văn">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="sort_order" label="Thứ tự">
              <Input type="number" />
            </Form.Item>
          </>
        );
      default:
        return <></>;
    }
  };

  const renderPartTable = (items: ReadingItemBase[], partKey: string) => {
    return (
      <Table
        columns={[
          {
            title: "STT",
            key: "index",
            render: (_: any, __: any, i: number) => i + 1,
            width: 60,
          },
          {
            title: "Tiêu đề",
            dataIndex: "title",
          },
          {
            title: "Thao tác",
            key: "actions",
            render: (_: any, record: any) => {
              const partKeyNormalized = partKey.replace("part", "part_");
              const idKey = `reading_${partKeyNormalized}_id`;
              const id = record[idKey] || record.id;
  
              return (
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      setEditItem({ ...record, id, part: partKey });
                      setIsModalVisible(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xoá câu hỏi này?"
                    onConfirm={async () => {
                      try {
                        const deleteFn = (readingService as any)[`deleteReadingPart${partKey.replace("part", "")}`];
                        await deleteFn(id);
                        message.success("Xoá câu hỏi thành công");
                        fetchReadingData();
                      } catch (err) {
                        console.error(err);
                        message.error("Xoá thất bại");
                      }
                    }}
                    okText="Xoá"
                    cancelText="Huỷ"
                  >
                    <Button type="link" danger>
                      Xoá
                    </Button>
                  </Popconfirm>
                </>
              );
            },
          },
        ]}
        dataSource={items.map((item) => {
          const partKeyNormalized = partKey.replace("part", "part_");
          const idKey = `reading_${partKeyNormalized}_id`;
          return {
            ...item,
            id: item[idKey] || item.id,
            part: partKey,
          };
        })}
        rowKey="id"
        pagination={false}
        size="small"
        bordered
      />
    );
  };
  

  return (
    <div className="p-6">
      <Title level={3}>Danh sách bài Reading & Câu hỏi</Title>
      <Table
        columns={[
          { title: "ID", dataIndex: "reading_test_id" },
          { title: "Key Test", dataIndex: "key_test" },
          { title: "Tiêu đề", dataIndex: "tittle" },
          {
            title: "Thời lượng",
            dataIndex: "duration",
            render: (d: number) => `${d} phút`,
          },
          {
            title: "Tổng số câu hỏi",
            render: (_: any, record: ReadingTest) =>
              Object.values(record.parts).reduce((total, group: any[]) => total + group.length, 0),
          },
        ]}
        dataSource={data}
        rowKey="reading_test_id"
        loading={loading}
        bordered
        expandable={{
          expandedRowRender: (record: ReadingTest) => (
            <>
              {Object.entries(record.parts).map(([part, items]) => (
                <div key={part} className="mb-4">
                  <b>Part {part.replace("part", "")}</b>
                  {renderPartTable(items, part)}
                </div>
              ))}
            </>
          ),
        }}
      />

      <Modal
        title="Cập nhật câu hỏi"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditItem(null);
        }}
        onOk={() => {
          form.validateFields().then(handleUpdateItem);
        }}
      >
        <Form form={form} layout="vertical">
          {editItem && renderModalForm(editItem.part)}
        </Form>
      </Modal>
    </div>
  );
}
