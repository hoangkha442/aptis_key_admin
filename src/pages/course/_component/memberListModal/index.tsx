import { Modal, Table, Button, Popconfirm, Tag } from "antd";

export default function MemberListModal({
  open,
  onClose,
  members,
  onRemove,
}: any) {
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color = role === "admin" ? "volcano" : role === "lecturer" ? "geekblue" : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status || "Chưa xác định"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xóa thành viên này?"
          onConfirm={() => onRemove(record.course_member_id)}
        >
          <Button danger size="small">Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal width="70%" open={open} onCancel={onClose} footer={null} title="Danh sách thành viên">
      <Table
        dataSource={members}
        columns={columns}
        rowKey="course_member_id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
}
