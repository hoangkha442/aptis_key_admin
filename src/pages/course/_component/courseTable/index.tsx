import { Table, Button } from "antd";
import { EyeOutlined, UserAddOutlined, DeleteOutlined } from "@ant-design/icons";

export default function CourseTable({ courses, onDelete, onAddMember, onViewMembers, onEdit, }: any) {
  const columns = [
    { title: "Tên khóa học", dataIndex: "course_name" },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            icon={<UserAddOutlined />}
            onClick={() => onAddMember(record.course_id)}
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => onViewMembers(record.course_id)}
          />
          <Button
  type="default"
  onClick={() => onEdit(record)}
>
  Sửa
</Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.course_id)}
          />
        </div>
      ),
    },
  ];

  return <Table rowKey="course_id" dataSource={courses} columns={columns} pagination={false} />;
}